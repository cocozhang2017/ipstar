import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  // 两种语言都带前缀:/en/about 与 /zh/about。
  // 访问 /about 会被 middleware 308 重定向到 /en/about。
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
