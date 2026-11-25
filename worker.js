export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Google Search Console HTML verification file handler
    if (url.pathname === '/google221afec29cd589d7.html' || url.pathname === '/google221afec29cd589d7') {
      return new Response('google-site-verification: google221afec29cd589d7.html', {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        }
      });
    }

    if (url.pathname === '/google221afec29cd589d7.htm') {
      return new Response('google-site-verification: google221afec29cd589d7.htm', {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        }
      });
    }

    // Serve static assets
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return fetch(request);
  }
};
