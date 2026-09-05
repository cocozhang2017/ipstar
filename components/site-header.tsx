'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X, Search, Shield, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

const nav = [
  { labelKey: 'tools', href: '/tools' },
  { labelKey: 'guides', href: '/guides' },
  { labelKey: 'reviews', href: '/reviews' },
  { labelKey: 'blog', href: '/blog' },
] as const;

/**
 * IPStar Header — 奢华玻璃拟态版本
 * - 背景:高斯模糊玻璃 + 内高光 + 下边框渐变
 * - Logo:渐变发光盾牌图标 + 渐变 "Star" 文字
 * - 导航:胶囊玻璃项,激活态注入主色
 * - 右侧:语言 + 主题 双胶囊 + 渐变主按钮 "Check IP"
 */
export function SiteHeader() {
  const t = useTranslations('common.header');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        // 玻璃底 + 分层阴影
        'bg-[hsl(var(--glass))] backdrop-blur-xl supports-[backdrop-filter]:bg-[hsl(var(--glass))]',
        '-webkit-backdrop-blur-xl',
        // 下边框:1px 极细线 + 外投影(悬浮投影感)
        'border-b border-[hsl(var(--glass-border))]',
        'shadow-[0_1px_0_0_hsl(0_0%_100%_/_0.65)_inset,0_18px_40px_-24px_hsl(235_70%_20%_/_0.25)]',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        {/* === Logo === */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight group"
          aria-label={t('homeAria')}
        >
          {/* 盾牌 logo(渐变+发光) */}
          <span className="relative inline-flex h-9 w-9 items-center justify-center">
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl bg-grad-primary opacity-95 shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset,0_10px_24px_-8px_hsl(var(--accent-strong)/0.6)]"
            />
            {/* 顶部高光 */}
            <span
              aria-hidden
              className="absolute inset-x-1 top-1 h-1/3 rounded-t-[10px] bg-gradient-to-b from-white/60 to-transparent"
            />
            <Shield
              className="relative h-4.5 w-4.5 text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]"
              strokeWidth={2.3}
              style={{ width: 18, height: 18 }}
            />
            {/* 发光光晕 */}
            <span
              aria-hidden
              className="absolute -inset-1.5 -z-10 rounded-2xl blur-md opacity-60 bg-grad-primary"
            />
          </span>
          {/* 文字 */}
          <span className="text-lg sm:text-xl leading-none">
            IP
            <span className="text-grad-primary bg-[length:180%_180%] animate-shimmer-x">
              Star
            </span>
          </span>
        </Link>

        {/* === 桌面导航 === */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* 胶囊导航外框 */}
          <div
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full border px-1 py-1',
              'bg-background-elevated/60 backdrop-blur-md border-border-strong/70',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_24px_-14px_hsl(235_50%_20%_/_0.22)]',
            )}
          >
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'text-white'
                      : 'text-foreground/80 hover:text-foreground',
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-grad-primary shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset,0_8px_20px_-8px_hsl(var(--accent-strong)/0.55)]"
                    />
                  )}
                  <span className="relative z-10">{t(`nav.${item.labelKey}`)}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* === 右侧控制组 === */}
        <div className="flex items-center gap-2">
          {/* 桌面:语言 + 主题双胶囊 + CTA */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher size="md" />
            <ThemeToggle size="md" />
            <Link
              href="/tools/ip-reputation"
              className="btn-primary h-9 px-4 text-xs gap-1.5"
            >
              <Search className="h-3.5 w-3.5" />
              {t('checkIp')}
              <ChevronRight className="h-3.5 w-3.5 -ml-0.5" strokeWidth={2.4} />
            </Link>
          </div>
          {/* 平板:紧凑 */}
          <div className="hidden sm:flex md:hidden items-center gap-1.5">
            <LanguageSwitcher size="sm" />
            <ThemeToggle size="sm" />
          </div>

          {/* 移动端汉堡 */}
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong/80 bg-background-elevated/70 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] text-foreground hover:border-accent/50 transition-colors"
            aria-label={t('toggleNavAria')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>

      {/* === 移动端展开菜单 === */}
      {open && (
        <div className="lg:hidden border-t border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] backdrop-blur-xl">
          <div className="container-page py-3.5 flex flex-col gap-1.5">
            {/* 移动端切换器行 */}
            <div className="px-1 py-2 flex items-center justify-between gap-2">
              <LanguageSwitcher size="sm" />
              <ThemeToggle size="sm" />
            </div>
            <div className="h-px shimmer-divider my-1" />
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all',
                    active
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-foreground/85 hover:bg-muted/70 hover:text-foreground',
                  )}
                >
                  <span>{t(`nav.${item.labelKey}`)}</span>
                  <ChevronRight className="h-4 w-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              );
            })}
            <Link
              href="/tools/ip-reputation"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 justify-center"
            >
              <Search className="h-4 w-4" />
              {t('checkIpReputation')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
