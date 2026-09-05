'use client';

import { useState, useTransition } from 'react';
import {
  Zap,
  ShieldCheck,
  AlertTriangle,
  Globe2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, Spinner } from '@/components/ui/button';
import { Input, Field, Select } from '@/components/ui/input';
import { Card, Badge, StatGrid } from '@/components/ui/card';
import {
  testProxy,
  type ProxyTestResult,
  type ProxyTestInput,
} from '@/lib/api';
import { formatDate } from '@/lib/utils';

export function ProxyTesterForm() {
  const t = useTranslations('proxyForm.form');
  const tLabel = useTranslations('proxyForm.form.labels');
  const tHint = useTranslations('proxyForm.form.hints');
  const tPh = useTranslations('proxyForm.form.placeholders');
  const tErr = useTranslations('proxyForm.form.errors');

  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [protocol, setProtocol] = useState<ProxyTestInput['protocol']>('http');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Partial<Record<'host' | 'port', string>>>({});
  const [callError, setCallError] = useState<string | null>(null);
  const [result, setResult] = useState<ProxyTestResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function validate() {
    const e: typeof errors = {};
    if (!host.trim()) e.host = tErr('required');
    if (!port.trim()) e.port = tErr('required');
    else {
      const p = Number(port);
      if (!Number.isInteger(p) || p < 1 || p > 65535) e.port = tErr('portRange');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function run(e: React.FormEvent) {
    e.preventDefault();
    setCallError(null);
    if (!validate()) return;

    const payload: ProxyTestInput = {
      host: host.trim(),
      port: Number(port),
      protocol,
    };
    if (username.trim()) payload.username = username.trim();
    if (password) payload.password = password;

    startTransition(async () => {
      try {
        setResult(null);
        const data = await testProxy(payload);
        setResult(data);
      } catch (err: any) {
        setResult(null);
        // Worker 未实现 /api/proxy/test 时返回 "ip query param required"
        // 或 404,统一提示服务暂不可用
        const msg = err?.message || '';
        if (msg.includes('ip query param') || msg.includes('404') || msg.includes('Not Found')) {
          setCallError(t('errorServiceUnavailable'));
        } else {
          setCallError(msg || t('errorTest'));
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="relative gradient-border">
        <Card className="card-hero">
          <form onSubmit={run} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
            <Field
              label={tLabel('protocol')}
              className="sm:col-span-2 lg:col-span-2"
            >
              <Select value={protocol} onChange={(e) => setProtocol(e.target.value as any)}>
                <option value="http">HTTP</option>
                <option value="https">HTTPS</option>
                <option value="socks5">SOCKS5</option>
                <option value="socks4">SOCKS4</option>
              </Select>
            </Field>

            <Field
              label={tLabel('hostIp')}
              error={errors.host}
              hint={tHint('hostIp')}
              className="sm:col-span-2 lg:col-span-4"
            >
              <Input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder={tPh('host')}
                autoComplete="off"
                className="!h-11"
              />
            </Field>

            <Field
              label={tLabel('port')}
              error={errors.port}
              className="sm:col-span-2 lg:col-span-2"
            >
              <Input
                value={port}
                onChange={(e) => setPort(e.target.value.replace(/\D/g, ''))}
                placeholder={tPh('port')}
                inputMode="numeric"
                className="!h-11"
              />
            </Field>

            <Field label={tLabel('username')} className="sm:col-span-1 lg:col-span-2">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={tPh('username')}
                autoComplete="nope"
                className="!h-11"
              />
            </Field>

            <Field label={tLabel('password')} className="sm:col-span-1 lg:col-span-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tPh('password')}
                autoComplete="new-password" // ✅ password框必须用new‑password
                className="!h-11"
              />
            </Field>

            <div className="sm:col-span-2 lg:col-span-12 flex items-end">
              <Button type="submit" size="lg" loading={isPending} className="sm:min-w-[200px] !h-12 text-sm">
                <Zap className="h-4 w-4" />
                {t('submit')}
              </Button>
            </div>
          </form>

          {callError && (
            <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {callError}
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

      {result && !isPending && <ProxyResultView result={result} />}
    </div>
  );
}

function ProxyResultView({ result }: { result: ProxyTestResult }) {
  const tCommon = useTranslations('toolsCommon');
  const tStat = useTranslations('proxyForm.view.statLabels');
  const tTitle = useTranslations('proxyForm.view.title');
  const tMt = useTranslations('proxyForm.view.multiTarget');
  const tMtTbl = useTranslations('proxyForm.view.multiTarget.table');
  const tMisc = useTranslations('proxyForm.view');
  const tLat = useTranslations('toolsCommon.latencyHint');

  const items = [
    {
      label: tStat('endpointTested'),
      value: <span className="font-mono break-all text-xs sm:text-sm">{result.proxyEndpoint}</span>,
    },
    {
      label: tStat('reachable'),
      value: result.reachable ? (
        <Badge tone="success">{tCommon('badges.reachable')}</Badge>
      ) : (
        <Badge tone="danger">{tCommon('badges.unreachable')}</Badge>
      ),
    },
    {
      label: tStat('httpCode'),
      value: result.httpStatusCode ? (
        <span className="font-mono">{result.httpStatusCode}</span>
      ) : (
        '—'
      ),
    },
    {
      label: tStat('latency'),
      value:
        result.latencyMs != null ? (
          <span className="font-mono">{result.latencyMs} ms</span>
        ) : (
          '—'
        ),
      hint:
        result.latencyMs != null
          ? result.latencyMs < 150
            ? tLat('fast')
            : result.latencyMs < 500
            ? tLat('acceptable')
            : tLat('slow')
          : undefined,
    },
    {
      label: tStat('protocol'),
      value: (result.protocol || 'unknown').toUpperCase(),
    },
    {
      label: tStat('anonymityLevel'),
      value: (
        <AnonymityBadge level={result.anonymityLevel || 'unknown'} />
      ),
    },
    {
      label: tStat('exitIp'),
      value: result.exitIp ? (
        <span className="font-mono break-all text-xs sm:text-sm">{result.exitIp}</span>
      ) : (
        '—'
      ),
    },
    {
      label: tStat('exitCountry'),
      value: result.exitCountryCode ? (
        <span className="flex items-center gap-1.5">
          <Globe2 className="h-3.5 w-3.5 text-accent" />
          {result.exitCountryCode}
        </span>
      ) : (
        '—'
      ),
    },
    {
      label: tStat('upstreamIsp'),
      value: result.upstreamIsp || '—',
    },
    {
      label: tStat('dnsLeak'),
      value: result.dnsLeaked ? (
        <Badge tone="danger">{tCommon('badges.leaked')}</Badge>
      ) : result.exitIp ? (
        <Badge tone="success">{tCommon('badges.noLeak')}</Badge>
      ) : (
        '—'
      ),
    },
    {
      label: tStat('testedAt'),
      value: formatDate(result.testedAt),
    },
    {
      label: tStat('errors'),
      value:
        result.errors && result.errors.length ? (
          <ul className="space-y-0.5 text-xs text-danger">
            {result.errors.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        ) : (
          <Badge tone="success">{tCommon('badges.none')}</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md shrink-0 ${
                result.reachable ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}
            >
              {result.reachable ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[15px] font-semibold">
                  {result.reachable ? tTitle('online') : tTitle('offline')}
                </h3>
                {result.latencyMs != null && (
                  <span className="badge-muted">
                    <Zap className="h-3 w-3" />
                    {result.latencyMs} ms
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground break-all font-mono text-xs">
                {result.proxyEndpoint}
              </p>
            </div>
          </div>
          <AnonymityBadge level={result.anonymityLevel || 'unknown'} big />
        </div>
      </Card>

      <StatGrid items={items} />

      {result.targets && result.targets.length > 0 && (
        <Card>
          <h3 className="text-base font-semibold mb-3">{tMt('title')}</h3>
          <div className="overflow-x-auto -mx-1">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 font-medium">{tMtTbl('target')}</th>
                  <th className="px-2 py-2 font-medium">{tMtTbl('result')}</th>
                  <th className="px-2 py-2 font-medium">{tMtTbl('latency')}</th>
                  <th className="px-2 py-2 font-medium">{tMtTbl('note')}</th>
                </tr>
              </thead>
              <tbody>
                {result.targets.map((t) => (
                  <tr key={t.name} className="border-t border-border/70 hover:bg-muted/30">
                    <td className="px-2 py-2 font-medium font-mono text-xs">{t.name}</td>
                    <td className="px-2 py-2">
                      {t.ok ? (
                        <span className="inline-flex items-center gap-1 text-success text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {tCommon('badges.ok')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-danger text-xs">
                          <XCircle className="h-3.5 w-3.5" /> {tCommon('badges.failed')}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 font-mono text-muted-foreground">
                      {t.latencyMs != null ? `${t.latencyMs} ms` : '—'}
                    </td>
                    <td className="px-2 py-2 text-muted-foreground text-xs">
                      {t.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        {tMisc('disclaimer')}
      </p>
    </div>
  );
}

function AnonymityBadge({
  level,
  big = false,
}: {
  level: 'elite' | 'anonymous' | 'transparent' | 'unknown';
  big?: boolean;
}) {
  const t = useTranslations('toolsCommon.anonymity');
  const map = {
    elite: { tone: 'success' as const, key: 'elite' },
    anonymous: { tone: 'accent' as const, key: 'anonymous' },
    transparent: { tone: 'danger' as const, key: 'transparent' },
    unknown: { tone: 'muted' as const, key: 'unknown' },
  } as const;
  const { tone, key } = map[level];
  return (
    <Badge tone={tone} className={big ? 'text-xs !px-3 !py-1' : ''}>
      <ShieldCheck className="h-3 w-3" />
      {t(key)}
    </Badge>
  );
}
