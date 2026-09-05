'use client';

import { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface Props {
  label: string;       // "Your IP" / "您的 IP"
  loading?: string;    // "Detecting..." / "检测中..."
}

/**
 * 显示访问者当前公网 IP + 归属地。
 * 在客户端挂载后异步加载,不阻塞首屏。
 */
export function CurrentIpBadge({ label, loading = 'Loading...' }: Props) {
  const [data, setData] = useState<{ ip: string; country?: string; isp?: string } | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 调自己的 Worker 获取客户端 IP(走 Cloudflare 内网,不被墙)
    fetch('/api/ip/my')
      .then((r) => r.json())
      .then(async (res: { ip: string }) => {
        if (cancelled || !res.ip) return;
        // 拿到 IP 后查归属地(用 ipapi.co 备用,也被墙就忽略)
        try {
          const geo = await fetch(
            `https://ipapi.co/${res.ip}/json/`,
          ).then((r) => r.json());
          if (!cancelled) {
            setData({
              ip: res.ip,
              country: geo.country_name,
              isp: geo.org,
            });
          }
        } catch {
          if (!cancelled) setData({ ip: res.ip });
        }
      })
      .catch(() => !cancelled && setErr(true));

    return () => {
      cancelled = true;
    };
  }, []);

  if (err) return null; // 获取失败不展示任何东西

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
      {!data ? (
        <span className="inline-flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" />
          {loading}
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <span>{label}:</span>
          <span className="font-mono font-semibold text-accent">
            {data.ip}
          </span>
          {data.country && (
            <>
              <span className="opacity-40">·</span>
              <span>{data.country}</span>
            </>
          )}
          {data.isp && (
            <>
              <span className="opacity-40">·</span>
              <span>{data.isp}</span>
            </>
          )}
        </span>
      )}
    </div>
  );
}
