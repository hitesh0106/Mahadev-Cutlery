// GET /api/theme-zip — streams a ZIP of the Shopify theme (shopify-theme/)
// EXCLUDING SPEC.md and OS junk. The ZIP root contains ONLY valid theme
// folders: assets/, config/, layout/, locales/, sections/, snippets/,
// templates/. If any required folder is missing the theme build is incomplete
// and the route answers 503 { error: "Theme build incomplete" }.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

// archiver v8 is pure ESM with named class exports (no default function).
const { ZipArchive } = await import('archiver');

export const runtime = 'nodejs';

const THEME_DIR = existsSync(path.join(process.cwd(), 'layout/theme.liquid'))
  ? process.cwd()
  : path.join(process.cwd(), 'shopify-theme');

const REQUIRED_FOLDERS = [
  'assets',
  'config',
  'layout',
  'locales',
  'sections',
  'snippets',
  'templates',
] as const;

const JUNK_FILES = new Set(['.DS_Store', 'Thumbs.db']);

type ThemeFile = { absolutePath: string; zipPath: string };

function walk(dir: string, zipDir: string, files: ThemeFile[]) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (JUNK_FILES.has(entry.name) || entry.name.startsWith('.')) continue;
    const absolutePath = path.join(dir, entry.name);
    const zipPath = path.posix.join(zipDir, entry.name);
    if (entry.isDirectory()) {
      walk(absolutePath, zipPath, files);
    } else if (entry.isFile()) {
      files.push({ absolutePath, zipPath });
    }
  }
}

export async function GET() {
  if (!existsSync(THEME_DIR) || !statSync(THEME_DIR).isDirectory()) {
    return Response.json({ error: 'Theme build incomplete' }, { status: 503 });
  }
  const missing = REQUIRED_FOLDERS.filter(
    (folder) =>
      !existsSync(path.join(THEME_DIR, folder)) ||
      !statSync(path.join(THEME_DIR, folder)).isDirectory(),
  );
  if (missing.length > 0) {
    return Response.json(
      { error: 'Theme build incomplete', missing },
      { status: 503 },
    );
  }

  const files: ThemeFile[] = [];
  for (const folder of REQUIRED_FOLDERS) {
    // SPEC.md lives in the theme source root and is never included; walking
    // only the required folders guarantees the ZIP root stays theme-pure.
    walk(path.join(THEME_DIR, folder), folder, files);
  }

  const archive = new ZipArchive({ zlib: { level: 9 } });
  const chunks: Buffer[] = [];

  const done = new Promise<void>((resolve, reject) => {
    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('error', reject);
    archive.on('end', () => resolve());
  });

  for (const file of files) {
    // IMPORTANT: ZipArchive.append treats a STRING source as literal file
    // content (it would zip the path text itself). Files must be passed as
    // Buffers so real bytes land in the archive.
    archive.append(readFileSync(file.absolutePath), { name: file.zipPath });
  }
  await archive.finalize();
  await done;

  const body = new Uint8Array(Buffer.concat(chunks));
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="mahadev-theme.zip"',
      'Cache-Control': 'no-store',
      'Content-Length': String(body.byteLength),
    },
  });
}
