import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Star, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { SectionHeader, Badge } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reviews' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/reviews`,
      languages: {
        en: '/en/reviews',
        zh: '/zh/reviews',
      },
    },
  };
}

// 保留 slugs 顺序与数字指标(不翻译)。文本字段从 t(`data.${slug}.xxx`) 取。
const slugs = [
  'netnut-isp',
  'smartproxy-residential',
  'geosurf',
  'brightdata',
  'oxylabs',
  'proxyrack-dc',
] as const;

const metrics: Record<
  (typeof slugs)[number],
  {
    avgLatencyMs: number;
    successRatePct: number;
    ipReputationMin: number;
    pricePerUnit: string;
    updatedAt: string;
    rating: 1 | 2 | 3 | 4 | 5;
  }
> = {
  'netnut-isp': { avgLatencyMs: 132, successRatePct: 94, ipReputationMin: 78, pricePerUnit: '$4.9 / IP / mo', updatedAt: '2026-08-11', rating: 4 },
  'smartproxy-residential': { avgLatencyMs: 540, successRatePct: 89, ipReputationMin: 62, pricePerUnit: '$4.2 / GB', updatedAt: '2026-07-20', rating: 4 },
  geosurf: { avgLatencyMs: 620, successRatePct: 82, ipReputationMin: 47, pricePerUnit: '$5.5 / GB', updatedAt: '2026-06-30', rating: 3 },
  brightdata: { avgLatencyMs: 480, successRatePct: 93, ipReputationMin: 68, pricePerUnit: '$8–$14 / GB (varies by tier)', updatedAt: '2026-08-01', rating: 3 },
  oxylabs: { avgLatencyMs: 450, successRatePct: 92, ipReputationMin: 70, pricePerUnit: '$10–$15 / GB typical', updatedAt: '2026-08-01', rating: 3 },
  'proxyrack-dc': { avgLatencyMs: 95, successRatePct: 88, ipReputationMin: 55, pricePerUnit: '$0.65 avg / GB', updatedAt: '2026-05-22', rating: 4 },
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < n ? 'fill-warning text-warning' : 'fill-none text-muted-foreground/40',
          )}
        />
      ))}
    </div>
  );
}

export default async function ReviewsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('reviews');

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeader
        eyebrow={t('sectionHeader.eyebrow')}
        title={t('sectionHeader.title')}
        description={t('sectionHeader.desc')}
      />

      <div className="mt-8 space-y-4">
        {slugs.map((slug) => {
          const m = metrics[slug];
          const tier = t(`data.${slug}.tier`);
          const isGiant = tier === 'giant';
          const pros = t.raw(`data.${slug}.pros`) as string[];
          const cons = t.raw(`data.${slug}.cons`) as string[];
          const hasReadMore = t.has(`data.${slug}.readMore`);

          return (
            <article
              key={slug}
              className="card card-body flex flex-col lg:flex-row gap-5 lg:gap-8"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={isGiant ? 'muted' : 'accent'}>
                    {isGiant ? t('tierLabels.giant') : t('tierLabels.smallMid')}
                  </Badge>
                  <Badge tone="muted">{t(`data.${slug}.category`)}</Badge>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1 ml-auto">
                    <Clock className="h-3 w-3" /> {t('updatedLabel', { date: m.updatedAt })}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {t(`data.${slug}.name`)}
                  </h3>
                  <Stars n={m.rating} />
                </div>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`data.${slug}.summary`)}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  <div>
                    <div className="text-xs font-medium text-success flex items-center gap-1 mb-1">
                      <CheckCircle2 className="h-3 w-3" /> {t('prosLabel')}
                    </div>
                    <ul className="space-y-1">
                      {pros.map((p) => (
                        <li key={p} className="text-sm text-foreground/85 list-disc list-inside">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-danger flex items-center gap-1 mb-1">
                      <XCircle className="h-3 w-3" /> {t('consLabel')}
                    </div>
                    <ul className="space-y-1">
                      {cons.map((p) => (
                        <li key={p} className="text-sm text-foreground/85 list-disc list-inside">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/85">{t('bestForLabel')}</span>{' '}
                  <span>{t(`data.${slug}.bestFor`)}</span>
                </div>
              </div>

              {/* 实测指标侧栏 */}
              <aside className="lg:w-[320px] shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-2">
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {t('metricsLabels.avgLatency')}
                  </div>
                  <div className="mt-0.5 font-mono text-lg">{m.avgLatencyMs} ms</div>
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {t('metricsLabels.successRate')}
                  </div>
                  <div className="mt-0.5 font-mono text-lg">{m.successRatePct}%</div>
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {t('metricsLabels.minReputation')}
                  </div>
                  <div className="mt-0.5 font-mono text-lg">{m.ipReputationMin} / 100</div>
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {t('metricsLabels.price')}
                  </div>
                  <div className="mt-0.5 text-sm font-medium">{m.pricePerUnit}</div>
                </div>
                <Link
                  href={`/reviews/${slug}`}
                  className="btn-outline justify-center col-span-2 lg:col-span-1 mt-1"
                >
                  {hasReadMore ? t('fullTeardown') : t('fullReview')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </aside>
            </article>
          );
        })}
      </div>

      <p className="mt-12 text-xs text-muted-foreground leading-relaxed max-w-3xl">
        {t('methodology')}
      </p>
    </div>
  );
}
