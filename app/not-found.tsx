import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found · IPStar',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-page py-20 sm:py-28 max-w-xl text-center">
      <div className="text-[72px] sm:text-[96px] font-bold leading-none tracking-tight text-accent/80">
        404
      </div>
      <h1 className="mt-4 text-xl sm:text-2xl font-semibold">
        Page not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        The URL you followed doesn&apos;t exist, or the review / post you&apos;re looking for was moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Link href="/en" className="btn-primary">
          Go home
        </Link>
        <Link href="/en/tools/ip-reputation" className="btn-outline">
          Check an IP
        </Link>
      </div>
    </div>
  );
}
