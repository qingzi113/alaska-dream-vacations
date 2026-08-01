import { getListings } from '../lib/hostaway.js';
export async function GET({ site }) {
  const base = (site || 'https://alaskadreamvacation.com').toString().replace(/\/$/, '');
  const listings = await getListings();
  const urls = ['/', '/guide', '/about', ...listings.map((c) => `/homes/${c.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
