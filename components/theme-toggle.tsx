'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type Props = {
  className?: string;
  size?: 'sm' | 'md';
};

/**
 * 主题切换器(胶囊按钮)
 * - 太阳/月亮图标滑动切换,当前激活项使用渐变高亮
 * - 与 LanguageSwitcher 一起放入 header 的 capsule 容器
 */
export function ThemeToggle({ className, size = 'md' }: Props) {
  const { theme, toggleTheme } = useTheme();
  // 避免 SSR 与客户端首次渲染不一致
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const itemPadding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'dark'}
      className={cn(
        'group relative inline-flex items-center gap-0.5 rounded-full border px-1 py-1',
        'bg-background-elevated/70 backdrop-blur-md',
        'border-border-strong/80',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_-14px_hsl(235_50%_20%_/_0.22)]',
        'transition-all duration-200 hover:border-accent/50',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-1 w-[calc(50%-4px)] rounded-full',
          'bg-grad-primary',
          'shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset,0_8px_20px_-8px_hsl(var(--accent-strong)/0.55)]',
          'transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
          mounted && theme === 'dark' ? 'left-[calc(50%-0px)]' : 'left-1',
          !mounted && 'opacity-0',
        )}
      />
      <span
        className={cn(
          'relative z-10 inline-flex items-center justify-center rounded-full',
          itemPadding,
          'transition-colors duration-200',
          mounted && theme === 'light'
            ? 'text-white'
            : 'text-muted-foreground group-hover:text-foreground',
        )}
      >
        <Sun className={cn(iconSize)} strokeWidth={2.1} />
      </span>
      <span
        className={cn(
          'relative z-10 inline-flex items-center justify-center rounded-full',
          itemPadding,
          'transition-colors duration-200',
          mounted && theme === 'dark'
            ? 'text-white'
            : 'text-muted-foreground group-hover:text-foreground',
        )}
      >
        <Moon className={cn(iconSize)} strokeWidth={2.1} />
      </span>
    </button>
  );
}
