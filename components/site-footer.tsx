import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Shield, Github, Twitter } from 'lucide-react';

const cols = [
  {
    titleKey: 'tools',
    links: [
      { labelKey: 'reputation', href: '/tools/ip-reputation' },
      { labelKey: 'geo', href: '/tools/ip-geo' },
      { labelKey: 'proxy', href: '/tools/proxy-tester' },
      { labelKey: 'all', href: '/tools' },
    ],
  },
  {
    titleKey: 'guides',
    links: [
      { labelKey: 'tiktok', href: '/guides/tiktok-shop' },
      { labelKey: 'scraping', href: '/guides/web-scraping' },
      { labelKey: 'isp', href: '/guides/static-isp-ecommerce' },
      { labelKey: 'all', href: '/guides' },
    ],
  },
  {
    titleKey: 'resources',
    links: [
      { labelKey: 'reviews', href: '/reviews' },
      { labelKey: 'blog', href: '/blog' },
      { labelKey: 'about', href: '/about' },
      { labelKey: 'contact', href: '/contact' },
    ],
  },
  {
    titleKey: 'legal',
    links: [
      { labelKey: 'privacy', href: '/privacy' },
      { labelKey: 'terms', href: '/terms' },
    ],
  },
] as const;

/**
 * 高端 Footer: 玻璃拟态顶部渐变分隔条 + 品牌光效 Logo + 社交胶囊
 */
export async function SiteFooter() {
  const t = await getTranslations('common.footer');
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* 顶部高级渐变光边 */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, hsl(var(--highlight) / 0.8) 25%, hsl(var(--accent) / 0.9) 50%, hsl(var(--accent-strong) / 0.75) 75%, transparent 100%)',
        }}
      />
      {/* 背景暗层 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--muted)/0.55) 0%, hsl(var(--background-deep)) 100%)',
        }}
      />
      <div aria-hidden className="blob blob-accent absolute -top-24 -right-20 h-72 w-72 opacity-40 -z-10" />

      <div className="container-page py-12 sm:py-16 grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* 品牌列 */}
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg">
              <span
                aria-hidden
                className="absolute inset-0 rounded-lg bg-grad-primary shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset,0_8px_18px_-8px_hsl(var(--accent-strong)/0.6)]"
              />
              <Shield className="relative h-4 w-4 text-white" strokeWidth={2.3} />
            </span>
            <span className="text-base leading-none">
              IP
              <span className="text-grad-primary">Star</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {t('brandDesc')}
          </p>
          {/* 社交胶囊 */}
          <div className="flex items-center gap-2">
            <a
              href=""
              aria-label="GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
            >
              <Github className="h-4 w-4" strokeWidth={2.1} />
            </a>
            <a
              href=""
              aria-label="Twitter"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
            >
              <Twitter className="h-4 w-4" strokeWidth={2.1} />
            </a>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.titleKey}>
            <h4 className="text-sm font-semibold tracking-tight text-foreground/90">
              {t(`cols.${col.titleKey}.title`)}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="bg-left-bottom bg-gradient-to-r from-accent to-accent bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-all duration-300">
                      {t(`cols.${col.titleKey}.links.${l.labelKey}`)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 版权行 */}
      <div className="relative border-t border-[hsl(var(--glass-border))]">
        <div className="container-page py-4.5 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-muted-foreground">
          <p>{t('copyright', { year })}</p>
          <p>
            <span className="badge-muted !py-0.5 mr-1">{t('dataSource')}</span>
            <span className="opacity-60">· ipapi.is + AbuseIPDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
