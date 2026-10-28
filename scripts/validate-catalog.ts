// Catalogue taxonomy validator — implements the PART 13 final validation.
// Run: bun scripts/validate-catalog.ts
// Exit code 0 = all checks passed; 1 = failures listed below.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { DEPARTMENTS_EIGHT, BRANDS, ALL_VENDORS } from '../src/lib/taxonomy';
import { DEPARTMENTS as CATALOG_DEPARTMENTS, DEMO_PRODUCTS } from '../src/lib/catalog';
import { DEPARTMENTS as BOUTIQUE_DEPARTMENTS, NAV_LINKS, MENU_GROUPS, ALL_BRANDS } from '../src/lib/boutique';

type Result = { check: string; ok: boolean; detail: string };
const results: Result[] = [];
const ok = (check: string, detail = '') => results.push({ check, ok: true, detail });
const fail = (check: string, detail: string) => results.push({ check, ok: false, detail });

const ROOT = join(import.meta.dir, '..');
const read = (p: string) => readFileSync(join(ROOT, p), 'utf-8');

// ── CSV helpers ──────────────────────────────────────────────────────────────
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

// ── Load files ───────────────────────────────────────────────────────────────
const DEPT_NAMES = DEPARTMENTS_EIGHT.map((d) => d.name);
const DEPT_HANDLES = DEPARTMENTS_EIGHT.map((d) => d.handle);

// 1 ── Files exist
for (const f of [
  'data/brand-department-map.csv',
  'data/department-collection-seed.csv',
  'data/product-import-template.csv',
  'docs/BRAND_DEPARTMENT_MAP.md',
  'docs/PRODUCT_TAXONOMY.md',
  'docs/PRODUCT_IMPORT.md',
]) {
  if (existsSync(join(ROOT, f))) ok(`File exists: ${f}`);
  else fail(`File exists: ${f}`, 'MISSING');
}

// 2 ── brand-department-map.csv
const brandCsv = parseCsv(read('data/brand-department-map.csv'));
const brandHeader = brandCsv[0];
const brandRows = brandCsv.slice(1);
const brandCol = (name: string) => brandHeader.indexOf(name);
if (brandCol('Brand') >= 0 && brandCol('Approved Primary Departments') >= 0) {
  ok('brand-department-map.csv: required columns present', brandHeader.join(' | '));
} else fail('brand-department-map.csv: required columns present', brandHeader.join(' | '));

const csvBrands = brandRows.map((r) => r[brandCol('Brand')].trim());

// 3 ── Duplicate brand names & spelling variants (PART 13 #2)
const counts = new Map<string, number>();
for (const b of csvBrands) counts.set(b.toLowerCase(), (counts.get(b.toLowerCase()) ?? 0) + 1);
const dupes = [...counts.entries()].filter(([, n]) => n > 1);
if (dupes.length === 0) ok('No duplicate brand rows in brand-department-map.csv', `${csvBrands.length} brands`);
else fail('No duplicate brand rows in brand-department-map.csv', dupes.map(([b, n]) => `${b} ×${n}`).join(', '));

// spelling variants that must NOT coexist
const spellingProblems: string[] = [];
const has = (needle: string) => csvBrands.some((b) => b.toLowerCase().includes(needle));
if (has('lakme') && !csvBrands.includes('Lakmé')) spellingProblems.push('Lakmé must use the accented spelling');
if (csvBrands.some((b) => b.includes('L’Oréal'))) spellingProblems.push('curly apostrophe L’Oréal found — use straight apostrophe');
if (has('mars') && !csvBrands.includes('MARS Cosmetics')) spellingProblems.push('MARS Cosmetics canonical spelling missing');
if (csvBrands.includes('MARS')) spellingProblems.push('bare "MARS" row conflicts with canonical "MARS Cosmetics"');
if (spellingProblems.length === 0) ok('Canonical brand spellings (Lakmé, L\'Oréal straight apostrophe, MARS Cosmetics)');
else fail('Canonical brand spellings', spellingProblems.join('; '));

// 4 ── All department references ∈ approved 8 (PART 13 #3)
const deptViolations: string[] = [];
brandRows.forEach((r) => {
  const depts = r[brandCol('Approved Primary Departments')];
  for (const part of depts.split(';')) {
    const d = part.trim().replace(/\s*\(.*\)$/, '');
    if (d.startsWith('Per actual verified product')) continue;
    if (d && !DEPT_NAMES.includes(d)) deptViolations.push(`${r[brandCol('Brand')]}: "${d}"`);
  }
});
if (deptViolations.length === 0) ok('Every brand department ∈ the 8 approved departments');
else fail('Every brand department ∈ the 8 approved departments', deptViolations.join('; '));

const seedCsv = parseCsv(read('data/department-collection-seed.csv'));
const seedDeptCol = seedCsv[0].indexOf('Department');
const seedHandleCol = seedCsv[0].indexOf('Collection Handle');
const seedDepts = seedCsv.slice(1).map((r) => r[seedDeptCol].trim());
const seedHandles = seedCsv.slice(1).map((r) => r[seedHandleCol].trim());
if (seedDepts.length === 8 && seedDepts.every((d) => DEPT_NAMES.includes(d))) {
  ok('department-collection-seed.csv: exactly the 8 approved departments');
} else fail('department-collection-seed.csv: exactly the 8 approved departments', seedDepts.join(', '));
if (JSON.stringify(seedHandles) === JSON.stringify(DEPT_HANDLES)) {
  ok('Collection handles match the approved handles', seedHandles.join(', '));
} else fail('Collection handles match the approved handles', `${seedHandles.join(', ')} vs ${DEPT_HANDLES.join(', ')}`);

// 5 ── Special brand restrictions (PART 13 #4-#8)
const brandRow = (name: string) => brandRows.find((r) => r[brandCol('Brand')] === name);
const cellOf = (name: string, col: string) => {
  const r = brandRow(name);
  return r ? r[brandCol(col)] : '';
};
const checkBan = (brand: string, col: string, mustInclude: string[], label: string) => {
  const cellText = cellOf(brand, col).toLowerCase();
  const missing = mustInclude.filter((m) => !cellText.includes(m));
  if (!brandRow(brand)) fail(label, `${brand} row missing`);
  else if (missing.length === 0) ok(label);
  else fail(label, `${brand} prohibition text missing: ${missing.join(', ')}`);
};
checkBan('Zoiro', 'Prohibited Classifications', ["women's", "girls'", "boys'"], 'Zoiro restricted to men (PART 13 #6)');
checkBan('Bodycare', 'Prohibited Classifications', ["men's"], 'Bodycare has no men\'s category (PART 13 #7)');
checkBan('Lady Care', 'Prohibited Classifications', ["men's", "boys'"], 'Lady Care restricted to women (PART 13 #8)');
checkBan('Lotus Herbals', 'Prohibited Classifications', ['automatically classifying the brand as makeup'], 'Lotus Herbals never auto-classified as makeup (PART 13 #9)');
checkBan('Sunny', 'Prohibited Classifications', ['brand name alone', 'publishing unverified products'], 'Sunny requires verified stock (PART 13 #10)');
checkBan('Ghar Soaps', 'Prohibited Classifications', ['brand identity', 'inventing products'], 'Ghar Soaps requires identity verification (PART 13 #11)');
if (brandRow("L'Oréal Paris") && brandRow("L'Oréal Professionnel") && csvBrands.filter((b) => /loreal|l'oréal/i.test(b)).length === 2) {
  ok("L'Oréal Paris and L'Oréal Professionnel remain separate brands (PART 13 #5)");
} else fail("L'Oréal Paris and L'Oréal Professionnel remain separate brands (PART 13 #5)", csvBrands.filter((b) => /loreal|l'oréal/i.test(b)).join(', '));
if (cellOf('Sunny', 'Verification Status') === 'stock-verification-required' && cellOf('Ghar Soaps', 'Verification Status') === 'identity-unverified') {
  ok('Verification statuses: Sunny stock-verification-required; Ghar Soaps identity-unverified');
} else fail('Verification statuses', `${cellOf('Sunny', 'Verification Status')} / ${cellOf('Ghar Soaps', 'Verification Status')}`);

// 6 ── No kitchenware/cutlery department anywhere (PART 13 #12)
const kitchenHits: string[] = [];
const scan = (label: string, text: string) => {
  for (const line of text.split('\n')) {
    const lower = line.replace(/\*/g, '').toLowerCase();
    if ((lower.includes('kitchen') || lower.includes('cutlery')) &&
        !/no kitchenware|no cutlery|store name includes|includes "cutlery"|cutlery & gift articles|store's name|mahadevcutlery|mahadev_cutlery/i.test(lower)) {
      kitchenHits.push(`${label}: ${line.trim().slice(0, 90)}`);
    }
  }
};
scan('brand-department-map.csv', read('data/brand-department-map.csv'));
scan('department-collection-seed.csv', read('data/department-collection-seed.csv'));
scan('product-import-template.csv', read('data/product-import-template.csv'));
scan('taxonomy.ts', read('src/lib/taxonomy.ts'));
scan('boutique.ts', read('src/lib/boutique.ts'));
scan('catalog.ts', read('src/lib/catalog.ts'));
scan('PRODUCT_TAXONOMY.md', read('docs/PRODUCT_TAXONOMY.md'));
if (kitchenHits.length === 0) ok('No kitchenware/cutlery department anywhere (PART 13 #12)');
else fail('No kitchenware/cutlery department anywhere', kitchenHits.join(' | '));

// 7 ── product-import-template.csv (PART 13 #13)
const tplCsv = parseCsv(read('data/product-import-template.csv'));
const tplHeader = tplCsv[0];
const tplRows = tplCsv.slice(1);
const requiredCols = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags', 'Published', 'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Inventory Qty', 'Variant Price', 'Variant Compare At Price', 'Image Src', 'Status'];
const missingCols = requiredCols.filter((c) => !tplHeader.includes(c));
if (missingCols.length === 0) ok('product-import-template.csv: all required Shopify columns present', `${tplHeader.length} columns`);
else fail('product-import-template.csv: required columns', `missing: ${missingCols.join(', ')}`);
const badRows = tplRows.filter((r) => r.length !== tplHeader.length);
if (badRows.length === 0) ok('product-import-template.csv: every row has consistent column count');
else fail('product-import-template.csv: column counts', `${badRows.length} malformed rows`);
const tplTitleCol = tplHeader.indexOf('Title');
const tplHandleCol = tplHeader.indexOf('Handle');
const markedHandles = new Set(
  tplRows.filter((r) => (r[tplHeader.indexOf('Tags')] ?? '').includes('EXAMPLE-DELETE-BEFORE-IMPORT')).map((r) => r[tplHandleCol]),
);
const unmarked = tplRows.filter((r) => {
  const title = r[tplTitleCol] ?? '';
  if (!title && markedHandles.has(r[tplHandleCol])) return false; // variant continuation row of a marked example
  return !(title.includes('EXAMPLE') && markedHandles.has(r[tplHandleCol]));
});
if (tplRows.length > 0 && unmarked.length === 0) ok('Every example row (incl. variant continuations) belongs to a marked EXAMPLE product');
else fail('Every example row is marked EXAMPLE', `${unmarked.length} unmarked rows`);
const unsafe = tplRows.filter((r) => {
  const published = r[tplHeader.indexOf('Published')];
  const status = r[tplHeader.indexOf('Status')];
  return !(published === 'FALSE' || (published === '' && !(r[tplTitleCol] ?? ''))) || status !== 'draft';
});
if (unsafe.length === 0) ok('Example rows are Published=FALSE + Status=draft (cannot reach the storefront by accident)');
else fail('Example rows safety', `${unsafe.length} rows not draft/unpublished`);
const emptyImages = tplRows.every((r) => (r[tplHeader.indexOf('Image Src')] ?? '') === '');
if (emptyImages) ok('Image Src left empty — no invented image URLs');
else fail('Image Src must be empty in examples', 'some rows contain image URLs');
const noCompareAt = tplRows.every((r) => (r[tplHeader.indexOf('Variant Compare At Price')] ?? '') === '');
if (noCompareAt) ok('No invented discounts (compare-at left empty)');
else fail('Compare-at must be empty in examples');

// 8 ── App data consistency (theme/preview use the same taxonomy)
if (JSON.stringify(BOUTIQUE_DEPARTMENTS.map((d) => d.title)) === JSON.stringify(DEPT_NAMES)) {
  ok('Preview departments match the approved eight');
} else fail('Preview departments match the approved eight', BOUTIQUE_DEPARTMENTS.map((d) => d.title).join(', '));
if (JSON.stringify(CATALOG_DEPARTMENTS.map((d) => d.name)) === JSON.stringify(DEPT_NAMES)) {
  ok('Catalog DEPARTMENTS (XLSX reference) match the approved eight');
} else fail('Catalog DEPARTMENTS match', CATALOG_DEPARTMENTS.map((d) => d.name).join(', '));
const navDepartments = NAV_LINKS.filter((l) => DEPT_NAMES.includes(l));
if (navDepartments.length === 8 && NAV_LINKS[0] === 'Shop All' && NAV_LINKS.includes('Brands')) {
  ok('Main navigation: Shop All + 8 departments + Brands (PART 8)', NAV_LINKS.join(' › '));
} else fail('Main navigation structure', NAV_LINKS.join(' › '));
const megaDepartments = MENU_GROUPS[0].links.filter((l) => DEPT_NAMES.includes(l));
if (megaDepartments.length === 8) ok('Mega menu lists the 8 departments');
else fail('Mega menu lists the 8 departments', MENU_GROUPS[0].links.join(', '));
const badDemoDept = DEMO_PRODUCTS.filter((p) => !DEPT_NAMES.includes(p.department));
if (badDemoDept.length === 0) ok('All sample products classified into the approved eight departments');
else fail('Sample product departments', badDemoDept.map((p) => `${p.id}=${p.department}`).join(', '));
const allowedPrefixes = ['brand_', 'audience_', 'type_', 'department_', 'gf-'];
const badTags = DEMO_PRODUCTS.flatMap((p) => p.tags.filter((t) => !allowedPrefixes.some((pre) => t.startsWith(pre))));
if (badTags.length === 0) ok('Sample tags follow the department_/audience_/type_/brand_ conventions');
else fail('Sample tag conventions', badTags.join(', '));
const oldBrandNames = DEMO_PRODUCTS.map((p) => p.brand).filter((b) => b !== 'Generic (Sample)' && !ALL_VENDORS.includes(b));
if (oldBrandNames.length === 0) ok('Sample product vendors use canonical spellings', ALL_VENDORS.length + ' canonical vendors');
else fail('Sample vendor spellings', oldBrandNames.join(', '));
const brandDirMiss = ALL_BRANDS.filter((b) => !ALL_VENDORS.includes(b) && b !== 'O3+');
if (brandDirMiss.length === 0) ok('Brand directory brands ⊆ canonical vendor list (incl. O3+)', `${ALL_BRANDS.length} brands`);
else fail('Brand directory brands', brandDirMiss.join(', '));

// 9 ── Docs coverage (PART 12 #1-#2)
const brandDoc = read('docs/BRAND_DEPARTMENT_MAP.md');
const missingBrands = csvBrands.filter((b) => !brandDoc.includes(b));
if (missingBrands.length === 0) ok('docs/BRAND_DEPARTMENT_MAP.md covers every brand in the CSV');
else fail('docs/BRAND_DEPARTMENT_MAP.md brand coverage', `missing: ${missingBrands.join(', ')}`);
const taxDoc = read('docs/PRODUCT_TAXONOMY.md');
const missingHandles = DEPT_HANDLES.filter((h) => !taxDoc.includes(`\`${h}\``));
if (missingHandles.length === 0) ok('docs/PRODUCT_TAXONOMY.md lists all 8 collection handles');
else fail('docs/PRODUCT_TAXONOMY.md handles', `missing: ${missingHandles.join(', ')}`);
const importDoc = read('docs/PRODUCT_IMPORT.md');
if (importDoc.includes('Products → Import') && importDoc.includes('CSV UTF-8')) ok('docs/PRODUCT_IMPORT.md documents the import workflow');
else fail('docs/PRODUCT_IMPORT.md workflow documentation');

// 10 ── Theme ZIP structure intact (PART 13 #16)
const themeRoot = existsSync(join(ROOT, 'layout/theme.liquid')) ? ROOT : join(ROOT, 'shopify-theme');
const themeDirs = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'].map((d) => join(themeRoot, d));
const allThemeDirs = themeDirs.every((d) => existsSync(d));
if (allThemeDirs) ok('Shopify theme structure intact (assets/config/layout/locales/sections/snippets/templates)');
else fail('Shopify theme structure intact', 'a theme folder is missing');

// ── Report ───────────────────────────────────────────────────────────────────
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
console.log(`\nCatalogue taxonomy validation — ${passed} passed, ${failed.length} failed\n`);
for (const r of results) {
  console.log(`${r.ok ? '✓' : '✗'} ${r.check}${r.detail && !r.ok ? `\n    → ${r.detail}` : r.detail ? `  (${r.detail})` : ''}`);
}
if (failed.length) {
  console.log('\nFAILURES:');
  for (const f of failed) console.log(`  ✗ ${f.check}\n    → ${f.detail}`);
  process.exit(1);
}
console.log('\n✓ Catalogue validation PASSED');
