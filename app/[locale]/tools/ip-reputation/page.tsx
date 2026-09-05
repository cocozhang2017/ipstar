import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IpReputationForm } from '@/components/tools/ip-reputation-form';
import { ShieldAlert, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ipReputation' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/tools/ip-reputation`,
      languages: {
        en: '/en/tools/ip-reputation',
        zh: '/zh/tools/ip-reputation',
      },
    },
  };
}

export default async function IpReputationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ip?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ipReputation');
  const homeT = await getTranslations('home');

  return (
    <div className="animate-fade-in">
      {/* PageHero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob blob-accent absolute -top-20 left-10 h-64 w-64 animate-float-y" />
          <div
            className="blob blob-highlight absolute top-0 right-0 h-56 w-56 animate-float-y"
            style={{ animationDelay: '1.4s' }}
          />
        </div>
        <div className="container-page pt-10 sm:pt-14 pb-4 sm:pb-6 max-w-6xl">
          <div className="relative gradient-border">
            <div className="card-hero rounded-2xl p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="badge-accent">
                    <Sparkles className="h-3 w-3" strokeWidth={2.4} />
                    {t('eyebrow')}
                  </span>
                  <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-[1.1]">
                    <span className="shimmer-text">{t('title')}</span>
                  </h1>
                  <p className="mt-3 text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
                    {t('desc')}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div
                    className={cn(
                      'relative h-16 w-16 rounded-2xl flex items-center justify-center',
                      'border border-danger/30 bg-danger/10',
                      'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_28px_-12px_hsl(var(--danger)/0.4)]',
                    )}
                  >
                    <ShieldAlert className="h-8 w-8 text-danger" strokeWidth={2} />
                  </div>
                  <div
                    className={cn(
                      'relative h-16 w-16 rounded-2xl flex items-center justify-center',
                      'border border-success/30 bg-success/10',
                      'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_28px_-12px_hsl(var(--success)/0.4)]',
                    )}
                  >
                    <ShieldCheck className="h-8 w-8 text-success" strokeWidth={2} />
                  </div>
                </div>
              </div>
              <div className="h-px shimmer-divider mt-6" />
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  homeT('tools.reputation.title'),
                  homeT('tools.geo.title'),
                  homeT('tools.proxy.title'),
                ].map((toolName, i) => {
                  const href = ['/tools/ip-reputation', '/tools/ip-geo', '/tools/proxy-tester'][i];
                  const active = i === 0;
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all',
                        active
                          ? 'border-accent/40 bg-accent/10 text-accent-strong font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_22px_-12px_hsl(var(--accent)/0.35)]'
                          : 'border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] text-foreground/85 hover:border-accent/40 hover:text-foreground backdrop-blur-md',
                      )}
                    >
                      <span>{toolName}</span>
                      <ArrowRight className={cn('h-4 w-4 transition-transform', active ? 'text-accent' : 'text-muted-foreground group-hover:translate-x-0.5')} strokeWidth={2.2} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-20 max-w-6xl">
        <InitialIpDecorator searchParams={searchParams} />
      </section>
    </div>
  );
}

async function InitialIpDecorator({
  searchParams,
}: {
  searchParams: Promise<{ ip?: string }>;
}) {
  const sp = await searchParams;
  return <IpReputationForm initialIp={sp.ip} />;
}
