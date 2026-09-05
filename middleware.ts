import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 排除:/api(Worker 接管)、/_next、/fonts(自托管字体)、
  // Next.js 图片路由(apple-icon/icon/opengraph-image/twitter-image,无扩展名),
  // 以及所有带扩展名的静态文件。
  matcher: [
    '/((?!api|_next|fonts|apple-icon|icon|opengraph-image|twitter-image|robots|sitemap|manifest|.*\\..*).*)',
    '/',
  ],
};
