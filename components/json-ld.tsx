import { routing } from '@/i18n/routing';

const siteUrl = 'https://ipstar.net';

/**
 * 全站 JSON-LD 结构化数据
 * - WebSite: 含 SearchAction(站内搜索) + 多语言 alternate
 * - Organization: 品牌信息 + logo + sameAs
 * 注意: 仅在 locale 段内渲染(跟随页面语言)
 */
export function JsonLd({ locale }: { locale: string }) {
  const altLanguages = routing.locales
    .filter((l) => l !== locale)
    .map((l) => `${siteUrl}/${l}`);

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IPStar',
    alternateName: 'IPStar Tools',
    url: `${siteUrl}/${locale}`,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    description:
      locale === 'zh'
        ? '免费的 IP 信誉查询、地理定位与代理检测工具,面向小卖家、爬虫与开发者。'
        : 'Free IP reputation, geolocation and proxy testing tools for small sellers, scrapers and developers.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/tools/ip-reputation?ip={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    ...(altLanguages.length ? { alternate: altLanguages } : {}),
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IPStar',
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    image: `${siteUrl}/opengraph-image`,
    description:
      locale === 'zh'
        ? 'IPStar 提供轻量、隐私友好的 IP 与代理工具。'
        : 'IPStar provides lightweight, privacy-friendly IP and proxy tools.',
    foundingDate: '2025',
    knowsAbout: [
      'IP geolocation',
      'IP reputation',
      'Proxy testing',
      'Blacklist checking',
      'Web scraping',
      'E-commerce proxies',
    ],
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  );
}
