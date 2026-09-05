import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { SectionHeader, Badge } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        zh: '/zh/blog',
      },
    },
  };
}

// 保留 slug + 数字字段(不翻译)。categoryKey 用于决定 Badge tone;
// 显示文案从 t(`posts.${slug}.category`) 取。
const posts = [
  {
    slug: 'my-ip-score-70-is-it-safe',
    categoryKey: 'FAQ',
    readMin: 4,
    publishedAt: '2026-08-29',
  },
  {
    slug: 'proxy-works-in-browser-fails-in-scraper',
    categoryKey: 'Troubleshooting',
    readMin: 7,
    publishedAt: '2026-08-14',
  },
  {
    slug: 'api-wrapper-pattern',
    categoryKey: 'Behind the scenes',
    readMin: 6,
    publishedAt: '2026-07-28',
  },
  {
    slug: 'tiktok-shop-account-health-checklist',
    categoryKey: 'Tutorial',
    readMin: 5,
    publishedAt: '2026-07-11',
  },
  {
    slug: 'static-isp-vs-residential-rotating',
    categoryKey: 'FAQ',
    readMin: 5,
    publishedAt: '2026-06-30',
  },
  {
    slug: 'blacklist-delisting-playbook',
    categoryKey: 'Tutorial',
    readMin: 8,
    publishedAt: '2026-06-09',
  },
] as const;

function tone(cat: string) {
  switch (cat) {
    case 'FAQ':
      return 'accent' as const;
    case 'Troubleshooting':
      return 'warning' as const;
    case 'Tutorial':
      return 'success' as const;
    default:
      return 'muted' as const;
  }
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');

  return (
    <div className="container-page py-10 sm:py-14 max-w-5xl">
      <SectionHeader
        eyebrow={t('sectionHeader.eyebrow')}
        title={t('sectionHeader.title')}
        description={t('sectionHeader.desc')}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="card card-body group flex flex-col gap-2.5 transition-all hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={tone(p.categoryKey)}>{t(`posts.${p.slug}.category`)}</Badge>
              <span className="text-xs text-muted-foreground">{p.publishedAt}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {p.readMin} {t('readMinSuffix')}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight group-hover:text-accent transition-colors">
              {t(`posts.${p.slug}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {t(`posts.${p.slug}.excerpt`)}
            </p>
            <div className="text-sm text-accent inline-flex items-center gap-1 mt-1">
              {t('readPost')} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
