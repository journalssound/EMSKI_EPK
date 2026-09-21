/**
 * /blackout — per-route Open Graph tags (Cloudflare Pages Function)
 *
 * The site is a single-page app: every route ships index.html's <head>, and
 * link scrapers (iMessage, Slack, Instagram, X) never run the JS. Left alone,
 * a shared link to /blackout previews as the parent EPK — its title and the
 * blue E. This swaps the head for the [BLACKOUT] kit's before the HTML
 * leaves the edge. The page itself is untouched.
 *
 * Matches /blackout exactly (Pages routes are case-sensitive); share the
 * lowercase URL.
 */

const META = {
  title: "EMSKI [BLACKOUT] — Artist Press Kit",
  description:
    "presence is protest. The [BLACKOUT] press kit — DJ set, credits, stats, press photos, contact.",
  url: "https://emski-epk.com/blackout",
  image: "https://emski-epk.com/og-blackout.jpg",
};

export async function onRequest({ request, env }) {
  // Fetch the SPA shell at "/" rather than the request path, so the assets
  // layer serves index.html instead of routing back into this function.
  const shell = await env.ASSETS.fetch(new URL("/", request.url));
  const content = (value) => ({
    element(el) {
      el.setAttribute("content", value);
    },
  });

  return new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(META.title);
      },
    })
    .on('meta[name="description"]', content(META.description))
    .on('meta[property="og:title"]', content(META.title))
    .on('meta[property="og:description"]', content(META.description))
    .on('meta[property="og:url"]', content(META.url))
    .on('meta[property="og:image"]', content(META.image))
    .on('meta[name="twitter:title"]', content(META.title))
    .on('meta[name="twitter:description"]', content(META.description))
    .on('meta[name="twitter:image"]', content(META.image))
    .transform(shell);
}
