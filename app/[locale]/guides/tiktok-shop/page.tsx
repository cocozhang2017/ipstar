import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tiktokShop' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/guides/tiktok-shop`,
      languages: {
        en: '/en/guides/tiktok-shop',
        zh: '/zh/guides/tiktok-shop',
      },
    },
  };
}

type Section = {
  title: string;
  desc?: string;
  items?: string[];
};

export default async function TiktokShopGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tiktokShop');
  const sections = t.raw('sections') as Section[];

  return (
    <article className="container-page py-10 sm:py-14 max-w-3xl">
      <Link href="/guides" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> {t('backToGuides')}
      </Link>

      <header className="mt-4">
        <div className="flex items-center gap-2">
          <Badge tone="accent">{t('badgeCategory')}</Badge>
          <Badge tone="muted">{t('badgeUpdated')}</Badge>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          {t('h1')}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t('intro')}
        </p>
      </header>

      <div className="prose-technical mt-8">
        {sections.map((section, idx) => (
          <section key={idx}>
            <h2>{section.title}</h2>
            {section.desc && <p>{section.desc}</p>}
            {section.items && section.items.length > 0 && (
              <ul>
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
