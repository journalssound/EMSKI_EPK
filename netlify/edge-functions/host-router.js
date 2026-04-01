export default async (request, context) => {
  const url = new URL(request.url);
  const host = url.hostname;

  if (host === 'emskitour.com' || host === 'www.emskitour.com') {
    const path = url.pathname === '/' ? '/emski-music/index.html' : '/emski-music' + url.pathname;
    return context.rewrite(path);
  }

  return context.next();
};
