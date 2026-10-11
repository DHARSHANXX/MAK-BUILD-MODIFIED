/**
 * tools/build-capabilities-and-process-images.cjs
 * Copies generated originals to /images/generated/ (never deleted) and builds
 * responsive AVIF, WebP, and JPEG sets for /images/services/ (4:3, 1600x1200 + 480/768/1080w)
 * and /images/process/ (4:5, 1200x1500 + 480/768/1080w).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_DIR = 'C:\\Users\\DHARSHAN\\.gemini\\antigravity\\brain\\4a32252f-1f0e-4131-8d2d-440c322de3e1';

const GEN_DIR = path.join(ROOT, 'images', 'generated');
const SERVICES_DIR = path.join(ROOT, 'images', 'services');
const PROCESS_DIR = path.join(ROOT, 'images', 'process');

[GEN_DIR, SERVICES_DIR, PROCESS_DIR].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// 1. Copy AI-generated originals into /images/generated/
const generatedSources = [
  { src: path.join(ARTIFACT_DIR, 'service_plans_elevations_1791659556571.jpg'), dest: path.join(GEN_DIR, 'plans-elevations.jpg') },
  { src: path.join(ARTIFACT_DIR, 'service_approvals_1791656736384.jpg'), dest: path.join(GEN_DIR, 'approvals.jpg') },
  { src: path.join(ARTIFACT_DIR, 'service_renovation_1791656747793.jpg'), dest: path.join(GEN_DIR, 'renovation.jpg') },
  { src: path.join(ARTIFACT_DIR, 'service_estimation_1791656762598.jpg'), dest: path.join(GEN_DIR, 'estimation.jpg') },
  { src: path.join(ARTIFACT_DIR, 'process_site_visit_clean_1791656807430.jpg'), dest: path.join(GEN_DIR, 'site-visit.jpg') },
  { src: path.join(ARTIFACT_DIR, 'process_design_approval_1791656819535.jpg'), dest: path.join(GEN_DIR, 'design-approval.jpg') },
  { src: path.join(ARTIFACT_DIR, 'process_agreement_clean_1791656894739.jpg'), dest: path.join(GEN_DIR, 'agreement.jpg') },
  { src: path.join(ARTIFACT_DIR, 'process_build_1791656843759.jpg'), dest: path.join(GEN_DIR, 'build.jpg') },
  { src: path.join(ARTIFACT_DIR, 'process_handover_1791656855680.jpg'), dest: path.join(GEN_DIR, 'handover.jpg') }
];

generatedSources.forEach(({ src, dest }) => {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing generated source image: ${src}`);
  }
  fs.copyFileSync(src, dest);
});

// 2. Service card definitions (4:3, 1600x1200 master + 480, 768, 1080 responsive widths)
const serviceImages = [
  {
    slug: 'construction',
    type: 1,
    input: path.join(ROOT, 'images', 'originals', 'Senthil-residence- sirkazhi', 'Senthil Residence  _ Sirkazhi.jpg'),
    position: 'center'
  },
  {
    slug: 'plans-elevations',
    type: 2,
    input: path.join(GEN_DIR, 'plans-elevations.jpg'),
    position: 'center'
  },
  {
    slug: 'approvals',
    type: 2,
    input: path.join(GEN_DIR, 'approvals.jpg'),
    position: 'center'
  },
  {
    slug: 'interiors',
    type: 1,
    input: path.join(ROOT, 'images', 'originals', 'interior-chennai', 'Enscape_2026-09-21-19-21-21_living false ceiling.png'),
    position: 'center'
  },
  {
    slug: 'renovation',
    type: 2,
    input: path.join(GEN_DIR, 'renovation.jpg'),
    position: 'center'
  },
  {
    slug: 'estimation',
    type: 2,
    input: path.join(GEN_DIR, 'estimation.jpg'),
    position: 'center'
  }
];

// 3. Process step definitions (4:5 portrait, 1200x1500 master + 480, 768, 1080 responsive widths)
const processImages = [
  {
    slug: 'site-visit',
    type: 2,
    input: path.join(GEN_DIR, 'site-visit.jpg'),
    position: 'center'
  },
  {
    slug: 'design-approval',
    type: 2,
    input: path.join(GEN_DIR, 'design-approval.jpg'),
    position: 'center'
  },
  {
    slug: 'agreement',
    type: 2,
    input: path.join(GEN_DIR, 'agreement.jpg'),
    position: 'center'
  },
  {
    slug: 'build',
    type: 2,
    input: path.join(GEN_DIR, 'build.jpg'),
    position: 'center'
  },
  {
    slug: 'handover',
    type: 3,
    input: path.join(GEN_DIR, 'handover.jpg'),
    position: 'center'
  }
];

const SERVICE_WIDTHS = [480, 768, 1080, 1200];
const PROCESS_WIDTHS = [480, 768, 1080];

async function processSet(items, outDir, masterW, masterH, aspectRatio, widths) {
  let mobileAvifTotal = 0;
  let mobileWebpTotal = 0;
  let maxPopupAvifKB = 0;
  let maxPopupWebpKB = 0;

  for (const item of items) {
    // Master JPG (1600x1200 for services, 1200x1500 for process)
    const masterPath = path.join(outDir, `${item.slug}.jpg`);
    await sharp(item.input)
      .resize(masterW, masterH, { fit: 'cover', position: item.position || 'center', kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 0.65, m1: 0.7, m2: 1.5 })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(masterPath);

    for (const w of widths) {
      const h = Math.round(w / aspectRatio);
      const baseOut = path.join(outDir, `${item.slug}-${w}`);

      const avifPath = `${baseOut}.avif`;
      const webpPath = `${baseOut}.webp`;
      const jpgPath = `${baseOut}.jpg`;

      const avifQ = w <= 768 ? 54 : 56;
      const webpQ = w <= 768 ? 78 : 80;
      const jpgQ = w <= 768 ? 80 : 82;

      await sharp(item.input)
        .resize(w, h, { fit: 'cover', position: item.position || 'center', kernel: sharp.kernel.lanczos3 })
        .sharpen({ sigma: 0.65, m1: 0.7, m2: 1.5 })
        .avif({ quality: avifQ, effort: 4 })
        .toFile(avifPath);

      await sharp(item.input)
        .resize(w, h, { fit: 'cover', position: item.position || 'center', kernel: sharp.kernel.lanczos3 })
        .sharpen({ sigma: 0.65, m1: 0.7, m2: 1.5 })
        .webp({ quality: webpQ, effort: 4 })
        .toFile(webpPath);

      await sharp(item.input)
        .resize(w, h, { fit: 'cover', position: item.position || 'center', kernel: sharp.kernel.lanczos3 })
        .sharpen({ sigma: 0.65, m1: 0.7, m2: 1.5 })
        .jpeg({ quality: jpgQ, mozjpeg: true })
        .toFile(jpgPath);

      if (w === 480) {
        mobileAvifTotal += fs.statSync(avifPath).size;
        mobileWebpTotal += fs.statSync(webpPath).size;
      }
      if (w === 1080 || w === 1200) {
        maxPopupAvifKB = Math.max(maxPopupAvifKB, fs.statSync(avifPath).size / 1024);
        maxPopupWebpKB = Math.max(maxPopupWebpKB, fs.statSync(webpPath).size / 1024);
      }
    }
    console.log(`  Built ${item.slug} (Type ${item.type}) -> master ${masterW}x${masterH} + ${widths.join('/')} AVIF/WebP/JPG`);
  }

  return {
    mobileAvifKB: (mobileAvifTotal / 1024).toFixed(1),
    mobileWebpKB: (mobileWebpTotal / 1024).toFixed(1),
    maxPopupAvifKB: maxPopupAvifKB.toFixed(1),
    maxPopupWebpKB: maxPopupWebpKB.toFixed(1)
  };
}

(async () => {
  console.log('Building /images/services/ (4:3)...');
  const svcStats = await processSet(serviceImages, SERVICES_DIR, 1600, 1200, 4 / 3, SERVICE_WIDTHS);
  console.log(`  Services mobile payload (all 6 cards at 480w): AVIF = ${svcStats.mobileAvifKB} KB | WebP = ${svcStats.mobileWebpKB} KB`);
  console.log(`  Services max popup photo (1080w/1200w): AVIF = ${svcStats.maxPopupAvifKB} KB | WebP = ${svcStats.maxPopupWebpKB} KB`);

  console.log('\nBuilding /images/process/ (4:5)...');
  const procStats = await processSet(processImages, PROCESS_DIR, 1200, 1500, 4 / 5, PROCESS_WIDTHS);
  console.log(`  Process mobile payload (all 5 steps at 480w): AVIF = ${procStats.mobileAvifKB} KB | WebP = ${procStats.mobileWebpKB} KB`);
})();
