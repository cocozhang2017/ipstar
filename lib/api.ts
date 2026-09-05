// 统一封装对 Cloudflare Worker 聚合接口的调用
// 前端只请求自己域名下的路径，无跨域；线上 Pages 路由把 /api/* 接管给 Worker
// 本地开发时可用 NEXT_PUBLIC_API_BASE_URL 指向 Worker 调试地址

const base =
  (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : '') ||
  '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    const err = new Error(message) as Error & { status?: number; payload?: unknown };
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data as T;
}

// ---------- 响应类型 ----------

export interface IpGeoInfo {
  ip: string;
  asn?: string;
  asnOrg?: string;
  countryCode?: string;
  countryName?: string;
  regionName?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  organization?: string;
  connectionType?: string;
  isProxy?: boolean;
  isDatacenter?: boolean;
  isResidential?: boolean;
  isMobile?: boolean;
  isTor?: boolean;
  isVpn?: boolean;
}

export interface AbuseReport {
  category?: string;
  reporterCountryCode?: string;
  reportedAt?: string;
  comment?: string;
}

export interface BlacklistSource {
  source: string;
  listed: boolean;
  lastDetectedAt?: string;
  listingsCount?: number;
  listingType?: 'spam' | 'malware' | 'exploit' | 'scanner' | 'proxy' | 'other';
}

export interface IpReputationData {
  ip: string;
  // 综合分数：0-100，越高越干净
  reputationScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  totalReports: number;
  distinctUsers: number;
  lastReportedAt?: string;
  abuseCategories: Record<string, number>;
  blacklists: BlacklistSource[];
  blacklistHits: number;
  isWhitelisted?: boolean;
  usageType?: string;
}

export interface IpCheckResult {
  geo: IpGeoInfo;
  reputation: IpReputationData;
  sources: {
    ipapi: boolean;
    abuseipdb: boolean;
  };
  cachedAt?: string;
  cacheTtlSeconds?: number;
}

export interface ProxyTestResult {
  proxyEndpoint: string;
  testedAt: string;
  reachable: boolean;
  httpStatusCode?: number;
  latencyMs?: number;
  anonymityLevel?: 'elite' | 'anonymous' | 'transparent' | 'unknown';
  protocol?: 'http' | 'https' | 'socks4' | 'socks5' | 'unknown';
  exitIp?: string;
  exitCountryCode?: string;
  dnsLeaked?: boolean;
  upstreamIsp?: string;
  errors?: string[];
  targets?: {
    name: string;
    latencyMs?: number;
    ok: boolean;
    note?: string;
  }[];
}

// ---------- API 方法 ----------

/**
 * 将 Worker 实际返回的原始数据归一化为前端期望的 IpCheckResult 结构。
 * Worker 返回的字段命名/嵌套与前端接口不一致,这里做适配 + 防御性兜底。
 */
function normalizeIpCheck(raw: any): IpCheckResult {
  const geoRaw = raw?.geo ?? {};
  const repRaw = raw?.reputation ?? {};
  const blRaw = raw?.blacklist ?? {};

  // abuseConfidenceScore: 0=干净, 100=恶意 → reputationScore 取反
  const abuseConfidence = Number(repRaw?.abuseConfidenceScore ?? 0);
  const reputationScore = Math.max(0, Math.min(100, 100 - abuseConfidence));
  const riskLevel: 'low' | 'medium' | 'high' =
    abuseConfidence >= 50 ? 'high' : abuseConfidence >= 15 ? 'medium' : 'low';

  const geo: IpGeoInfo = {
    ip: raw?.ip ?? geoRaw?.ip ?? '',
    asn: geoRaw?.asn ?? geoRaw?.asnCode ?? undefined,
    asnOrg: geoRaw?.asnOrg ?? geoRaw?.asnName ?? geoRaw?.organization ?? undefined,
    countryCode: geoRaw?.countryCode ?? undefined,
    countryName: geoRaw?.countryName ?? geoRaw?.country ?? undefined,
    regionName: geoRaw?.regionName ?? geoRaw?.region ?? undefined,
    city: geoRaw?.city ?? undefined,
    latitude: geoRaw?.latitude ?? geoRaw?.lat ?? undefined,
    longitude: geoRaw?.longitude ?? geoRaw?.lon ?? undefined,
    timezone: geoRaw?.timezone ?? undefined,
    isp: geoRaw?.isp ?? undefined,
    organization: geoRaw?.organization ?? undefined,
    connectionType: geoRaw?.connectionType ?? geoRaw?.type ?? undefined,
    isProxy: !!geoRaw?.isProxy,
    isDatacenter: !!geoRaw?.isDatacenter,
    isResidential: !!geoRaw?.isResidential,
    isMobile: !!geoRaw?.isMobile,
    isTor: !!geoRaw?.isTor,
    isVpn: !!geoRaw?.isVpn,
  };

  // blacklist 可能是数组(标准)或对象(Worker 实际返回),统一转成数组
  let blacklists: BlacklistSource[] = [];
  if (Array.isArray(repRaw?.blacklists)) {
    blacklists = repRaw.blacklists;
  } else if (blRaw && typeof blRaw === 'object') {
    // Worker 风格: { abuseIpDbReported: boolean, lastReportedAt: string }
    blacklists = [
      {
        source: 'AbuseIPDB',
        listed: !!blRaw?.abuseIpDbReported,
        lastDetectedAt: blRaw?.lastReportedAt,
        listingsCount: repRaw?.totalReports ?? 0,
        listingType: 'other' as const,
      },
    ];
  }

  const reputation: IpReputationData = {
    ip: raw?.ip ?? '',
    reputationScore,
    riskLevel,
    totalReports: Number(repRaw?.totalReports ?? 0),
    distinctUsers: Number(repRaw?.distinctUsers ?? 0),
    lastReportedAt: repRaw?.lastReportedAt ?? blRaw?.lastReportedAt,
    abuseCategories: repRaw?.abuseCategories ?? {},
    blacklists,
    blacklistHits: blacklists.filter((b) => b.listed).length,
    isWhitelisted: repRaw?.isWhitelisted,
    usageType: repRaw?.usageType ?? geoRaw?.usageType,
  };

  const sources = {
    ipapi: raw?.sources?.ipapi ?? true,
    abuseipdb: raw?.sources?.abuseipdb ?? true,
  };

  return {
    geo,
    reputation,
    sources,
    cachedAt: raw?.cachedAt,
    cacheTtlSeconds: raw?.cacheTtlSeconds,
  };
}

export async function ipLookup(ip?: string, signal?: AbortSignal): Promise<IpCheckResult> {
  const qs = ip ? `?ip=${encodeURIComponent(ip)}` : '';
  const raw = await request<any>(`/api/ip/lookup${qs}`, { signal });
  return normalizeIpCheck(raw);
}

export async function ipGeoOnly(ip?: string, signal?: AbortSignal): Promise<IpGeoInfo> {
  const qs = ip ? `?ip=${encodeURIComponent(ip)}` : '';
  const res = await request<{ ip?: string; geo?: any }>(`/api/ip/geo${qs}`, { signal });
  // 复用 normalizeIpCheck 的 geo 归一化逻辑
  return normalizeIpCheck({ ip: res?.ip, geo: res?.geo }).geo;
}

export async function ipReputation(ip: string, signal?: AbortSignal): Promise<IpReputationData> {
  const res = await request<{ reputation: IpReputationData }>(
    `/api/ip/reputation?ip=${encodeURIComponent(ip)}`,
    { signal },
  );
  return res.reputation;
}

export interface ProxyTestInput {
  host: string;
  port: number;
  protocol?: 'http' | 'https' | 'socks4' | 'socks5';
  username?: string;
  password?: string;
  // 可选：要测速的目标站点列表，Worker 会转发到后端 VPS
  targets?: string[];
}

export async function testProxy(input: ProxyTestInput, signal?: AbortSignal): Promise<ProxyTestResult> {
  return request<ProxyTestResult>(`/api/proxy/test`, {
    method: 'POST',
    body: JSON.stringify(input),
    signal,
  });
}
