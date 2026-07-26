/**
 * GET /api/releases  (Cloudflare Pages Function)
 *
 * Returns the artist's latest Spotify releases (albums + singles), newest first.
 *
 * Env vars required (Cloudflare dashboard → Workers & Pages → your project →
 * Settings → Variables and Secrets, add for Production + Preview):
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_ARTIST_ID   (optional — defaults to EMSKI's artist ID)
 *
 * Response shape:
 *   { releases: [{ id, title, label, releaseDate, cover, spotifyUrl, embedUrl, type }] }
 *
 * Cached at the Cloudflare edge for 10 min (stale for 1 day while revalidating)
 * so we don't hammer Spotify on every page load.
 */

const DEFAULT_ARTIST_ID = "3UqDUfl2fG8ygrFRlgHVZK";

/**
 * Accepts a raw ID, a spotify:artist: URI, or a full open.spotify.com URL
 * (with or without query params / whitespace) and returns the bare 22-char ID.
 */
function normalizeArtistId(value) {
  if (!value) return null;
  const match = String(value).match(/[0-9A-Za-z]{22}/);
  return match ? match[0] : null;
}

async function getToken(clientId, clientSecret) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`spotify_token_${res.status}`);
  const json = await res.json();
  return json.access_token;
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

export async function onRequestGet(context) {
  const { env, request, waitUntil } = context;

  // Serve from the edge cache when possible.
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_ARTIST_ID } = env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    // 200 so Cloudflare doesn't replace the body with its generic error page;
    // the client only accepts payloads with a non-empty `releases` array.
    return json({ error: "spotify_creds_missing" }, 200, {
      "cache-control": "no-store",
    });
  }

  const artistId = normalizeArtistId(SPOTIFY_ARTIST_ID) || DEFAULT_ARTIST_ID;

  try {
    const token = await getToken(
      SPOTIFY_CLIENT_ID.trim(),
      SPOTIFY_CLIENT_SECRET.trim()
    );

    // 1) List the artist's albums + singles (simplified album objects — no label here)
    const albumsRes = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums` +
        `?include_groups=album,single&market=US&limit=30`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!albumsRes.ok) throw new Error(`spotify_albums_${albumsRes.status}`);
    const albumsJson = await albumsRes.json();

    // Dedupe by lowercased title (collabs often appear multiple times)
    const seen = new Set();
    const unique = [];
    for (const a of albumsJson.items || []) {
      const key = (a.name || "").toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(a);
    }
    unique.sort((a, b) =>
      (b.release_date || "").localeCompare(a.release_date || "")
    );

    // 2) Fetch full album objects (in batches of 20) so we get `label`
    const labelById = {};
    for (let i = 0; i < unique.length; i += 20) {
      const ids = unique.slice(i, i + 20).map((a) => a.id);
      const fullRes = await fetch(
        `https://api.spotify.com/v1/albums?ids=${ids.join(",")}&market=US`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!fullRes.ok) continue;
      const fullJson = await fullRes.json();
      for (const a of fullJson.albums || []) {
        if (a && a.id) labelById[a.id] = a.label || null;
      }
    }

    const releases = unique.map((a) => ({
      id: a.id,
      title: a.name,
      type: a.album_type, // "album" | "single" | "compilation"
      releaseDate: a.release_date,
      cover: a.images?.[0]?.url || null,
      label: labelById[a.id] || null,
      spotifyUrl: a.external_urls?.spotify || null,
      embedUrl: `https://open.spotify.com/embed/album/${a.id}?utm_source=generator&theme=0`,
    }));

    const response = json(
      { releases },
      200,
      {
        // Edge cache 10 min, allow stale for a day while revalidating
        "cache-control":
          "public, max-age=600, s-maxage=600, stale-while-revalidate=86400",
      }
    );

    waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    // 200 so Cloudflare doesn't replace the body with its generic error page;
    // the client only accepts payloads with a non-empty `releases` array.
    return json(
      { error: "spotify_fetch_failed", message: String(err?.message || err) },
      200,
      { "cache-control": "no-store" }
    );
  }
}
