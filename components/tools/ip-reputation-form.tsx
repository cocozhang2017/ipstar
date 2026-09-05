'use client';

import { useState, useTransition } from 'react';
import { Search, AlertTriangle, Database, Globe2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, Spinner } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';
import { Card, Badge, StatGrid } from '@/components/ui/card';
import { ScoreMeter, RiskBadge } from '@/components/ui/score-meter';
import { isValidIp } from '@/lib/utils';
import {
  ipLookup,
  type IpCheckResult,
  type BlacklistSource,
} from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Props {
  initialIp?: string;
}

export function IpReputationForm({ initialIp = '' }: Props) {
  const tCommon = useTranslations('toolsCommon');
  const t = useTranslations('reputationForm.form');

  const [ip, setIp] = useState(initialIp);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IpCheckResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(target?: string) {
    const value = (target ?? ip).trim();
    setError(null);
    if (value && !isValidIp(value)) {
      setError(tCommon('errors.invalidIp'));
      setResult(null);
      return;
    }

    startTransition(async () => {
      try {
        setResult(null);
        const data = await ipLookup(value || undefined);
        setResult(data);
      } catch (e: any) {
        setResult(null);
        setError(e?.message || t('errorLookup'));
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Form 卡片:card-hero + gradient-border */}
      <div className="relative gradient-border">
        <Card className="card-hero">
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              run();
            }}
          >
            <Field
              label=""
              hint={initialIp ? t('hintWithIp') : t('hintEmpty')}
              className="flex-1 space-y-1"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  name="ip"
                  className="!pl-10 !h-12 text-[15px] !rounded-xl"
                  placeholder={t('placeholder')}
                />
              </div>
            </Field>
            <Button type="submit" size="lg" loading={isPending} className="sm:min-w-[180px] !h-12 text-sm">
              <Search className="h-4 w-4" />
              {t('submit')}
            </Button>
          </form>
          {error && (
            <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </Card>
      </div>

      {isPending && !result && (
        <Card className="card-hero flex items-center justify-center py-14 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Spinner className="h-5 w-5 text-accent" />
            {t('loading')}
          </div>
        </Card>
      )}

      {result && !isPending && <IpResultView data={result} />}
    </div>
  );
}

function IpResultView({ data }: { data: IpCheckResult }) {
  const tCommon = useTranslations('toolsCommon');
  const tStat = useTranslations('reputationForm.view.statLabels');
  const tSourcesHint = useTranslations('reputationForm.view.sourcesHint');
  const tServed = useTranslations('reputationForm.view.servedFrom');
  const tAbuse = useTranslations('reputationForm.view.abuseSection');
  const tBl = useTranslations('reputationForm.view.blacklistSection');
  const tTbl = useTranslations('reputationForm.view.table');
  const tMisc = useTranslations('reputationForm.view');

  const { geo, reputation, sources, cachedAt, cacheTtlSeconds } = data;

  const blHits = reputation.blacklists.filter((b) => b.listed).length;

  const items = [
    { label: tStat('ipAddress'), value: <span className="font-mono">{geo.ip}</span> },
    {
      label: tStat('location'),
      value: [geo.city, geo.regionName, geo.countryName].filter(Boolean).join(', ') || '—',
    },
    {
      label: tStat('country'),
      value: geo.countryCode
        ? `${geo.countryCode} ${geo.countryName || ''}`.trim()
        : '—',
    },
    { label: tStat('timezone'), value: geo.timezone || '—' },
    { label: tStat('asn'), value: geo.asn || '—', hint: geo.asnOrg },
    { label: tStat('isp'), value: geo.isp || geo.organization || '—' },
    {
      label: tStat('connection'),
      value: geo.connectionType || '—',
      hint:
        geo.isDatacenter || geo.isResidential || geo.isMobile || geo.isVpn || geo.isTor || geo.isProxy
          ? undefined
          : tStat('connectionHintNoProxy'),
    },
    {
      label: tStat('usageTags'),
      value: (
        <div className="flex flex-wrap gap-1.5">
          {geo.isDatacenter && <Badge tone="warning">{tCommon('badges.datacenter')}</Badge>}
          {geo.isResidential && <Badge tone="success">{tCommon('badges.residential')}</Badge>}
          {geo.isMobile && <Badge tone="accent">{tCommon('badges.mobile')}</Badge>}
          {geo.isVpn && <Badge tone="danger">{tCommon('badges.vpn')}</Badge>}
          {geo.isTor && <Badge tone="danger">{tCommon('badges.tor')}</Badge>}
          {geo.isProxy && <Badge tone="warning">{tCommon('badges.proxy')}</Badge>}
          {!geo.isDatacenter && !geo.isResidential && !geo.isMobile && !geo.isVpn && !geo.isTor && !geo.isProxy && (
            <Badge tone="muted">{tCommon('badges.noneFlagged')}</Badge>
          )}
        </div>
      ),
    },
    { label: tStat('reports90d'), value: reputation.totalReports || 0 },
    { label: tStat('distinctReporters'), value: reputation.distinctUsers || 0 },
    {
      label: tStat('lastReport'),
      value: formatDate(reputation.lastReportedAt),
    },
    {
      label: tStat('blacklistHits'),
      value: blHits ? (
        <Badge tone="danger">{blHits} / {reputation.blacklists.length}</Badge>
      ) : (
        <Badge tone="success">0 / {reputation.blacklists.length}</Badge>
      ),
    },
    {
      label: tStat('sources'),
      value: (
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={sources.ipapi ? 'success' : 'muted'}>ipapi.is</Badge>
          <Badge tone={sources.abuseipdb ? 'success' : 'muted'}>AbuseIPDB</Badge>
        </div>
      ),
      hint: cachedAt
        ? tSourcesHint('cached', {
            updated: formatDate(cachedAt) || '',
            ttl: cacheTtlSeconds ? String(Math.round(cacheTtlSeconds / 3600)) : '~',
          })
        : tSourcesHint('fresh'),
    },
  ];

  return (
    <div className="space-y-5">
      {/* 顶部摘要 */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-lg">{geo.ip}</span>
              <RiskBadge level={reputation.riskLevel} />
              {reputation.isWhitelisted && <Badge tone="success">{tCommon('badges.whitelisted')}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              <Globe2 className="inline h-3.5 w-3.5 align-[-2px] mr-1" />
              {[geo.city, geo.regionName, geo.countryName].filter(Boolean).join(', ') ||
                tCommon('misc.unknownLocation')}
              {geo.isp ? ` · ${geo.isp}` : ''}
              {geo.asn ? ` · ${geo.asn}` : ''}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Database className="h-3.5 w-3.5" />
              {tServed('prefix')}
              {cachedAt ? (
                <>
                  {tServed('kvCache', { updated: formatDate(cachedAt) || '' })}
                  {cacheTtlSeconds
                    ? tServed('kvCacheTtl', { ttl: String(Math.round(cacheTtlSeconds / 3600)) })
                    : ''}
                </>
              ) : (
                tServed('freshUpstream')
              )}
            </p>
          </div>
          <div className="w-full lg:w-[320px] shrink-0">
            <ScoreMeter score={reputation.reputationScore} size="lg" />
          </div>
        </div>
      </Card>

      <StatGrid items={items} />

      {/* 滥用类别分布 */}
      {Object.keys(reputation.abuseCategories || {}).length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">{tAbuse('title')}</h3>
            <span className="text-xs text-muted-foreground">{tAbuse('from')}</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(reputation.abuseCategories)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between rounded-md border border-border bg-background/60 px-3 py-2 text-sm"
                >
                  <span className="capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-muted-foreground">{v}</span>
                </li>
              ))}
          </ul>
        </Card>
      )}

      {/* 黑名单明细 */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">{tBl('title')}</h3>
          <Badge tone={blHits ? 'danger' : 'success'}>
            {blHits ? tBl('listedCount', { count: String(blHits) }) : tBl('noneListed')}
          </Badge>
        </div>
        <BlacklistTable rows={reputation.blacklists} />
      </Card>

      {/* 说明 */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {tMisc('disclaimer')}
      </p>
    </div>
  );
}

function BlacklistTable({ rows }: { rows: BlacklistSource[] }) {
  const tCommon = useTranslations('toolsCommon');
  const tTbl = useTranslations('reputationForm.view.table');

  if (!rows || rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{tCommon('misc.noData')}</p>;
  }
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-2 py-2 font-medium">{tTbl('source')}</th>
            <th className="px-2 py-2 font-medium">{tTbl('status')}</th>
            <th className="px-2 py-2 font-medium">{tTbl('type')}</th>
            <th className="px-2 py-2 font-medium">{tTbl('listings')}</th>
            <th className="px-2 py-2 font-medium">{tTbl('lastDetected')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.source}
              className="border-t border-border/70 hover:bg-muted/30"
            >
              <td className="px-2 py-2 font-medium">{r.source}</td>
              <td className="px-2 py-2">
                {r.listed ? (
                  <Badge tone="danger">{tCommon('badges.listed')}</Badge>
                ) : (
                  <Badge tone="success">{tCommon('badges.clean')}</Badge>
                )}
              </td>
              <td className="px-2 py-2 capitalize text-muted-foreground">
                {r.listingType || '—'}
              </td>
              <td className="px-2 py-2 font-mono text-muted-foreground">
                {r.listingsCount ?? 0}
              </td>
              <td className="px-2 py-2 text-muted-foreground">
                {formatDate(r.lastDetectedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
