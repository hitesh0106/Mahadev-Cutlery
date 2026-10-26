// Theme validator — run: bun scripts/validate-theme.ts
// 1. JSON.parses every .json file in shopify-theme/ (incl. {% schema %} blocks)
// 2. Extracts every 'x.y' | t key from .liquid files, asserts presence in en.default.json
// 3. Checks Liquid tag balance ({% if/unless/for/case/capture/form/paginate %} … end)
// 4. Checks that templates/*.json reference existing sections
// 5. Checks assets referenced by layout/theme.liquid exist
import fs from 'fs';
import path from 'path';

const ROOT = '/home/z/my-project/shopify-theme';
const errors: string[] = [];
const warnings: string[] = [];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const allFiles = walk(ROOT);

// ── 1. JSON validity ─────────────────────────────────────────────────────
const jsonFiles = allFiles.filter((f) => f.endsWith('.json'));
for (const file of jsonFiles) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e: any) {
    errors.push(`JSON invalid: ${path.relative(ROOT, file)} — ${e.message}`);
  }
}

// ── 2. Schema blocks in sections/snippets ────────────────────────────────
const liquidFiles = allFiles.filter((f) => f.endsWith('.liquid'));
for (const file of liquidFiles) {
  const src = fs.readFileSync(file, 'utf8');
  const schemaMatch = src.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if (!schemaMatch) continue;
  try {
    const schema = JSON.parse(schemaMatch[1]);
    if (schema.name === undefined) warnings.push(`Schema missing "name": ${path.relative(ROOT, file)}`);
  } catch (e: any) {
    errors.push(`Schema JSON invalid: ${path.relative(ROOT, file)} — ${e.message}`);
  }
}

// ── 3. Locale keys used via | t exist in en.default.json ─────────────────
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales/en.default.json'), 'utf8'));
const hi = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales/hi.json'), 'utf8'));
const gu = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales/gu.json'), 'utf8'));

function hasKey(tree: any, key: string): boolean {
  return key.split('.').every((part) => {
    if (tree && typeof tree === 'object' && part in tree) {
      tree = tree[part];
      return true;
    }
    return false;
  });
}

for (const file of liquidFiles) {
  const src = fs.readFileSync(file, 'utf8');
  const re = /'([a-z0-9_.]+)'\s*\|\s*t\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const key = m[1];
    if (!hasKey(en, key)) errors.push(`Missing en key "${key}" (used in ${path.relative(ROOT, file)})`);
    if (!hasKey(hi, key)) warnings.push(`Missing hi key "${key}" (${path.relative(ROOT, file)})`);
    if (!hasKey(gu, key)) warnings.push(`Missing gu key "${key}" (${path.relative(ROOT, file)})`);
  }
}

// hi/gu must have the SAME top-level tree as en
function topKeys(tree: any): string[] {
  return Object.keys(tree).sort();
}
const enTop = topKeys(en);
for (const [name, tree] of [['hi', hi], ['gu', gu]] as const) {
  const diff = enTop.filter((k) => !topKeys(tree).includes(k));
  if (diff.length) warnings.push(`locales/${name}.json missing top-level groups: ${diff.join(', ')}`);
}

// ── 4. Liquid tag balance ────────────────────────────────────────────────
const PAIRS = [
  ['if', 'endif'],
  ['unless', 'endunless'],
  ['for', 'endfor'],
  ['case', 'endcase'],
  ['capture', 'endcapture'],
  ['form', 'endform'],
  ['paginate', 'endpaginate'],
  ['schema', 'endschema'],
  ['style', 'endstyle'],
] as const;
for (const file of liquidFiles) {
  // Strip {% comment %}…{% endcomment %} blocks — they may mention tags in prose.
  const src = fs.readFileSync(file, 'utf8').replace(/{%-?\s*comment\s*-?%}[\s\S]*?{%-?\s*endcomment\s*-?%}/g, '');
  for (const [open, close] of PAIRS) {
    const openCount = (src.match(new RegExp(`{%-?\\s*${open}[\\s'%]`, 'g')) || []).length;
    const closeCount = (src.match(new RegExp(`{%-?\\s*${close}\\s*-?%}`, 'g')) || []).length;
    if (openCount !== closeCount) {
      errors.push(`Tag balance ${open}/${close} = ${openCount}/${closeCount} in ${path.relative(ROOT, file)}`);
    }
  }
  // raw JS-string braces inside {% json %}? Not used. Check stray {{ in schema blocks
}

// ── 5. Templates reference existing sections ─────────────────────────────
const sectionTypes = new Set(
  fs.readdirSync(path.join(ROOT, 'sections')).map((f) => f.replace(/\.liquid$/, '')),
);
const templatesDir = path.join(ROOT, 'templates');
for (const file of fs.readdirSync(templatesDir)) {
  if (!file.endsWith('.json')) continue;
  const tpl = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
  for (const [id, sec] of Object.entries<any>(tpl.sections || {})) {
    if (!sectionTypes.has(sec.type)) {
      errors.push(`Template ${file}: section "${id}" references missing section type "${sec.type}"`);
    }
  }
  const order = tpl.order || [];
  const ids = Object.keys(tpl.sections || {});
  for (const o of order) {
    if (!ids.includes(o)) errors.push(`Template ${file}: order references unknown section id "${o}"`);
  }
}

// ── 6. Assets referenced by theme.liquid exist ───────────────────────────
const layout = fs.readFileSync(path.join(ROOT, 'layout/theme.liquid'), 'utf8');
const assetRefs = [...layout.matchAll(/'([a-z0-9_.-]+\.(?:js|css))'\s*\|\s*asset_url/g)].map((m) => m[1]);
for (const ref of assetRefs) {
  if (!fs.existsSync(path.join(ROOT, 'assets', ref))) {
    errors.push(`layout/theme.liquid references missing asset: ${ref}`);
  }
}
// snippets rendered anywhere must exist
const snippetDir = new Set(
  fs.readdirSync(path.join(ROOT, 'snippets')).map((f) => f.replace(/\.liquid$/, '')),
);
for (const file of liquidFiles) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/{%\s*render\s+'([a-z0-9_-]+)'/g)) {
    if (!snippetDir.has(m[1])) errors.push(`Missing snippet "${m[1]}" (rendered in ${path.relative(ROOT, file)})`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────
console.log(`Files scanned: ${allFiles.length} (liquid ${liquidFiles.length}, json ${jsonFiles.length})`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach((w) => console.log('  ⚠ ' + w));
}
if (errors.length) {
  console.log(`\nERRORS (${errors.length}):`);
  errors.forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ Theme validation PASSED');
