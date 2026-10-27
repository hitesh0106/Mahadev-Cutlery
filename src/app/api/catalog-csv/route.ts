// GET /api/catalog-csv?file=<name> — serves the canonical catalogue data files
// (validated by scripts/validate-catalog.ts) as downloads. Whitelist-only:
// nothing outside data/ can be read, and unknown names are rejected.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';

const FILES: Record<string, { path: string; filename: string }> = {
  'brand-department-map': {
    path: 'data/brand-department-map.csv',
    filename: 'mahadev-brand-department-map.csv',
  },
  'department-collection-seed': {
    path: 'data/department-collection-seed.csv',
    filename: 'mahadev-department-collection-seed.csv',
  },
  'product-import-template': {
    path: 'data/product-import-template.csv',
    filename: 'mahadev-product-import-template.csv',
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get('file') ?? '';
  const entry = FILES[key];
  if (!entry) {
    return Response.json(
      { error: 'Unknown file. Use ?file=brand-department-map | department-collection-seed | product-import-template' },
      { status: 400 },
    );
  }
  try {
    const content = await readFile(join(process.cwd(), entry.path), 'utf-8');
    return new Response('\uFEFF' + content, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${entry.filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return Response.json(
      { error: 'Catalogue data file not found — run scripts/validate-catalog.ts and regenerate.' },
      { status: 404 },
    );
  }
}
