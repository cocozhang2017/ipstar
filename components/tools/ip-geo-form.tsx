'use client';

import { useState, useTransition } from 'react';
import { MapPin, Navigation, AlertTriangle, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, Spinner } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';
import { Card, Badge, StatGrid } from '@/components/ui/card';
import { isValidIp } from '@/lib/utils';
import { ipGeoOnly, type IpGeoInfo } from '@/lib/api';

export function IpGeoForm({ initialIp = '' }: { initialIp?: string }) {
  const tCommon = useTranslations('toolsCommon');
  const t = useTranslations('geoForm.form');
  const tView = useTranslations('geoForm.view');

  const [ip, setIp] = useState(initialIp);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IpGeoInfo | null>(null);
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
        const data = await ipGeoOnly(value || undefined);
        setResult(data);
      } catch (e: any) {
        setResult(null);
        setError(e?.message || t('errorLookup'));
      }
    });
  }

  return (
    <div className="space-y-6">
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
              hint={t('hint')}
              className="flex-1 space-y-1"
            >
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
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

      {result && !isPending && <GeoView geo={result} />}
    </div>
  );
}

function GeoView({ geo }: { geo: IpGeoInfo }) {
  const tCommon = useTranslations('toolsCommon');
  const t = useTranslations('geoForm.view.statLabels');
  const tAction = useTranslations('geoForm.view.actions');
  const tMisc = useTranslations('geoForm.view');

  const items = [
    { label: t('ipAddress'), value: <span className="font-mono">{geo.ip}</span> },
    {
      label: t('country'),
      value:
        geo.countryCode || geo.countryName
          ? `${geo.countryCode || ''} ${geo.countryName || ''}`.trim()
          : '—',
    },
    { label: t('regionState'), value: geo.regionName || '—' },
    { label: t('city'), value: geo.city || '—' },
    { label: t('timezone'), value: geo.timezone || '—' },
    {
      label: t('coordinates'),
      value:
        geo.latitude != null && geo.longitude != null ? (
          <span className="font-mono text-xs sm:text-sm">
            {geo.latitude.toFixed(4)}, {geo.longitude.toFixed(4)}
          </span>
        ) : (
          '—'
        ),
    },
    { label: t('asn'), value: geo.asn || '—', hint: geo.asnOrg },
    { label: t('isp'), value: geo.isp || '—' },
    { label: t('organization'), value: geo.organization || '—' },
    { label: t('connectionType'), value: geo.connectionType || '—' },
    {
      label: t('hostingIpType'),
      value: (
        <div className="flex flex-wrap gap-1.5">
          {geo.isDatacenter && <Badge tone="warning">{tCommon('badges.datacenter')}</Badge>}
          {geo.isResidential && <Badge tone="success">{tCommon('badges.residential')}</Badge>}
          {geo.isMobile && <Badge tone="accent">{tCommon('badges.mobile')}</Badge>}
          {!geo.isDatacenter && !geo.isResidential && !geo.isMobile && (
            <Badge tone="muted">{tCommon('badges.unknown')}</Badge>
          )}
        </div>
      ),
    },
    {
      label: t('anonymousSignals'),
      value: (
        <div className="flex flex-wrap gap-1.5">
          {geo.isVpn && <Badge tone="danger">{tCommon('badges.vpn')}</Badge>}
          {geo.isTor && <Badge tone="danger">{tCommon('badges.tor')}</Badge>}
          {geo.isProxy && <Badge tone="warning">{tCommon('badges.proxy')}</Badge>}
          {!geo.isVpn && !geo.isTor && !geo.isProxy && <Badge tone="success">{tCommon('badges.none')}</Badge>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent shrink-0">
              <Navigation className="h-5 w-5" />
            </span>
            <div>
              <div className="font-mono text-lg">{geo.ip}</div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {[geo.city, geo.regionName, geo.countryName].filter(Boolean).join(', ') ||
                  tCommon('misc.unknownLocation')}
              </p>
            </div>
          </div>
          {geo.latitude != null && geo.longitude != null && (
            <a
              href={`https://www.openstreetmap.org/?mlat=${geo.latitude}&mlon=${geo.longitude}#map=10/${geo.latitude}/${geo.longitude}`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-outline text-sm self-start sm:self-center"
            >
              <MapPin className="h-3.5 w-3.5" />
              {tAction('viewOnMap')}
            </a>
          )}
        </div>
      </Card>

      <StatGrid items={items} />

      <p className="text-xs text-muted-foreground leading-relaxed">
        {tMisc('disclaimer')}
      </p>
    </div>
  );
}
