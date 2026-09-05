import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  ShieldCheck,
  Globe2,
  Zap,
  CheckCircle2,
  ShieldAlert,
  ServerCrash,
  Search,
  ArrowRight,
  BookOpen,
  ShoppingCart,
  FileSearch,
  Sparkles,
  Gauge,
  Lock,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, Badge, SectionHeader, CardLinkGrid } from '@/components/ui/card';
import { Input, Field } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', zh: '/zh' },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const tools = [
    {
      href: '/tools/ip-reputation',
      title: t('tools.reputation.title'),
      description: t('tools.reputation.desc'),
      badge: t('tools.reputation.badge'),
      icon: <ShieldAlert className="h-5 w-5" strokeWidth={2} />,
    },
    {
      href: '/tools/ip-geo',
      title: t('tools.geo.title'),
      description: t('tools.geo.desc'),
      badge: t('tools.geo.badge'),
      icon: <Globe2 className="h-5 w-5" strokeWidth={2} />,
    },
    {
      href: '/tools/proxy-tester',
      title: t('tools.proxy.title'),
      description: t('tools.proxy.desc'),
      badge: t('tools.proxy.badge'),
      icon: <Zap className="h-5 w-5" strokeWidth={2} />,
    },
  ];

  const guides = [
    {
      href: '/guides/tiktok-shop',
      title: t('guides.tiktok.title'),
      description: t('guides.tiktok.desc'),
      icon: <ShoppingCart className="h-5 w-5" strokeWidth={2} />,
    },
    {
      href: '/guides/web-scraping',
      title: t('guides.scraping.title'),
      description: t('guides.scraping.desc'),
      icon: <FileSearch className="h-5 w-5" strokeWidth={2} />,
    },
    {
      href: '/guides/static-isp-ecommerce',
      title: t('guides.isp.title'),
      description: t('guides.isp.desc'),
      icon: <BookOpen className="h-5 w-5" strokeWidth={2} />,
    },
  ];

  const features = [
    {
      title: t('features.privacy.title'),
      desc: t('features.privacy.desc'),
      icon: <Lock className="h-5 w-5" strokeWidth={2} />,
      tint: 'from-violet-500/20 to-indigo-500/10',
      border: 'border-violet-500/30',
    },
    {
      title: t('features.seller.title'),
      desc: t('features.seller.desc'),
      icon: <CheckCircle2 className="h-5 w-5" strokeWidth={2} />,
      tint: 'from-sky-500/20 to-cyan-500/10',
      border: 'border-sky-500/30',
    },
    {
      title: t('features.honest.title'),
      desc: t('features.honest.desc'),
      icon: <ServerCrash className="h-5 w-5" strokeWidth={2} />,
      tint: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
    },
    {
      title: t('features.fast.title'),
      desc: t('features.fast.desc'),
      icon: <Gauge className="h-5 w-5" strokeWidth={2} />,
      tint: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
    },
  ];

  const heroStats = [
    { label: t('hero.stats.accuracy'), value: '99.2%' },
    { label: t('hero.stats.latency'), value: '<120ms' },
    { label: t('hero.stats.datasets'), value: '12+' },
  ];

  return (
    <div className="animate-fade-in">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* ===== 浮动光晕 blob 背景 ===== */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob blob-accent absolute -top-24 -left-16 h-72 w-72 animate-float-y" />
          <div
            className="blob blob-highlight absolute top-10 right-0 h-72 w-72 animate-float-y"
            style={{ animationDelay: '1.6s' }}
          />
          <div
            className="blob blob-accent absolute bottom-0 left-1/3 h-56 w-56 opacity-50 animate-float-y"
            style={{ animationDelay: '3.2s' }}
          />
          {/* 网格(比 body::before 更密更亮,只在 hero 顶部) */}
          <div
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--border)/0.7) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--border)/0.7) 1px,transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage:
                'radial-gradient(ellipse 80% 60% at 50% 10%, #000 45%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 60% at 50% 10%, #000 45%, transparent 80%)',
            }}
          />
        </div>

        <div className="container-page pt-14 sm:pt-20 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* === 左:文案 === */}
            <div className="lg:col-span-7">
              {/* 徽章:渐变底+星芒图标 */}
              <div className="inline-flex items-center">
                <span className="badge-accent">
                  <Sparkles
                    className="h-3 w-3 -ml-0.5"
                    strokeWidth={2.4}
                  />
                  {t('hero.badge')}
                </span>
              </div>

              {/* H1:shimmer 渐变 + 字重加粗 */}
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.08] tracking-[-0.03em]">
                <span className="shimmer-text">{t('hero.h1')}</span>
              </h1>

              <p className="mt-5 sm:mt-6 text-base sm:text-lg leading-relaxed text-foreground/75 max-w-[620px]">
                {t('hero.p', { noEnterprise: t('hero.noEnterprise') })}
              </p>

              {/* 数据标签行 */}
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                {heroStats.map((s) => (
                  <span
                    key={s.label}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-2xl',
                      'px-3.5 py-2 text-xs sm:text-[13px]',
                      'border border-[hsl(var(--glass-border))]',
                      'bg-[hsl(var(--glass))] backdrop-blur-md',
                      'shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_-14px_hsl(235_50%_20%_/_0.22)]',
                    )}
                  >
                    <span className="font-bold text-accent text-sm sm:text-base tracking-tight">
                      {s.value}
                    </span>
                    <span className="text-muted-foreground">{s.label}</span>
                  </span>
                ))}
              </div>

              {/* Powered */}
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{t('hero.poweredBy')}</span>
                <span className="opacity-40">·</span>
                <span className="badge-muted !py-0.5">ipapi.is</span>
                <span className="opacity-50">+</span>
                <span className="badge-muted !py-0.5">AbuseIPDB</span>
                <span className="opacity-40">·</span>
                <span>{t('hero.kvCached')}</span>
              </div>
            </div>

            {/* === 右:巨型 3D 表单卡片 === */}
            <div className="lg:col-span-5 lg:pl-6">
              <div className="relative">
                {/* 卡片外发光环 */}
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-[28px] bg-grad-primary opacity-20 blur-2xl"
                />
                <div className="relative gradient-border">
                  <div className="card-hero rounded-2xl p-4.5 sm:p-6">
                    {/* 表单标题条 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-grad-primary text-white shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset,0_8px_16px_-6px_hsl(var(--accent-strong)/0.55)]">
                          <Network
                            className="h-4 w-4"
                            strokeWidth={2.25}
                          />
                        </span>
                        <div>
                          <div className="text-sm font-semibold leading-none">
                            {t('hero.cardTitle')}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {t('hero.cardSubtitle')}
                          </div>
                        </div>
                      </div>
                      <span className="badge-success !py-0.5 text-[11px]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                        </span>
                        {t('hero.statusLive')}
                      </span>
                    </div>

                    <div className="h-px shimmer-divider my-1" />

                    {/* 表单 */}
                    <form
                      className="mt-5"
                      action={`/${locale}/tools/ip-reputation`}
                      method="get"
                    >
                      <Field
                        label={t('hero.fieldLabel')}
                        hint={t('hero.fieldHint')}
                      >
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            name="ip"
                            className="!pl-10 !h-12 text-[15px] !rounded-xl"
                            placeholder={t('hero.placeholder')}
                            inputMode="text"
                            autoComplete="off"
                          />
                        </div>
                      </Field>

                      <Button
                        type="submit"
                        size="lg"
                        className="mt-4 w-full !h-12 text-sm gap-2"
                      >
                        {t('hero.submit')}
                        <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                      </Button>
                    </form>

                    {/* 快捷示例 */}
                    <div className="mt-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                        {t('hero.examplesLabel')}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['8.8.8.8', '1.1.1.1', '208.67.222.222'].map((ip) => (
                          <Link
                            key={ip}
                            href={`/tools/ip-reputation?ip=${ip}`}
                            className="group inline-flex items-center gap-1 rounded-lg border border-border bg-background-elevated/70 px-2.5 py-1.5 text-xs font-mono hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all"
                          >
                            {ip}
                            <ArrowRight className="h-3 w-3 opacity-0 -ml-1.5 group-hover:opacity-60 group-hover:ml-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 角上光泽装饰 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-grad-highlight opacity-80 shadow-[0_0_18px_hsl(var(--highlight)/0.7)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-2 -left-2 h-5 w-5 rounded-full bg-grad-primary opacity-80 shadow-[0_0_18px_hsl(var(--accent)/0.7)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 核心工具入口 ========== */}
      <section className="container-page pb-14">
        <SectionHeader
          eyebrow={t('coreTools.eyebrow')}
          title={t('coreTools.title')}
          description={t('coreTools.desc')}
          action={
            <Link href="/tools" className="btn-outline text-sm">
              {t('coreTools.viewAll')}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          }
        />
        <div className="mt-7">
          <CardLinkGrid items={tools} />
        </div>
      </section>

      {/* ========== Why / Features ========== */}
      <section className="container-page pb-16">
        <SectionHeader
          eyebrow={t('why.eyebrow')}
          title={t('why.title')}
          description={t('why.desc')}
        />
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {features.map((f) => (
            <Card
              key={f.title}
              padded={false}
              className="card-hover relative overflow-hidden"
            >
              {/* 顶部彩色光条 */}
              <div
                aria-hidden
                className={cn(
                  'absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-80',
                  f.tint,
                )}
              />
              {/* 图标背景渐变 */}
              <div className="card-body">
                <div className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      'relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      'border bg-gradient-to-br to-background-elevated',
                      f.border,
                      f.tint,
                      'shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_-14px_hsl(235_50%_20%_/_0.25)]',
                    )}
                  >
                    <span className="text-accent-strong dark:text-accent">
                      {f.icon}
                    </span>
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========== Proxy Guides ========== */}
      <section className="container-page pb-16">
        <SectionHeader
          eyebrow={t('guidesSection.eyebrow')}
          title={t('guidesSection.title')}
          description={t('guidesSection.desc')}
          action={
            <Link href="/guides" className="btn-outline text-sm">
              {t('guidesSection.all')}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          }
        />
        <div className="mt-7">
          <CardLinkGrid items={guides} />
        </div>
      </section>

      {/* ========== CTA 条 ========== */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl">
          {/* 背景装饰 */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-90"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--accent)/0.18) 0%, hsl(var(--background-elevated)) 45%, hsl(var(--highlight)/0.12) 100%)',
            }}
          />
          <div aria-hidden className="blob blob-accent absolute -top-16 -right-10 h-56 w-56 opacity-60" />
          <div aria-hidden className="blob blob-highlight absolute -bottom-16 -left-10 h-56 w-56 opacity-60" />

          <Card
            padded={false}
            className="relative !bg-transparent !border-transparent !shadow-none"
          >
            <div className="card-body sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-xl">
                <Badge tone="accent" className="mb-3">
                  <Sparkles className="h-3 w-3" />
                  {t('cta.badge')}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  <span className="text-grad-primary">{t('cta.title')}</span>
                </h3>
                <p className="mt-2 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                  {t('cta.desc')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/tools/ip-reputation" className="btn-primary !h-11 px-5 text-sm">
                  {t('cta.checkMyIp')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/tools/proxy-tester" className="btn-outline !h-11 px-5 text-sm">
                  <Zap className="h-4 w-4" />
                  {t('cta.testProxy')}
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
