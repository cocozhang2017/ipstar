# 全站多语言切换功能(中文/英文)实现计划

## Context

IPStar 是一个部署在 Cloudflare Pages 上的 Next.js 15 App Router 工具站点,目前所有文案硬编码为英文,`<html lang="en">` 固定,无任何 i18n 基础设施(无 middleware、无 i18n 库、无 Contentlayer,页面均为硬编码组件)。

目标:为全站增加中文/英文切换功能,覆盖 Header 导航、Footer、首页、about/contact/tools/guides/blog/reviews/privacy/terms 等所有可见文案与 metadata。

**方案**:基于 `next-intl` 的 URL 前缀路由(`/zh` 与 `/en`),`localePrefix: 'always'`(两种语言都带前缀,旧英文 URL 由 middleware 308 重定向到 `/en/*`)。理由:URL 完全对称、hreflang SEO 最友好、切换器实现最简单,符合用户"全站翻译"的投入规模。

## 技术决策

- **库**: `next-intl@^3.27`(兼容 Next 15 + React 19,稳定 API `setRequestLocale`)
- **路由策略**: `localePrefix: 'always'`,`locales: ['en','zh']`,`defaultLocale: 'en'`
- **Provider 层级**: `NextIntlClientProvider` 放在 `app/[locale]/layout.tsx` 的 `<body>` 内最外层,包裹 Header/Footer/children
- **Cloudflare 兼容关键**: `i18n/request.ts` 必须用静态 `import` JSON 加载 messages,**禁止用 `node:fs`**(edge runtime 不支持)
- **`/api/*` 排除**: middleware matcher 排除 `api`(由 Cloudflare Worker 接管)

## 实施步骤

### 1. 安装依赖
```bash
npm install next-intl@^3.27
```

### 2. 新建 i18n 配置文件(3 个)
- `i18n/routing.ts` — `defineRouting({ locales:['en','zh'], defaultLocale:'en', localePrefix:'always' })`,导出 `routing` 与 `Locale` 类型
- `i18n/navigation.ts` — `createNavigation(routing)` 导出 `Link/usePathname/useRouter/redirect/getPathname`
- `i18n/request.ts` — `getRequestConfig`,静态 `import` `../messages/en.json` 与 `zh.json`,按 requestLocale 选字典

### 3. 新建翻译文件
- `messages/en.json`、`messages/zh.json`,命名空间:`meta` / `common.header` / `common.footer` / `common.access` / `common.switcher` / `common.notfound` / `home` / `about` / `contact` / `tools` / `guides` / `blog` / `reviews` / `privacy` / `terms`
- 嵌套结构示例:`common.footer.cols.tools.links.reputation` = "IP Reputation Check" / "IP 信誉查询"

### 4. 改造 `next.config.mjs`
用 `createNextIntlPlugin('./i18n/request.ts')` 的 `withNextIntl` 包装现有配置(保留所有 headers/images 配置)。

### 5. 新建 `middleware.ts`(项目根)
```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
export default createMiddleware(routing);
export const config = { matcher: ['/((?!api|_next|fonts|.*\\..*).*)', '/'] };
```

### 6. 目录重构(关键)
在 `app/` 下新建 `[locale]/`,把以下内容移入(保持子目录结构):
- `app/layout.tsx` → `app/[locale]/layout.tsx`(改造为根布局,见步骤 7)
- `app/page.tsx` → `app/[locale]/page.tsx`
- `app/about|contact|tools|guides|blog|reviews|privacy|terms/**` → `app/[locale]/对应目录/**`

**保留在 `app/` 根不动**: `globals.css`、`sitemap.ts`、`robots.ts`、`not-found.tsx`(兜底 404,自带最小 html/body)。
**新建**: `app/[locale]/not-found.tsx`(本地化 404)。
**globals.css import**: 从原 layout 迁到 `[locale]/layout.tsx` 顶部 `import '../globals.css'`。

### 7. 改造 `app/[locale]/layout.tsx`
- 搬入原 `viewport` 不变;`export const metadata` 改为 `export async function generateMetadata({params})`,用 `getTranslations({locale,namespace:'meta'})` 取标题/描述/keywords(`t.raw('keywords')`)/OG/Twitter,`alternates.canonical` 改为 `/${locale}`
- `generateStaticParams()` 返回 `routing.locales.map(l=>({locale:l}))`
- `<html lang={locale} suppressHydrationWarning>` 动态
- 调用 `setRequestLocale(locale)` 启用静态渲染
- `<body>` 内最外层包 `<NextIntlClientProvider>`,内含 SiteHeader/main/SiteFooter
- 字体 preload `<link href="/fonts/...">` 不变(绝对路径,matcher 已排除 /fonts)

### 8. 改造 `components/site-header.tsx`(client 组件样板)
- `import Link from 'next/link'` → `import { Link } from '@/i18n/navigation'`
- `import { usePathname } from 'next/navigation'` → `import { usePathname } from '@/i18n/navigation'`(返回剥离 locale 的路径,active 判断逻辑不变)
- `nav` 数组 `label` → `labelKey`,渲染处 `t('nav.'+item.labelKey)`(用 `useTranslations('common.header')`)
- aria-label、"Check IP"/"Check IP Reputation" 走 `t()`
- href 全部保留原值(`/tools` 等),next-intl Link 自动加前缀
- 在 PC nav 的 Check IP 按钮左侧、移动端菜单顶部接入 `<LanguageSwitcher />`

### 9. 新建 `components/language-switcher.tsx`(client)
- `useLocale()` + `useRouter()` + `usePathname()`(来自 `@/i18n/navigation`)
- `switchTo(next)` 调 `router.replace(pathname, { locale: next })`(保留路径)
- 按钮组样式:`EN` / `中文`,当前 locale 高亮 `bg-accent text-white`

### 10. 改造 `components/site-footer.tsx`(server 组件样板)
- 转为 `async` server component,`await getTranslations('common.footer')`
- cols 数据的 title/label 改为 `t('cols.tools.title')` / `t('cols.tools.links.reputation')` 等
- `import Link from 'next/link'` → `import { Link } from '@/i18n/navigation'`(server 端也支持),href 保留原值
- 版权 `t('copyright',{year})`、数据来源 `t('dataSource')`

### 11. 改造 `components/ui/card.tsx`
仅 `CardLinkGrid` 的 `import Link from 'next/link'` → `import { Link } from '@/i18n/navigation'`,`items` 的 href 不变。`SectionHeader` 等不涉及 Link 的组件不动。

### 12. 改造各 page(about/contact/tools/guides/blog/reviews/privacy/terms 及首页)
- `export const metadata` → `export async function generateMetadata({params})`,用 `getTranslations({locale,namespace:'页名'})` 取 `metaTitle`/`metaDesc`,`alternates.canonical` = `/${locale}/路径`,`alternates.languages` = `{en:'/en/路径', zh:'/zh/路径'}`(hreflang)
- 正文文案走 `t()`
- 首页 hero 的原生 GET `<form action="/tools/ip-reputation">` → `action={/${locale}/tools/ip-reputation}`(server 端取 params.locale 拼)
- 页内 `<Link>` 换成 `@/i18n/navigation` 的 Link
- blog/[slug]、reviews/[slug] 动态路由:generateMetadata 本地化 + canonical/hreflang,slug 页顶部 `setRequestLocale(locale)`

### 13. 改造 `app/sitemap.ts`
输出双语 URL(`/en/*` 与 `/zh/*`),每条带 `alternates.languages` hreflang 互指。`app/robots.ts` 不变。

## 关键文件清单
- 删除: `app/layout.tsx`、`app/page.tsx` 及各页(移入 `[locale]` 后)
- 新建: `i18n/{routing,navigation,request}.ts`、`messages/{en,zh}.json`、`middleware.ts`、`components/language-switcher.tsx`、`app/[locale]/not-found.tsx`
- 改造: `next.config.mjs`、`app/[locale]/layout.tsx`、`components/{site-header,site-footer,language-switcher,ui/card}.tsx`、`app/[locale]/**/page.tsx`、`app/sitemap.ts`

## 注意事项
1. `usePathname` 必须从 `@/i18n/navigation` 导入(返回剥离 locale 路径),**不要**从 `next/navigation` 导入,否则 active 判断失效
2. `i18n/request.ts` 静态 import JSON,**不可用 fs**(Cloudflare edge)
3. 每个 generateMetadata 必须给 `alternates.canonical`(带 locale)+ `alternates.languages`(en/zh 互指),否则重复内容/错选 locale
4. 先动态渲染跑通,再按需对静态页(about/privacy/terms/blog 索引)加 `setRequestLocale(locale)` 做静态优化,不要混用 `force-static`
5. 旧英文 URL `/about` 会被 middleware 308→`/en/about`(等价 301,Google 接受)

## 验证方式
1. `npm run dev`,访问 `/`(应 308→`/en`)、`/en`、`/zh`、`/en/tools/ip-reputation`、`/zh/about`
2. 切换器在 en/zh 间互跳且保留路径(含 `?ip=` query 时也保留)
3. 查看页面源码:`<html lang>` 正确、有 hreflang `<link>` 标签、canonical 正确
4. `npm run build` 通过(无 fs 调用、edge 兼容)
5. 验证 `/api/*` 仍直通 Worker(未被重写)、`/fonts/*` 正常加载
6. 中文文案完整覆盖 Header/Footer/首页及各页正文
