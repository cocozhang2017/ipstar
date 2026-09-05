/**
 * 为所有 page.tsx 添加 export const runtime = 'edge'
 * @cloudflare/next-on-pages 要求非静态路由声明 Edge Runtime
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('app');
const runtimeLine = "export const runtime = 'edge';";

function findPages(dir) {
  const pages = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      pages.push(...findPages(full));
    } else if (entry === 'page.tsx') {
      pages.push(full);
    }
  }
  return pages;
}

const pages = findPages(root);
let changed = 0;

for (const file of pages) {
  const content = readFileSync(file, 'utf-8');
  if (content.includes("export const runtime")) {
    console.log(`skip (already has runtime): ${file}`);
    continue;
  }
  // 在最后一个 import 语句之后插入
  const importRegex = /^import .+$/gm;
  let lastImportEnd = 0;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastImportEnd = match.index + match[0].length;
  }
  // 处理 import 可能跨行的情况:简单起见,找到第一个非 import 的顶层语句前插入
  // 用更简单的方法:在文件第一个 export 或 function 前插入
  const firstExportOrFn = content.search(/^(export |export default |async function |function )/m);
  const insertPos = firstExportOrFn > lastImportEnd ? firstExportOrFn : lastImportEnd;
  const before = content.slice(0, insertPos);
  const after = content.slice(insertPos);
  const newContent = `${before}\n${runtimeLine}\n${after}`;
  writeFileSync(file, newContent, 'utf-8');
  changed++;
  console.log(`updated: ${file}`);
}

console.log(`\n✓ Updated ${changed}/${pages.length} page files.`);
