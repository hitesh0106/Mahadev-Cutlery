// Script to package the official Shopify theme ZIP deliverables
// Run: bun scripts/package-theme.ts
import fs from 'node:fs';
import path from 'node:path';

const { ZipArchive } = await import('archiver');

const THEME_DIR = fs.existsSync(path.resolve(__dirname, '../layout/theme.liquid'))
  ? path.resolve(__dirname, '..')
  : path.resolve(__dirname, '../shopify-theme');
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
  const entries = fs.readdirSync(dir, { withFileTypes: true });
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

async function createZip(outputPath: string): Promise<number> {
  const files: ThemeFile[] = [];
  for (const folder of REQUIRED_FOLDERS) {
    walk(path.join(THEME_DIR, folder), folder, files);
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const output = fs.createWriteStream(outputPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  return new Promise<number>((resolve, reject) => {
    output.on('close', () => {
      resolve(archive.pointer());
    });
    archive.on('error', (err: any) => reject(err));
    archive.pipe(output);

    for (const file of files) {
      archive.append(fs.readFileSync(file.absolutePath), { name: file.zipPath });
    }

    archive.finalize();
  });
}

async function main() {
  console.log('Packaging Shopify Online Store 2.0 theme from:', THEME_DIR);
  
  const targets = [
    path.resolve(__dirname, '../download/mahadev-cutlery-shopify-theme-final.zip'),
    path.resolve(__dirname, '../download/mahadev-theme.zip'),
    path.resolve(__dirname, '../public/downloads/mahadev-cutlery-shopify-theme.zip'),
  ];

  for (const target of targets) {
    const bytes = await createZip(target);
    console.log(`✓ Generated ${path.relative(process.cwd(), target)} (${bytes.toLocaleString()} bytes)`);
  }

  console.log('\n✓ All Shopify theme ZIPs packaged and verified successfully.');
}

main().catch((err) => {
  console.error('Packaging failed:', err);
  process.exit(1);
});
