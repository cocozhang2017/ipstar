import { cn } from '@/lib/utils';

/**
 * 0 ~ 100 的信誉/健康度分数组件：越高越安全
 */
export function ScoreMeter({
  score,
  size = 'md',
  className,
}: {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const tone =
    clamped >= 80
      ? { bar: 'bg-success', text: 'text-success', label: 'Low Risk' }
      : clamped >= 50
      ? { bar: 'bg-warning', text: 'text-warning', label: 'Medium Risk' }
      : { bar: 'bg-danger', text: 'text-danger', label: 'High Risk' };

  const sizes = {
    sm: { number: 'text-xl', ring: 'h-1.5' },
    md: { number: 'text-3xl', ring: 'h-2' },
    lg: { number: 'text-4xl', ring: 'h-2.5' },
  } as const;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-end justify-between">
        <div className={cn('font-semibold tabular-nums', sizes[size].number, tone.text)}>
          {clamped}
          <span className="text-sm text-muted-foreground font-medium">/100</span>
        </div>
        <div>
          <span
            className={cn(
              'badge',
              clamped >= 80
                ? 'bg-success/15 text-success'
                : clamped >= 50
                ? 'bg-warning/15 text-warning'
                : 'bg-danger/15 text-danger',
            )}
          >
            {tone.label}
          </span>
        </div>
      </div>
      <div className={cn('w-full overflow-hidden rounded-full bg-muted', sizes[size].ring)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', tone.bar)}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reputation score"
        />
      </div>
    </div>
  );
}

export function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const map = {
    low: 'bg-success/15 text-success',
    medium: 'bg-warning/15 text-warning',
    high: 'bg-danger/15 text-danger',
  } as const;
  const label = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  } as const;
  return <span className={cn('badge', map[level])}>{label[level]}</span>;
}
