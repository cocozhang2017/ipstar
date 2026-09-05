import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader, CardLinkGrid } from '@/components/ui/card';
import { ShoppingCart, FileSearch, BookOpen } from 'lucide-react';


export const runtime = 'edge';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'guides' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/guides`,
      languages: {
        en: '/en/guides',
        zh: '/zh/guides',
      },
    },
  };
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  const guides = [
    {
      href: '/guides/tiktok-shop',
      title: t('guides.tiktok.title'),
      description: t('guides.tiktok.desc'),
      badge: t('guides.tiktok.badge'),
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      href: '/guides/web-scraping',
      title: t('guides.scraping.title'),
      description: t('guides.scraping.desc'),
      badge: t('guides.scraping.badge'),
      icon: <FileSearch className="h-5 w-5" />,
    },
    {
      href: '/guides/static-isp-ecommerce',
      title: t('guides.isp.title'),
      description: t('guides.isp.desc'),
      badge: t('guides.isp.badge'),
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  const cards = [
    { title: t('cards.howWeTest.title'), body: t('cards.howWeTest.body') },
    { title: t('cards.affiliatePolicy.title'), body: t('cards.affiliatePolicy.body') },
    { title: t('cards.lastUpdated.title'), body: t('cards.lastUpdated.body') },
  ];

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeader
        eyebrow={t('sectionHeader.eyebrow')}
        title={t('sectionHeader.title')}
        description={t('sectionHeader.desc')}
      />
      <div className="mt-8">
        <CardLinkGrid items={guides} cols={3} />
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {cards.map((b) => (
          <div key={b.title} className="card card-body">
            <h3 className="text-[15px] font-semibold">{b.title}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
