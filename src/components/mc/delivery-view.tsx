'use client';

// Delivery & Downloads tab — the real artifacts this project ships:
// theme ZIP / CSV import template / XLSX import template (all generated live
// by the API routes), plus the full guides and an honest limitations card.

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Loader2,
  PackageOpen,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { GUIDES } from '@/lib/guides';
import { cn } from '@/lib/utils';

// ── Rich-text rendering for guide bodies (mirrors lib/guides.ts format) ────

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <span key={index}>{part}</span>;
  });
}

function RichBody({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={key} className="ml-4 list-disc space-y-1">
        {bullets.map((bullet, index) => (
          <li key={index}>{renderInline(bullet)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      bullets.push(trimmed.slice(2));
      return;
    }
    flushBullets(`bullets-${index}`);
    if (trimmed.length === 0) return;
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h4 key={index} className="mt-3 font-semibold text-[var(--mc-ink)]">
          {renderInline(trimmed.slice(3))}
        </h4>,
      );
      return;
    }
    blocks.push(<p key={index}>{renderInline(trimmed)}</p>);
  });
  flushBullets('bullets-end');

  return <div className="space-y-2">{blocks}</div>;
}

// ── Download cards ──────────────────────────────────────────────────────────

const DOWNLOADS = [
  {
    key: 'theme-zip',
    href: '/api/theme-zip',
    filename: 'mahadev-theme.zip',
    icon: PackageOpen,
    title: 'Theme ZIP',
    description:
      'The complete Shopify Online Store 2.0 theme: assets, config, layout, locales (EN / हिंदी / ગુજરાતી), sections, snippets and templates. The ZIP contains only theme folders — SPEC.md is excluded.',
    accent: 'bg-[var(--mc-accent-soft)] text-[var(--mc-accent)]',
  },
  {
    key: 'products-csv',
    href: '/api/products-csv',
    filename: 'mahadev-products-import-template.csv',
    icon: FileSpreadsheet,
    title: 'CSV Import Template',
    description:
      'Canonical Shopify product-import columns with 3 clearly marked EXAMPLE rows (delete before importing). Image URLs are left empty on purpose — never invent them.',
    accent: 'bg-[var(--mc-cream)] text-[var(--mc-ink)]',
  },
  {
    key: 'products-xlsx',
    href: '/api/products-xlsx',
    filename: 'mahadev-products-import-template.xlsx',
    icon: FileText,
    title: 'XLSX Import Template',
    description:
      'Excel workbook: Import sheet with brand/type dropdown validation, a hidden Lists sheet and a Reference sheet carrying the brand rules, allowed departments and honest notes.',
    accent: 'bg-[var(--mc-grey)] text-[var(--mc-ink)]',
  },
] as const;

function DownloadCard({
  item,
  busy,
  onDownload,
}: {
  item: (typeof DOWNLOADS)[number];
  busy: boolean;
  onDownload: () => void;
}) {
  const Icon = item.icon;
  return (
    <article className="flex flex-col rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-white p-6 shadow-[var(--mc-shadow)]">
      <span
        className={cn(
          'flex size-11 items-center justify-center rounded-[var(--mc-radius-sm)]',
          item.accent,
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-4 font-heading text-xl text-[var(--mc-ink)]">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--mc-ink-soft)]">
        {item.description}
      </p>
      <Button
        type="button"
        onClick={onDownload}
        disabled={busy}
        className="mt-5 min-h-11 w-full rounded-full bg-[var(--mc-accent)] text-white hover:bg-[var(--mc-ink)] disabled:opacity-70"
      >
        {busy ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Preparing…
          </>
        ) : (
          <>
            <Icon aria-hidden="true" className="size-4" />
            Download
          </>
        )}
      </Button>
    </article>
  );
}

// ── View ────────────────────────────────────────────────────────────────────

export function DeliveryView() {
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const download = async (item: (typeof DOWNLOADS)[number]) => {
    setBusyKey(item.key);
    try {
      const response = await fetch(item.href);
      if (!response.ok) {
        let detail = `The server answered ${response.status}.`;
        try {
          const data: { error?: string } = await response.json();
          if (data?.error === 'Theme build incomplete') {
            detail = 'Theme build incomplete — the theme folders are still being assembled. Try again shortly.';
          }
        } catch {
          // non-JSON error body — keep the generic detail
        }
        toast({
          variant: 'destructive',
          title: 'Download not available yet',
          description: detail,
        });
        return;
      }
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition') ?? '';
      const match = disposition.match(/filename="([^"]+)"/);
      const name = match ? match[1] : item.filename;
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      toast({
        title: `Downloaded ${name}`,
        description: 'Saved to your device — see the guides below for what to do with it.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'The network request failed. Please try again.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--mc-accent)]">
          Delivery studio
        </p>
        <h1 className="mt-2 font-heading text-3xl text-[var(--mc-ink)] sm:text-4xl">
          Delivery &amp; Downloads
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--mc-ink-soft)]">
          Everything the project delivers, generated live from this workspace.
          Files are built on request — nothing here is pre-baked or fabricated.
        </p>
      </header>

      <section aria-label="Downloads" className="grid gap-4 md:grid-cols-3">
        {DOWNLOADS.map((item) => (
          <DownloadCard
            key={item.key}
            item={item}
            busy={busyKey === item.key}
            onDownload={() => void download(item)}
          />
        ))}
      </section>

      {/* Guides */}
      <section aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="font-heading text-2xl text-[var(--mc-ink)]">
          Guides for the store owner
        </h2>
        <p className="mb-4 mt-1 text-sm text-[var(--mc-ink-soft)]">
          Step-by-step instructions written for a beginner — installation,
          products, brand rules, languages and honest limitations.
        </p>
        <Accordion
          type="multiple"
          defaultValue={[GUIDES[0]?.id].filter((id): id is string => Boolean(id))}
          className="mc-scroll max-h-96 overflow-y-auto rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-white px-4 shadow-[var(--mc-shadow)]"
        >
          {GUIDES.map((guide) => (
            <AccordionItem key={guide.id} value={guide.id}>
              <AccordionTrigger className="text-left">
                <span>
                  <span className="block font-heading text-lg text-[var(--mc-ink)]">
                    {guide.title}
                  </span>
                  <span className="block text-xs font-normal text-[var(--mc-ink-soft)]">
                    {guide.subtitle}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-5">
                {guide.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="mb-1.5 text-sm font-semibold text-[var(--mc-ink)]">
                      {section.heading}
                    </h3>
                    <div className="text-sm leading-relaxed text-[var(--mc-ink-soft)]">
                      <RichBody text={section.body} />
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Honest limitations */}
      <section
        aria-labelledby="limitations-heading"
        className="rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-[var(--mc-bg-soft)] p-6"
      >
        <h2 id="limitations-heading" className="flex items-center gap-2 font-heading text-xl text-[var(--mc-ink)]">
          <AlertTriangle aria-hidden="true" className="size-5 text-[var(--mc-accent)]" />
          Not performed in this environment — reported honestly
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--mc-ink-soft)]">
          <li className="flex gap-2">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--mc-success)]" />
            <span>
              <strong className="text-[var(--mc-ink)]">Store connection &amp; product import:</strong>{' '}
              not performed — no Shopify credentials exist in this workspace
              (by design, credentials are never embedded in a theme). The owner
              connects their store and imports products using the templates.
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--mc-success)]" />
            <span>
              <strong className="text-[var(--mc-ink)]">Checkout / payments:</strong> not
              performed — requires the connected store and a payment provider.
              This preview never processes payments.
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--mc-success)]" />
            <span>
              <strong className="text-[var(--mc-ink)]">Shopify theme-check / CLI validation:</strong>{' '}
              not performed — tooling is unavailable in this sandbox. JSON and
              Liquid structure were reviewed manually; the Verification Report
              tab keeps the honest statuses.
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--mc-success)]" />
            <span>
              <strong className="text-[var(--mc-ink)]">WhatsApp ordering:</strong> opens a
              real chat with the configured store number, but order
              confirmation is manual in chat — no automated order flow.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
