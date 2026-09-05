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
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        zh: '/zh/about',
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const whatWeAre = t.raw('whatWeAre') as string[];
  const whatWeNot = t.raw('whatWeNot') as string[];
  const affiliateRules = t.raw('affiliateRules') as string[];

  return (
    <div className="container-page py-10 sm:py-14 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> {t('backToHome')}
      </Link>

      <header className="mt-4">
        <Badge tone="accent">{t('badge')}</Badge>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          {t('h1')}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t('intro')}
        </p>
      </header>

      <div className="prose-technical mt-8">
        <h2>{t('whatWeAreTitle')}</h2>
        <ul>
          {whatWeAre.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h2>{t('whatWeNotTitle')}</h2>
        <ul>
          {whatWeNot.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h2>{t('affiliateTitle')}</h2>
        <p>{t('affiliateIntro')}</p>
        <ul>
          {affiliateRules.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h2>{t('privacyTitle')}</h2>
        <p>{t('privacyDesc')}</p>
      </div>
    </div>
  );
}
