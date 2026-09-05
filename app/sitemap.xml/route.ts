import { routing } from '@/i18n/routing';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const base = 'https://ipstar.net';

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

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const now = new Date().toISOString().slice(0, 10);
  const parts: string[] = [];
  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>');
  parts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">');

  for (const route of routes) {
    for (const locale of routing.locales) {
      const url = `${base}/${locale}${route.path}`;
      parts.push('  <url>');
      parts.push(`    <loc>${esc(url)}</loc>`);
      parts.push(`    <lastmod>${now}</lastmod>`);
      parts.push(`    <changefreq>${route.freq}</changefreq>`);
      parts.push(`    <priority>${route.priority.toFixed(2)}</priority>`);
      for (const alt of routing.locales) {
        parts.push(`    <xhtml:link rel="alternate" hreflang="${alt}" href="${esc(`${base}/${alt}${route.path}`)}"/>`);
      }
      parts.push('  </url>');
    }
  }

  parts.push('</urlset>');
  const xml = parts.join('\n');

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
