import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const base = 'https://ipstar.net';
const now = new Date();

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

const routes: { path: string; priority: number; freq: Freq }[] = [
  { path: '', priority: 1.0, freq: 'monthly' }, // 首页(/en、/zh)
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

// 为每个 locale × 路由生成一条 sitemap 条目,带 hreflang alternates 互指。
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of routing.locales) {
      const localizedPath = `/${locale}${route.path}`;
      entries.push({
        url: `${base}${localizedPath}`,
        lastModified: now,
        changeFrequency: route.freq,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${base}/en${route.path}`,
            zh: `${base}/zh${route.path}`,
          },
        },
      });
    }
  }

  return entries;
}
