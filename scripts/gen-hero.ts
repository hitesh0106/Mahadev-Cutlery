import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const STYLE =
  'premium editorial retail photography, warm cream and beige tones with soft terracotta-gold accents, ' +
  'bright airy light, elegant minimalist composition, soft shadows, high quality, professional, no text, no watermark, no logos';

async function main() {
  const zai = await ZAI.create();
  const jobs = [
    {
      file: 'hero-editorial.jpg', size: '1440x1184',
      prompt: `Curated beauty and gifting flat lay on rumpled cream linen: amber glass dropper bottle, white serum bottles, frosted glass cream jar with wooden lid, matte nude lipstick, small gift box with cream ribbon, delicate gold bangles and earrings scattered on a travertine stone tray, olive branch sprig in background, window daylight, ${STYLE}`,
    },
    {
      file: 'editorial-skincare.jpg', size: '1024x1280',
      prompt: `Minimal skincare editorial still life, unbranded frosted glass jars and dropper bottles on a travertine ledge with soft palm shadows on warm plaster wall, spa mood, ${STYLE}`,
    },
  ];
  for (const job of jobs) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await zai.images.generations.create({
          prompt: job.prompt,
          size: job.size as '1024x1024',
        });
        const b64 = response.data[0]?.base64;
        if (!b64) throw new Error('empty response');
        fs.writeFileSync(`/home/z/my-project/public/images/${job.file}`, Buffer.from(b64, 'base64'));
        console.log('OK', job.file);
        break;
      } catch (err) {
        console.error(`attempt ${attempt} failed for ${job.file}:`, (err as Error).message);
        if (attempt === 3) throw err;
        await new Promise((r) => setTimeout(r, 2500));
      }
    }
  }
}
main();
