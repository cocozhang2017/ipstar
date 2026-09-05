import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/card';

// Reviews 详情占位：每个 slug 走这个页面；等接入内容源后替换为真实内容渲染

const known = [
  'netnut-isp',
  'smartproxy-residential',
  'geosurf',
  'brightdata',
  'oxylabs',
  'proxyrack-dc',
] as const;


export function generateStaticParams() {
  return known.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'reviewDetail' });
  const name = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${t('h1Prefix')}${name}`,
    alternates: {
      canonical: `/${locale}/reviews/${slug}`,
      languages: {
        en: `/en/reviews/${slug}`,
        zh: `/zh/reviews/${slug}`,
      },
    },
  };
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('reviewDetail');
  const whatYoullSeeItems = t.raw('whatYoullSeeItems') as string[];

  const pretty = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="container-page py-10 sm:py-14 max-w-3xl">
      <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> {t('allReviews')}
      </Link>

      <header className="mt-4">
        <Badge tone="muted">{t('badge')}</Badge>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight capitalize">
          {t('h1Prefix')}{pretty}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t('comingSoonDesc')}
        </p>
      </header>

      <div className="prose-technical mt-8">
        <h2>{t('whatYoullSeeTitle')}</h2>
        <ul>
          {whatYoullSeeItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <h2>{t('needProviderTitle')}</h2>
        <p>{t('needProviderDesc')}</p>
      </div>
    </div>
  );
}
