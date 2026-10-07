import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = 'public/image3d';
const outDir = path.join(inputDir, 'optimized');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
else { fs.readdirSync(outDir).forEach(f => fs.unlinkSync(path.join(outDir, f))); }

const all = fs.readdirSync(inputDir).filter(f => f.endsWith('.png') && f !== '_contact-sheet.png');
const order = (n) => { if(n==='image.png')return 0; if(n==='image copy.png')return 1; const m=n.match(/image copy (\\d+)\\.png/); if(m)return parseInt(m[1]); return 999; };
all.sort((a,b)=>order(a)-order(b));

const fileToSlug = {
  'image.png': 'school-management',
  'image copy.png': 'fullstack-commerce',
  'image copy 2.png': 'nest-ai-python',
  'image copy 3.png': 'nuxt-admin',
  'image copy 4.png': 'express-shop',
  'image copy 5.png': 'node-express',
  'image copy 6.png': 'tailwind-cli',
  'image copy 7.png': 'laravel-blade',
  'image copy 8.png': 'nest-api',
  'image copy 9.png': 'mongo-express',
  'image copy 10.png': 'course-labs',
};

async function run() {
  for (const f of all) {
    const slug = fileToSlug[f];
    const input = path.join(inputDir, f);
    await sharp(input).resize(1600,1200,{fit:'cover'}).webp({quality:82}).toFile(path.join(outDir,slug+'.webp'));
    await sharp(input).resize(800,600,{fit:'cover'}).webp({quality:82}).toFile(path.join(outDir,slug+'-800.webp'));
    await sharp(input).resize(1200,900,{fit:'cover'}).jpeg({quality:80,mozjpeg:true}).toFile(path.join(outDir,slug+'.jpg'));
    const blur = await sharp(input).resize(24, 18, { fit: 'cover' }).blur(2).png().toBuffer();
    fs.writeFileSync(path.join(outDir, slug + '-blur.txt'), blur.toString('base64'));
  }
  console.log('done');
}
run().catch(e=>{console.error(e);process.exit(1);});
