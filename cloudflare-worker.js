
// Cloudflare Worker: CORS-friendly RSS proxy
// 1) Deploy to Cloudflare Workers dashboard
// 2) Set your endpoint in the dashboard: https://<subdomain>.workers.dev
// 3) In your page, set: window.PEACE_RSS_PROXY = 'https://<subdomain>.workers.dev?url=';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const target = url.searchParams.get('url');
      if (!target) {
        return new Response('Missing ?url=', { status: 400 });
      }
      const res = await fetch(target, { headers: { 'User-Agent': 'PeaceSentinel/1.0 (+https://planetaryrestorationarchive.com)' }});
      const body = await res.text();
      return new Response(body, {
        status: res.status,
        headers: {
          'Content-Type': res.headers.get('content-type') || 'text/xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
    } catch (e) {
      return new Response(`Proxy error: ${e.message}`, { status: 502 });
    }
  }
};
