'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const THRESHOLD = 480; // 滚动超过此距离时显示按钮

/**
 * 返回顶部按钮(奢华玻璃拟态风格)
 * - 滚动超过 480px 后从右下角淡入 + 上移入场
 * - 点击平滑滚动回顶部
 * - 玻璃拟态圆按钮 + 渐变图标 + 发光效果
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        // 定位:右下角,不被 footer 遮挡
        'group fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40',
        // 圆形玻璃按钮
        'inline-flex h-11 w-11 items-center justify-center rounded-full',
        'border border-[hsl(var(--glass-border))]',
        'bg-[hsl(var(--glass))] backdrop-blur-xl',
        // 内高光 + 分层投影
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_12px_28px_-10px_hsl(235_70%_20%_/_0.35)]',
        // 交互
        'transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
        'hover:border-accent/55 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_16px_36px_-10px_hsl(var(--accent)/0.5)]',
        'active:scale-95',
        // 入场/退场动画
        mounted && visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none',
      )}
    >
      {/* 渐变光晕背景(hover 增强) */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, hsl(var(--accent)/0.35) 0%, transparent 70%)',
        }}
      />
      {/* 图标容器:渐变底 */}
      <span
        aria-hidden
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-grad-primary text-white"
        style={{
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.3) inset, 0 6px 14px -4px hsl(var(--accent-strong)/0.6)',
        }}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
      </span>
    </button>
  );
}
