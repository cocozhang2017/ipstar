import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ className, padded = true, ...rest }: CardProps) {
  return (
    <section className={cn('card', padded && 'card-body', className)} {...rest} />
  );
}

export function Badge({
  tone = 'muted',
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'muted' | 'success' | 'danger' | 'warning' | 'accent';
}) {
  const map = {
    muted: 'badge-muted',
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    accent: 'badge bg-accent/15 text-accent',
  } as const;
  return (
    <span className={cn(map[tone], className)} {...rest}>
      {children}
    </span>
  );
}

interface StatItem {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

export function StatGrid({ items, className }: { items: StatItem[]; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4',
        className,
      )}
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="card card-body relative overflow-hidden !p-4 sm:!p-4.5 group"
        >
          {/* 顶部渐变微光 */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-0 h-[1.5px] opacity-80 transition-all group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--accent) / 0.75) 50%, transparent 100%)',
            }}
          />
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {it.label}
          </div>
          <div className="mt-1.5 text-sm sm:text-[15px] font-medium break-all text-foreground/95">
            {it.value}
          </div>
          {it.hint && (
            <div className="mt-1 text-xs text-muted-foreground">{it.hint}</div>
          )}
        </div>
      ))}
    </div>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4', className)}>
      <div>
        {eyebrow && (
          <div className="text-xs uppercase tracking-wider text-accent font-medium mb-1.5">
            {eyebrow}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardLinkGrid<T extends { href: string; title: string; description: string; badge?: string; icon?: React.ReactNode }>({
  items,
  className,
  cols = 3,
}: {
  items: T[];
  className?: string;
  cols?: 2 | 3 | 4;
}) {
  const colMap = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  } as const;
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:gap-5', colMap[cols], className)}>
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className="group relative card card-body card-hover flex flex-col gap-3 overflow-hidden"
        >
          {/* 渐变边框覆盖层(hover 时变亮) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow:
                '0 0 0 1px hsl(var(--accent) / 0.35) inset, 0 0 40px hsl(var(--accent) / 0.15)',
            }}
          />
          {/* 顶部渐变光边(hover 时更明显) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] opacity-70 transition-all duration-300"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--highlight) / 0.85) 35%, hsl(var(--accent) / 0.9) 70%, transparent 100%)',
              transform: 'translateX(-10%) scaleX(0.9)',
            }}
          />

          <div className="flex items-start justify-between gap-2 relative z-10">
            {it.icon ? (
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_-14px_hsl(235_50%_20%_/_0.22)] text-accent transition-all duration-300 group-hover:bg-grad-primary group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset,0_12px_24px_-8px_hsl(var(--accent-strong)/0.6)]">
                {it.icon}
              </span>
            ) : (
              <span className="inline-block h-11 w-11" />
            )}
            {it.badge && <Badge tone="accent">{it.badge}</Badge>}
          </div>
          <div className="relative z-10">
            <h3 className="text-base sm:text-[17px] font-semibold tracking-tight text-foreground group-hover:text-accent-strong transition-colors duration-200">
              {it.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {it.description}
            </p>
          </div>
          {/* 右下角箭头指示器 */}
          <div className="mt-auto pt-2 relative z-10">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Explore
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
