import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader, CardLinkGrid } from '@/components/ui/card';
import { ShieldAlert, Globe2, Zap } from 'lucide-react';
import { Link } from '@/i18n/navigation';


export const runtime = 'edge';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/tools`,
      languages: {
        en: '/en/tools',
        zh: '/zh/tools',
      },
    },
  };
}

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tools');

  const tools = [
    {
      href: '/tools/ip-reputation',
      title: t('tools.reputation.title'),
      description: t('tools.reputation.desc'),
      badge: t('tools.reputation.badge'),
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    {
      href: '/tools/ip-geo',
      title: t('tools.geo.title'),
      description: t('tools.geo.desc'),
      badge: t('tools.geo.badge'),
      icon: <Globe2 className="h-5 w-5" />,
    },
    {
      href: '/tools/proxy-tester',
      title: t('tools.proxy.title'),
      description: t('tools.proxy.desc'),
      badge: t('tools.proxy.badge'),
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  const backendSteps = t.raw('backendSteps') as string[];

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeader
        eyebrow={t('sectionHeader.eyebrow')}
        title={t('sectionHeader.title')}
        description={t('sectionHeader.desc')}
      />
      <div className="mt-8">
        <CardLinkGrid items={tools} cols={3} />
      </div>

      <div className="mt-12 card card-body prose-technical max-w-3xl">
        <h3>{t('backendTitle')}</h3>
        <p>{t('backendIntro')}</p>
        <ol>
          {backendSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>{t('backendOutro')}</p>
      </div>
    </div>
  );
}
