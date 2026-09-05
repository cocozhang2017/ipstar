import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/card';

const slugs = [
  'my-ip-score-70-is-it-safe',
  'proxy-works-in-browser-fails-in-scraper',
  'api-wrapper-pattern',
  'tiktok-shop-account-health-checklist',
  'static-isp-vs-residential-rotating',
  'blacklist-delisting-playbook',
] as const;


export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blogPost' });
  return {
    title: t('badge', { slug }),
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        en: `/en/blog/${slug}`,
        zh: `/zh/blog/${slug}`,
      },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blogPost');
  const shortVersionSteps = t.raw('shortVersionSteps') as string[];

  const title = slug
    .replace(/-/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

  return (
    <div className="container-page py-10 sm:py-14 max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> {t('allPosts')}
      </Link>

      <header className="mt-4">
        <Badge tone="muted">{t('badge', { slug })}</Badge>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t('comingSoonDesc')}
        </p>
      </header>

      <article className="prose-technical mt-8">
        <h2>{t('whyPublishTitle')}</h2>
        <p>{t('whyPublishDesc')}</p>
        <h2>{t('shortVersionTitle')}</h2>
        <ol>
          {shortVersionSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </article>
    </div>
  );
}
