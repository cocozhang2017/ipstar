import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/card';


export const runtime = 'edge';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: '/en/privacy',
        zh: '/zh/privacy',
      },
    },
  };
}

type Section = {
  title: string;
  desc?: string;
  items?: string[];
  descAfter?: string;
};

const updated = '2026-09-01';

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');
  const sections = t.raw('sections') as Section[];

  return (
    <div className="container-page py-10 sm:py-14 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> {t('backToHome')}
      </Link>

      <header className="mt-4">
        <Badge tone="muted">{t('lastUpdatedLabel', { date: updated })}</Badge>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          {t('h1')}
        </h1>
      </header>

      <div className="prose-technical mt-6">
        <p className="text-sm text-muted-foreground">{t('intro')}</p>

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
            {section.descAfter && <p>{section.descAfter}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
