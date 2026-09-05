import { routing } from '@/i18n/routing';

export const runtime = 'edge';

const base = 'https://ipstar.net';
const now = new Date().toISOString();

interface RouteEntry {
  path: string;
  priority: number;
  freq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const routes: RouteEntry[] = [
  { path: '', priority: 1.0, freq: 'monthly' },
  { path: '/tools', priority: 0.95, freq: 'monthly' },
  { path: '/tools/ip-reputation', priority: 1.0, freq: 'weekly' },
  { path: '/tools/ip-geo', priority: 0.95, freq: 'weekly' },
  { path: '/tools/proxy-tester', priority: 0.9, freq: 'weekly' },
  { path: '/guides', priority: 0.85, freq: 'monthly' },
  { path: '/guides/tiktok-shop', priority: 0.85, freq: 'monthly' },
  { path: '/guides/web-scraping', priority: 0.85, freq: 'monthly' },
  { path: '/guides/static-isp-ecommerce', priority: 0.85, freq: 'monthly' },
  { path: '/reviews', priority: 0.9, freq: 'weekly' },
  { path: '/blog', priority: 0.85, freq: 'weekly' },
  { path: '/about', priority: 0.5, freq: 'yearly' },
  { path: '/contact', priority: 0.4, freq: 'yearly' },
  { path: '/privacy', priority: 0.3, freq: 'yearly' },
  { path: '/terms', priority: 0.3, freq: 'yearly' },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const route of routes) {
    for (const locale of routing.locales) {
      const url = `${base}/${locale}${route.path}`;
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${route.freq}</changefreq>\n`;
      xml += `    <priority>${route.priority.toFixed(2)}</priority>\n`;
      for (const altLocale of routing.locales) {
        const altUrl = `${base}/${altLocale}${route.path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${escapeXml(altUrl)}"/>\n`;
      }
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
