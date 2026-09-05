'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

/**
 * 奢华胶囊语言切换器(与 ThemeToggle 外观一致)
 * 激活项:渐变背景 + 白色文字; 非激活:灰调前景 + hover 增强
 */
export function LanguageSwitcher({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function switchTo(next: 'en' | 'zh') {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  const label: Record<string, string> = { en: 'EN', zh: '中文' };
  const itemPadding = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';
  // 根据当前 locale 计算激活滑块位置 (2 项定宽分配)
  const activeIndex = routing.locales.findIndex((l) => l === locale);

  return (
    <div
      className={cn(
        'group relative inline-flex items-center gap-0.5 rounded-full border px-1 py-1',
        'bg-background-elevated/70 backdrop-blur-md',
        'border-border-strong/80',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_-14px_hsl(235_50%_20%_/_0.22)]',
        'transition-all duration-200 hover:border-accent/50',
        className,
      )}
    >
      {/* 高亮滑块 */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-1 w-[calc(50%-4px)] rounded-full',
          'bg-grad-primary',
          'shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset,0_8px_20px_-8px_hsl(var(--accent-strong)/0.55)]',
          'transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
          mounted && activeIndex === 1 ? 'left-[calc(50%-0px)]' : 'left-1',
          !mounted && 'opacity-0',
        )}
      />
      {routing.locales.map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          aria-label={l === 'en' ? 'Switch to English' : '切换到中文'}
          className={cn(
            'relative z-10 rounded-full font-semibold tracking-wide',
            itemPadding,
            'transition-colors duration-200',
            mounted && i === activeIndex
              ? 'text-white'
              : 'text-muted-foreground group-hover:text-foreground',
          )}
        >
          {label[l]}
        </button>
      ))}
    </div>
  );
}
