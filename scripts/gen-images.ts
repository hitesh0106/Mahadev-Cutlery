import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT = '/home/z/my-project/public/images';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const STYLE =
  'premium editorial retail photography, warm cream and beige tones with soft terracotta-gold accents, ' +
  'bright airy light, elegant minimalist composition, soft shadows, high quality, professional, no text, no watermark, no logos';

const JOBS: Array<{ file: string; size: string; prompt: string }> = [
  {
    file: 'hero-secondary.jpg', size: '768x1344',
    prompt: `Refined still life of a boutique gift store shelf with neatly arranged premium boxes, cosmetics and folded apparel in warm ivory tones, ${STYLE}`,
  },
  {
    file: 'dept-beauty.jpg', size: '1024x1024',
    prompt: `Minimal skincare and beauty products arrangement, unbranded cream bottles and jars on beige stone pedestal, ${STYLE}`,
  },
  {
    file: 'dept-makeup.jpg', size: '1024x1024',
    prompt: `Unbranded makeup flat lay with lipsticks, compact and brushes arranged on soft ivory fabric, ${STYLE}`,
  },
  {
    file: 'dept-haircare.jpg', size: '1024x1024',
    prompt: `Unbranded shampoo and hair care bottles on a warm beige background with eucalyptus sprig, salon style, ${STYLE}`,
  },
  {
    file: 'dept-innerwear.jpg', size: '1024x1024',
    prompt: `Neatly folded soft cotton innerwear garments and vests stacked in warm neutral tones on cream background, cozy textile still life, ${STYLE}`,
  },
  {
    file: 'dept-kids.jpg', size: '1024x1024',
    prompt: `Charming arrangement of soft plush toys and wooden toys on a warm cream background, playful but refined, ${STYLE}`,
  },
  {
    file: 'dept-gifts.jpg', size: '1024x1024',
    prompt: `Stack of elegant gift boxes wrapped in kraft paper and cream ribbons with small decorative ornaments, festive warm light, ${STYLE}`,
  },
  {
    file: 'dept-jewellery.jpg', size: '1024x1024',
    prompt: `Delicate imitation jewellery earrings and bangles displayed on soft beige velvet tray, warm golden reflections, ${STYLE}`,
  },
  {
    file: 'dept-tools.jpg', size: '1024x1024',
    prompt: `Beauty tools and grooming accessories flat lay, combs, brushes and compact mirror in warm neutral tones, ${STYLE}`,
  },
  {
    file: 'dept-accessories.jpg', size: '1024x1024',
    prompt: `Lifestyle accessories flat lay with leather belt, sunglasses and small perfume bottle on warm beige linen, ${STYLE}`,
  },
  {
    file: 'gift-wrapping.jpg', size: '1152x864',
    prompt: `Hands wrapping a gift box with cream paper and terracotta ribbon on a wooden table, gift tags and twine nearby, cozy warm light, ${STYLE}`,
  },
  {
    file: 'gift-finder.jpg', size: '1344x768',
    prompt: `Festive Diwali themed gift arrangement with diyas, marigold flowers and wrapped presents in warm golden light, elegant and refined, ${STYLE}`,
  },
];

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout after ' + ms + 'ms')), ms);
    p.then((v) => { clearTimeout(timer); resolve(v); })
     .catch((e) => { clearTimeout(timer); reject(e); });
  });
}

async function genOne(zai: any, job: { file: string; size: string; prompt: string }): Promise<string> {
  const out = path.join(OUT, job.file);
  if (fs.existsSync(out) && fs.statSync(out).size > 20000) {
    console.log(`SKIP ${job.file} (cached)`);
    return job.file;
  }
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await withTimeout(
        zai.images.generations.create({ prompt: job.prompt, size: job.size }),
        180_000,
      );
      const b64 = res?.data?.[0]?.base64;
      if (!b64) throw new Error('no base64 in response');
      fs.writeFileSync(out, Buffer.from(b64, 'base64'));
      console.log(`OK ${job.file} (${fs.statSync(out).size} bytes)`);
      return job.file;
    } catch (e: any) {
      console.error(`FAIL attempt ${attempt} ${job.file}: ${e?.message || e}`);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return job.file + ' FAILED';
}

async function main() {
  const zai = await ZAI.create();
  const results: string[] = [];
  // Batches of 3 to stay gentle on the API while still parallel.
  for (let i = 0; i < JOBS.length; i += 3) {
    const batch = JOBS.slice(i, i + 3);
    const settled = await Promise.all(batch.map((job) => genOne(zai, job)));
    results.push(...settled);
    console.log(`BATCH ${Math.floor(i / 3) + 1} done (${results.length}/${JOBS.length})`);
  }
  const failed = results.filter((r) => r.includes('FAILED'));
  console.log(failed.length ? `IMAGES DONE WITH FAILURES:\n${failed.join('\n')}` : 'IMAGES DONE: all OK');
  process.exit(failed.length ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
