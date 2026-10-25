'use client';

// Verification Report tab — renders the honest check data from
// src/lib/report.ts. Statuses are NEVER embellished: 'passed' | 'failed' |
// 'not_performed', grouped by area with a legend.

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { REPORT_META, REPORT_ROWS, type CheckStatus } from '@/lib/report';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<CheckStatus, string> = {
  passed: 'bg-[#287A53]/10 text-[#287A53] border border-[#287A53]/30',
  failed: 'bg-[#B42318]/10 text-[#B42318] border border-[#B42318]/30',
  not_performed: 'bg-[var(--mc-grey)] text-[var(--mc-ink-soft)] border border-[var(--mc-border)]',
};

const STATUS_LABELS: Record<CheckStatus, string> = {
  passed: 'Passed',
  failed: 'Failed',
  not_performed: 'Not performed',
};

function StatusBadge({ status }: { status: CheckStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold',
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ReportView() {
  const areas = [...new Set(REPORT_ROWS.map((row) => row.area))];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--mc-accent)]">
          Honesty first
        </p>
        <h1 className="mt-2 font-heading text-3xl text-[var(--mc-ink)] sm:text-4xl">
          Verification Report
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--mc-ink-soft)]">
          {REPORT_META.project} — {REPORT_META.updated}. A check is only marked
          “Passed” with real evidence in this environment; anything needing the
          Shopify admin or external tooling stays “Not performed”.
        </p>
      </header>

      {/* Legend */}
      <dl className="grid gap-3 sm:grid-cols-3">
        {(Object.entries(REPORT_META.legend) as [CheckStatus, string][]).map(
          ([status, description]) => (
            <div
              key={status}
              className="rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-white p-4"
            >
              <dt>
                <StatusBadge status={status} />
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-[var(--mc-ink-soft)]">
                {description}
              </dd>
            </div>
          ),
        )}
      </dl>

      {/* Rows grouped by area */}
      {areas.map((area) => {
        const rows = REPORT_ROWS.filter((row) => row.area === area);
        const passed = rows.filter((r) => r.status === 'passed').length;
        const failed = rows.filter((r) => r.status === 'failed').length;
        const notPerformed = rows.filter((r) => r.status === 'not_performed').length;
        return (
          <section key={area} aria-label={area}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl text-[var(--mc-ink)]">{area}</h2>
              <p className="text-xs text-[var(--mc-ink-soft)]">
                {passed} passed · {failed} failed · {notPerformed} not performed
              </p>
            </div>
            <div className="overflow-hidden rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-white shadow-[var(--mc-shadow)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--mc-bg-soft)] hover:bg-[var(--mc-bg-soft)]">
                    <TableHead className="w-[38%] text-[var(--mc-ink-soft)]">Check</TableHead>
                    <TableHead className="w-[16%] text-[var(--mc-ink-soft)]">Status</TableHead>
                    <TableHead className="text-[var(--mc-ink-soft)]">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={`${row.area}-${row.item}`}>
                      <TableCell className="align-top font-medium text-[var(--mc-ink)]">
                        {row.item}
                      </TableCell>
                      <TableCell className="align-top">
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="align-top text-xs leading-relaxed text-[var(--mc-ink-soft)]">
                        {row.detail}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        );
      })}

      <p className="rounded-[var(--mc-radius)] border border-dashed border-[var(--mc-border)] bg-[var(--mc-bg-soft)] p-4 text-xs leading-relaxed text-[var(--mc-ink-soft)]">
        This report is generated from src/lib/report.ts and updated by the
        verification rounds — it is never edited to look better than reality.
        “Not performed” items require Shopify admin access, credentials or CLI
        tooling that this workspace intentionally does not contain.
      </p>
    </div>
  );
}
