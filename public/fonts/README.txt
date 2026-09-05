# public/fonts

把 Inter 与 Roboto 的 latin 子集 woff2 文件放到这里即可。推荐使用 google-webfonts-helper 下载：

- Inter: 400 / 500 / 600 / 700，modern browsers only (woff2)
  - inter-latin-400-normal.woff2
  - inter-latin-500-normal.woff2
  - inter-latin-600-normal.woff2
  - inter-latin-700-normal.woff2

- Roboto: 400 / 500 / 700
  - roboto-latin-400-normal.woff2
  - roboto-latin-500-normal.woff2
  - roboto-latin-700-normal.woff2

如果文件缺失，@font-face 中的 `local()` 会先尝试系统字体，Tailwind 的
`font-sans: [Inter, Roboto, ui-sans-serif, system-ui, sans-serif]` 会兜底到系统
无衬线字体，页面依然可用，不会阻塞首屏渲染（font-display: swap）。
