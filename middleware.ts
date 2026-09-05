import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 排除:/api(Cloudflare Worker 接管)、/_next、/fonts(自托管字体)、
  // 以及所有带扩展名的静态文件。'/' 单独列出确保根路径被处理。
  matcher: ['/((?!api|_next|fonts|.*\\..*).*)', '/'],
};
