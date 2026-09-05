'use client';

import { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface Props {
  label: string;       // "Your IP" / "你的 IP"
  loading?: string;    // "Detecting..." / "检测中..."
}

// 国家代码 → 中文名(常用 40 个,其余用 country_code 兜底)
const COUNTRY_ZH: Record<string, string> = {
  CN: '中国', HK: '中国香港', MO: '中国澳门', TW: '中国台湾',
  US: '美国', GB: '英国', JP: '日本', KR: '韩国',
  SG: '新加坡', MY: '马来西亚', TH: '泰国', VN: '越南',
  ID: '印度尼西亚', PH: '菲律宾', IN: '印度',
  DE: '德国', FR: '法国', IT: '意大利', ES: '西班牙',
  NL: '荷兰', BE: '比利时', CH: '瑞士', SE: '瑞典', NO: '挪威',
  CA: '加拿大', AU: '澳大利亚', NZ: '新西兰',
  BR: '巴西', MX: '墨西哥', AR: '阿根廷',
  RU: '俄罗斯', UA: '乌克兰', PL: '波兰',
  AE: '阿联酋', SA: '沙特阿拉伯', TR: '土耳其',
  ZA: '南非', EG: '埃及', NG: '尼日利亚',
};

// ISP 名称 → 简短中文(常见运营商 + 云服务商)
const ISP_ZH: { match: RegExp; name: string }[] = [
  { match: /China\s*Mobile/i, name: '中国移动' },
  { match: /China\s*Unicom/i, name: '中国联通' },
  { match: /China\s*Telecom/i, name: '中国电信' },
  { match: /China\s*Broadnet/i, name: '中国广电' },
  { match: /CMCC/i, name: '中国移动' },
  { match: /CUCC/i, name: '中国联通' },
  { match: /CTCC/i, name: '中国电信' },
  { match: /Beijing\s*Unicom/i, name: '北京联通' },
  { match: /Shanghai\s*Telecom/i, name: '上海电信' },
  { match: /Shenzhen\s*Unicom/i, name: '深圳联通' },
  { match: /Aliyun|Alibaba\s*Cloud/i, name: '阿里云' },
  { match: /Tencent\s*Cloud|TencentCloud/i, name: '腾讯云' },
  { match: /Huawei\s*Cloud/i, name: '华为云' },
  { match: /Baidu/i, name: '百度' },
  { match: /Xiong'an/i, name: '雄安云' },
  { match: /Google/i, name: 'Google Cloud' },
  { match: /Amazon|AWS/i, name: 'AWS' },
  { match: /Microsoft|Azure/i, name: 'Azure' },
  { match: /DigitalOcean/i, name: 'DigitalOcean' },
  { match: /Vultr/i, name: 'Vultr' },
  { match: /Cloudflare/i, name: 'Cloudflare' },
  { match: /HKBN|Hong\s*Kong\s*Broadband/i, name: '香港宽频' },
  { match: /HKT|Hong\s*Kong\s*Telecom/i, name: '香港电讯' },
  { match: /PCCW|Netvigator/i, name: '盈富通' },
  { match: /CMHK/i, name: '中国移动香港' },
  { match: /SMARTON/i, name: 'SmarTone' },
  { match: /AsiaPac|HiNet/i, name: '中华电信' },
  { match: /SEEDNET/i, name: 'SeedNet' },
];

function shortenIsp(raw: string): string {
  for (const { match, name } of ISP_ZH) {
    if (match.test(raw)) return name;
  }
  // 兜底:截取前 20 字符
  return raw.length > 20 ? raw.slice(0, 20) + '…' : raw;
}

/**
 * 显示访问者当前公网 IP + 归属地。
 * 在客户端挂载后异步加载,不阻塞首屏。
 * 优先调自己 Worker 的 /api/ip/my 拿真实 IP,再用 ipapi.co 查归属地。
 */
export function CurrentIpBadge({ label, loading = 'Loading...' }: Props) {
  const [data, setData] = useState<{ ip: string; country?: string; isp?: string } | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/ip/my')
      .then((r) => r.json())
      .then(async (res: { ip: string }) => {
        if (cancelled || !res.ip) return;
        try {
          const geo = await fetch(`https://ipapi.co/${res.ip}/json/`).then((r) => r.json());
          if (cancelled) return;
          const countryZh = COUNTRY_ZH[geo.country_code] ?? geo.country_name;
          const ispZh = geo.org ? shortenIsp(String(geo.org)) : undefined;
          setData({ ip: res.ip, country: countryZh, isp: ispZh });
        } catch {
          if (!cancelled) setData({ ip: res.ip });
        }
      })
      .catch(() => !cancelled && setErr(true));

    return () => { cancelled = true; };
  }, []);

  if (err) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap overflow-hidden">
      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
      {!data ? (
        <span className="inline-flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          {loading}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 leading-4">
          <span>{label}:</span>
          <span className="font-mono font-semibold text-accent">{data.ip}</span>
          {data.country && (
            <span className="opacity-50">· {data.country}</span>
          )}
          {data.isp && (
            <span className="opacity-50">· {data.isp}</span>
          )}
        </span>
      )}
    </div>
  );
}
