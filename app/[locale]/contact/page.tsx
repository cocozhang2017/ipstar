import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Field, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        zh: '/zh/contact',
      },
    },
  };
}

const topicOptions = [
  { value: 'general', key: 'general' },
  { value: 'review', key: 'review' },
  { value: 'data', key: 'data' },
  { value: 'bug', key: 'bug' },
  { value: 'partner', key: 'partner' },
] as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const beforeWriteItems = t.raw('aside.beforeWriteItems') as string[];

  return (
    <div className="container-page py-10 sm:py-14 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> {t('backToHome')}
      </Link>

      <header className="mt-4">
        <Badge tone="accent">{t('badge')}</Badge>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          {t('h1')}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t('intro')}
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* 表单：纯静态 HTML 提交到 mailto，后续你可以接 Worker Form 或 Resend */}
        <form
          className="card card-body space-y-4"
          action="mailto:hello@ipstar.net"
          method="post"
          encType="text/plain"
        >
          <Field label={t('form.nameLabel')}>
            <Input name="name" placeholder={t('form.namePlaceholder')} required />
          </Field>
          <Field label={t('form.emailLabel')}>
            <Input name="email" type="email" placeholder={t('form.emailPlaceholder')} required />
          </Field>
          <Field label={t('form.topicLabel')}>
            <select
              className="input"
              name="topic"
              defaultValue="general"
              aria-label={t('form.topicLabel')}
            >
              {topicOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(`form.topicOptions.${opt.key}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t('form.messageLabel')}
            hint={t('form.messageHint')}
          >
            <Textarea
              name="message"
              placeholder={t('form.messagePlaceholder')}
              required
            />
          </Field>
          <Button type="submit" size="lg" className="w-full sm:w-auto sm:min-w-[180px]">
            {t('form.send')}
          </Button>
        </form>

        <aside className="card card-body space-y-3 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('aside.emailLabel')}</div>
            <a className="text-accent hover:underline" href="mailto:hello@ipstar.net">
              hello@ipstar.net
            </a>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('aside.publicInboxLabel')}</div>
            <p className="text-muted-foreground">
              {t('aside.publicInboxDesc')}
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('aside.beforeWriteLabel')}</div>
            <ul className="text-muted-foreground list-disc list-inside mt-1 space-y-1">
              {beforeWriteItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
