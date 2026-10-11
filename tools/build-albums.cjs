/**
 * tools/build-albums.cjs
 * Generates responsive AVIF, WebP, and JPEG derivatives (480, 768, 1080, 1600, 2000px wide)
 * from /images/originals/ into /images/projects/<slug>/ and writes /data/projects.json.
 * Never modifies or deletes /images/originals/.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ORIGINALS_DIR = path.join(ROOT, 'images', 'originals');
const OUT_PROJECTS_DIR = path.join(ROOT, 'images', 'projects');
const DATA_DIR = path.join(ROOT, 'data');
const WIDTHS = [480, 768, 1080, 1600, 2000];

const PROJECTS_META = [
  {
    id: 'senthil-residence-sirkazhi',
    slug: 'senthil-residence-sirkazhi',
    sourceFolder: 'Senthil-residence- sirkazhi',
    titleEn: 'Senthil Residence, Sirkazhi',
    titleTa: 'செந்தில் இல்லம், சீர்காழி',
    titleTaReview: 'needs review',
    category: 'residential',
    location: 'Sirkazhi',
    locationTa: 'சீர்காழி',
    status: 'Completed',
    statusTa: 'நிறைவுற்றது',
    coverFile: 'Senthil Residence  _ Sirkazhi.jpg',
    altMap: {
      'Senthil Residence  _ Sirkazhi.jpg':
        'Senthil Residence in Sirkazhi — Contemporary two-storey residential elevation with stone cladding, wood soffit, and terracotta jaali compound wall'
    }
  },
  {
    id: 'interior-chennai',
    slug: 'interior-chennai',
    sourceFolder: 'interior-chennai',
    titleEn: 'Interior at Chennai',
    titleTa: 'சென்னை உட்புற வடிவமைப்பு',
    titleTaReview: 'needs review',
    category: 'interior',
    location: 'Chennai',
    locationTa: 'சென்னை',
    status: 'Completed',
    statusTa: 'நிறைவுற்றது',
    coverFile: 'Enscape_2026-09-21-19-21-21_living false ceiling.png',
    altMap: {
      'Enscape_2026-09-18-16-19-55_Kitchen-2.png':
        'Interior at Chennai — Contemporary L-shaped modular kitchen in muted rose-mauve finish with fluted glass overhead cabinets and quartz countertop',
      'Enscape_2026-09-18-16-19-55_master bed.png':
        'Interior at Chennai — Master bedroom floor-to-ceiling wardrobe in matte white and warm oak with backlit circular vanity mirror',
      'Enscape_2026-09-21-19-21-21_living false ceiling.png':
        'Interior at Chennai — Spacious living hall featuring slatted wood coffered false ceiling, marble TV unit with backlit display niches, and lounge seating',
      'Enscape_2026-09-21-19-33-13_Enscape scene 1.png':
        'Interior at Chennai — Bedroom wardrobe, illuminated round dressing mirror with fluted wood backdrop, and integrated study desk'
    }
  },
  {
    id: 'interior-vellore',
    slug: 'interior-vellore',
    sourceFolder: 'Interior-vellore',
    titleEn: 'Interior at Vellore',
    titleTa: 'வேலூர் உட்புற வடிவமைப்பு',
    titleTaReview: 'needs review',
    category: 'interior',
    location: 'Vellore',
    locationTa: 'வேலூர்',
    status: 'Completed',
    statusTa: 'நிறைவுற்றது',
    coverFile: 'Living 15072025.png',
    altMap: {
      'BEDROOM-1.png':
        'Interior at Vellore — Bedroom interior with sage-green panelled floor-to-ceiling wardrobe, botanical accent wall niche for TV, and teak wood двери',
      'Living 15072025.png':
        'Interior at Vellore — Open-plan living and dining hall with cream upholstery, arched wooden slat partition, crystal chandelier, and cove ceiling',
      'MASTERBED VIEW2.png':
        'Interior at Vellore — Master bedroom featuring fluted walnut TV wall panel, dual-tone full-height wardrobes, and warm recessed lighting'
    }
  },
  {
    id: 'kathir-interior',
    slug: 'kathir-interior',
    sourceFolder: 'Kathir-interior',
    titleEn: 'Kathir Interior',
    titleTa: 'கதிர் உட்புற வடிவமைப்பு',
    titleTaReview: 'needs review',
    category: 'interior',
    location: 'Thanjavur',
    locationTa: 'தஞ்சாவூர்',
    status: 'Completed',
    statusTa: 'நிறைவுற்றது',
    coverFile: 'Enscape_2025-09-05-19-34-06_living-2.png',
    altMap: {
      'Enscape_2025-09-05-19-34-06_Bedroom2a.png':
        'Kathir Interior — Secondary bedroom wardrobe and custom headboard joinery with warm cove lighting',
      'Enscape_2025-09-05-19-34-06_dining-3.png':
        'Kathir Interior — Dining hall perspective showing crockery unit, wash counter niche, and warm pendant lighting',
      'Enscape_2025-09-05-19-34-06_Dining.png':
        'Kathir Interior — Six-seater wooden dining area with backlit crockery display cabinet and false ceiling',
      'Enscape_2025-09-05-19-34-06_dressing -1.png':
        'Kathir Interior — Built-in dressing unit with full-height mirror, storage drawers, and warm accent lighting',
      'Enscape_2025-09-05-19-34-06_kitchen-.3.png':
        'Kathir Interior — Modular kitchen view highlighting tall appliance garage, overhead cabinets, and under-cabinet LED task lighting',
      'Enscape_2025-09-05-19-34-06_Kitchen-2.png':
        'Kathir Interior — Parallel counter view of the modular kitchen with sleek handleless drawers and marble-textured backsplash',
      'Enscape_2025-09-05-19-34-06_Kitchen.png':
        'Kathir Interior — U-shaped glossy taupe modular kitchen with tambour roller shutter, wicker pull-out baskets, and herringbone tile backsplash',
      'Enscape_2025-09-05-19-34-06_living-2.png':
        'Kathir Interior — Wide living room view with glass curio cabinet, marble-backed TV unit, fluted wood console, teak armchairs, and floral mural wall',
      'Enscape_2025-09-05-19-34-06_Living-3.png':
        'Kathir Interior — Living room seating arrangement facing the marble and fluted-wood entertainment wall with circular chandelier',
      'Enscape_2025-09-05-19-34-06_Living.png':
        'Kathir Interior — Living room perspective showcasing custom wooden sofa, tropical botanical wall mural, sliding partition, and carved pooja door',
      'Enscape_2025-09-05-19-34-06_master bed-1.png':
        'Kathir Interior — Master bedroom suite with upholstered headboard, floor-to-ceiling wardrobes, and warm ambient ceiling lights',
      'Enscape_2025-09-05-19-34-06_Master bed-2.png':
        'Kathir Interior — Master bedroom opposite angle featuring TV console, wardrobe shutters, and study/vanity corner',
      'Enscape_2025-09-05-19-34-06_pooja door .png':
        'Kathir Interior — Traditional teak wood pooja room double door with intricate brass-finished jaali panels',
      'Enscape_2025-09-05-19-34-06_pooja.png':
        'Kathir Interior — Pooja room interior with backlit mandir backdrop, carved wooden shelving, and drawers',
      'Enscape_2025-09-05-19-34-06_tv unit.png':
        'Kathir Interior — Close-up elevation of the living room marble-clad TV wall unit with fluted wooden base and tinted glass display cabinet'
    }
  },
  {
    id: 'office-interior',
    slug: 'office-interior',
    sourceFolder: 'Office-interior',
    titleEn: 'Office Interior',
    titleTa: 'அலுவலக உட்புற வடிவமைப்பு',
    titleTaReview: 'needs review',
    category: 'commercial',
    location: 'Sirkazhi',
    locationTa: 'சீர்காழி',
    status: 'Completed',
    statusTa: 'நிறைவுற்றது',
    coverFile: 'Enscape_2026-08-17-16-47-02_Rec-2.png',
    altMap: {
      'Enscape_2026-08-17-16-47-02_Rec-2.png':
        'Office Interior — Commercial reception and waiting lounge with wood-and-fluted reception desk, sculptural ring chandelier, and glass meeting room',
      'Enscape_2026-08-17-17-07-37_Dining-4.png':
        'Office Interior — Staff dining and pantry room with marble-top table, wooden wall panelling, and warm linear lighting',
      'Enscape_2026-08-17-17-07-37_dining.png':
        'Office Interior — Executive dining and breakout area with modern seating and custom cabinetry',
      'Enscape_2026-08-17-17-17-04_MD room.png':
        'Office Interior — Managing Director cabin featuring marble-top executive desk, fluted wood backdrop with backlit logo, and devotional artwork niche',
      'Enscape_2026-08-17-17-17-04_MD-3.png':
        'Office Interior — Managing Director room media wall with dual displays, leather lounge sofa, and geometric wood wall art',
      'Enscape_2026-08-17-17-17-04_Md-6.png':
        'Office Interior — Managing Director cabin wide angle showing visitor chairs, textured concrete wall finish, and glass partition',
      'Enscape_2026-08-17-17-17-04_MD.png':
        'Office Interior — Managing Director suite side perspective highlighting executive desk, black leather sofa, and custom wooden wall sculptures'
    }
  }
];

function cleanSlug(filename, idx) {
  const ext = path.extname(filename);
  const raw = path.basename(filename, ext)
    .toLowerCase()
    .replace(/^enscape_\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}_/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const prefix = String(idx + 1).padStart(2, '0');
  return `${prefix}-${raw || 'image'}`;
}

async function run() {
  fs.mkdirSync(OUT_PROJECTS_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const projectsOutput = [];

  for (const meta of PROJECTS_META) {
    const srcFolder = path.join(ORIGINALS_DIR, meta.sourceFolder);
    if (!fs.existsSync(srcFolder)) {
      throw new Error(`Missing source folder: ${srcFolder}`);
    }

    const outFolder = path.join(OUT_PROJECTS_DIR, meta.slug);
    fs.mkdirSync(outFolder, { recursive: true });

    const files = fs.readdirSync(srcFolder)
      .filter(f => /\.(png|jpe?g|webp|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    console.log(`\nProcessing ${meta.slug} (${files.length} images)...`);

    const imagesList = [];
    let coverObj = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const srcPath = path.join(srcFolder, file);
      const imgMeta = await sharp(srcPath).metadata();
      const origW = imgMeta.width || 3840;
      const origH = imgMeta.height || 2160;

      const itemSlug = cleanSlug(file, i);
      const relBase = `images/projects/${meta.slug}/${itemSlug}`;
      const validWidths = WIDTHS.filter(w => w <= origW);
      const isCoverFile = (file === meta.coverFile) || (!meta.coverFile && i === 0);

      for (const w of validWidths) {
        const avifPath = path.join(outFolder, `${itemSlug}-${w}.avif`);
        const webpPath = path.join(outFolder, `${itemSlug}-${w}.webp`);
        const jpgPath = path.join(outFolder, `${itemSlug}-${w}.jpg`);
        const forceRebuild = isCoverFile && (w === 768 || w === 1080 || w === 1600);

        if (forceRebuild || !fs.existsSync(avifPath)) {
          await sharp(srcPath)
            .resize({ width: w, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
            .sharpen({ sigma: 0.72, m1: 0.8, m2: 1.5 })
            .avif({ quality: 55, effort: 4 })
            .toFile(avifPath);
        }
        if (forceRebuild || !fs.existsSync(webpPath)) {
          await sharp(srcPath)
            .resize({ width: w, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
            .sharpen({ sigma: 0.72, m1: 0.8, m2: 1.5 })
            .webp({ quality: 80, effort: 4 })
            .toFile(webpPath);
        }
        if (forceRebuild || !fs.existsSync(jpgPath)) {
          await sharp(srcPath)
            .resize({ width: w, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
            .sharpen({ sigma: 0.72, m1: 0.8, m2: 1.5 })
            .jpeg({ quality: 80, mozjpeg: true })
            .toFile(jpgPath);
        }
      }

      // Also build dedicated 4:3 crisp cover derivatives at 768, 1080, 1600 widths so 100% of naturalWidth is used in the 4:3 cover frame
      if (isCoverFile) {
        for (const cw of [768, 1080, 1600]) {
          const ch = Math.round(cw * 0.75); // 4:3 exact
          const cBase = path.join(outFolder, `cover-${cw}`);
          await sharp(srcPath)
            .resize(cw, ch, { fit: 'cover', position: 'center', kernel: sharp.kernel.lanczos3 })
            .sharpen({ sigma: 0.75, m1: 0.85, m2: 1.6 })
            .avif({ quality: 55, effort: 4 })
            .toFile(`${cBase}.avif`);
          await sharp(srcPath)
            .resize(cw, ch, { fit: 'cover', position: 'center', kernel: sharp.kernel.lanczos3 })
            .sharpen({ sigma: 0.75, m1: 0.85, m2: 1.6 })
            .webp({ quality: 80, effort: 4 })
            .toFile(`${cBase}.webp`);
          await sharp(srcPath)
            .resize(cw, ch, { fit: 'cover', position: 'center', kernel: sharp.kernel.lanczos3 })
            .sharpen({ sigma: 0.75, m1: 0.85, m2: 1.6 })
            .jpeg({ quality: 80, mozjpeg: true })
            .toFile(`${cBase}.jpg`);
        }
      }

      const altText = (meta.altMap && meta.altMap[file])
        ? meta.altMap[file]
        : `${meta.titleEn} — Photo ${i + 1}`;

      const imageEntry = {
        id: `${meta.slug}-${String(i + 1).padStart(2, '0')}`,
        index: i + 1,
        filename: file,
        original: `images/originals/${meta.sourceFolder}/${file}`,
        base: relBase,
        src: `${relBase}-1080.jpg`,
        thumb: `${relBase}-480.webp`,
        widths: validWidths,
        width: origW,
        height: origH,
        alt: altText
      };

      imagesList.push(imageEntry);

      if (file === meta.coverFile) {
        coverObj = imageEntry;
      }
      process.stdout.write(`  [${i + 1}/${files.length}] ${file} -> ${itemSlug} (${validWidths.join(',')}w)\n`);
    }

    if (!coverObj && imagesList.length > 0) {
      coverObj = imagesList[0];
    }

    projectsOutput.push({
      id: meta.id,
      slug: meta.slug,
      sourceFolder: meta.sourceFolder,
      titleEn: meta.titleEn,
      titleTa: `${meta.titleTa} (needs review)`,
      titleTaClean: meta.titleTa,
      titleTaStatus: meta.titleTaReview,
      category: meta.category,
      location: meta.location,
      locationTa: meta.locationTa,
      status: meta.status,
      statusTa: meta.statusTa,
      photoCount: imagesList.length,
      cover: `images/projects/${meta.slug}/cover-1080.jpg`,
      coverBase: `images/projects/${meta.slug}/cover`,
      coverFilename: coverObj.filename,
      coverOriginal: coverObj.original,
      coverAlt: coverObj.alt,
      coverWidths: [768, 1080, 1600],
      coverWidth: 1600,
      coverHeight: 1200,
      images: imagesList
    });
  }

  const jsonPath = path.join(DATA_DIR, 'projects.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ projects: projectsOutput }, null, 2), 'utf8');
  console.log(`\nWrote ${jsonPath} with ${projectsOutput.length} projects.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
