import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// 统一从这里导入 Link / usePathname / useRouter / redirect / getPathname。
// usePathname() 返回已剥离 locale 前缀的路径(如 '/tools'),
// 因此 site-header 的 active 判断逻辑无需改动数据。
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
