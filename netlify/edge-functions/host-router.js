export default async (request, context) => {
  const url = new URL(request.url);
  const host = url.hostname;

  if (host === 'emskitour.com' || host === 'www.emskitour.com') {
    const path = url.pathname;

    // Only rewrite HTML page requests, not static assets
    if (path === '/' || path === '') {
      return context.rewrite('/emski-music/index.html');
    }

    // Don't double-rewrite paths that already point to real asset locations
    if (path.startsWith('/emski-music/') || path.startsWith('/ninjatune/') ||
        path.startsWith('/photos/') || path.startsWith('/covers/')) {
      return context.next();
    }

    // Rewrite other page requests into /emski-music/
    return context.rewrite('/emski-music' + path);
  }

  return context.next();
};
