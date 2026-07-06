/**
 * GET /.netlify/functions/releases
 *
 * Returns the artist's latest Spotify releases (albums + singles), newest first.
 *
 * Env vars required (set in Netlify → Site settings → Environment variables):
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_ARTIST_ID   (optional — defaults to EMSKI's artist ID)
 *
 * Response shape:
 *   { releases: [{ id, title, label, releaseDate, cover, spotifyUrl, embedUrl, type }] }
 *
 * Cached at the edge for 10 min (stale-while-revalidate 1 day) so we don't
 * hammer Spotify on every page load.
 */

const DEFAULT_ARTIST_ID = "3UqDUfl2fG8ygrFRlgHVZK";

async function getToken(clientId, clientSecret) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`spotify_token_${res.status}`);
  const json = await res.json();
  return json.access_token;
}

exports.handler = async () => {
  const {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_ARTIST_ID,
  } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "spotify_creds_missing" }),
    };
  }

  const artistId = SPOTIFY_ARTIST_ID || DEFAULT_ARTIST_ID;

  try {
    const token = await getToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);

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

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        // Edge cache 10 min, allow stale for a day while revalidating
        "cache-control":
          "public, max-age=600, s-maxage=600, stale-while-revalidate=86400",
      },
      body: JSON.stringify({ releases }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        error: "spotify_fetch_failed",
        message: String(err?.message || err),
      }),
    };
  }
};
