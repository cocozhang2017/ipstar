import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';
import en from '../messages/en.json';
import zh from '../messages/zh.json';

// Cloudflare edge runtime 不支持 node:fs,这里用静态 import 把 messages
// 在构建期打包进 bundle。messages 体积小,无性能问题。
const dictionaries = { en, zh } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: dictionaries[locale],
  };
});
