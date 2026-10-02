/**
 * tools/make-projects.js
 * Scans assets/projects/<slug>/ folders, optimizes images (WebP 1600px full & 640px thumb),
 * extracts width/height, and generates or updates projects.json and projects.template.json.
 * 
 * Usage:
 *   node tools/make-projects.js
 */

import fs from 'fs';
import path from 'path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.warn('Note: "sharp" is not installed or available. Image conversion skipped.');
}

const ROOT_DIR = process.cwd();
const PROJECTS_DIR = path.join(ROOT_DIR, 'assets', 'projects');
const OUTPUT_FILE = path.join(ROOT_DIR, 'projects.json');
const TEMPLATE_FILE = path.join(ROOT_DIR, 'projects.template.json');

// Ensure projects directory exists
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

// 1. Write projects.template.json
const template = [
  {
    "id": "sample-slug",
    "title": "Project Title",
    "titleTa": "திட்டத்தின் பெயர்",
    "category": "Villas", // "Villas" | "Commercial & PEB" | "Interiors" | "3D Designs"
    "badge": "", // Optional badge e.g. "3D Design" or "Completed"
    "location": "", // Optional e.g. "Sirkazhi" (hidden if empty)
    "area": "", // Optional e.g. "3,200 sq.ft" (hidden if empty)
    "year": "", // Optional e.g. "2026" (hidden if empty)
    "cover": "assets/projects/sample-slug/cover.webp",
    "coverThumb": "assets/projects/sample-slug/cover-640.webp",
    "coverWidth": 1600,
    "coverHeight": 1200,
    "hasBeforeAfter": false,
    "beforeImg": "",
    "afterImg": "",
    "beforeLabel": "BEFORE",
    "afterLabel": "AFTER",
    "description": "Short project description (max ~15 words)",
    "descriptionTa": "திட்டத்தின் சுருக்கம்",
    "blurBrand": false,
    "blurNameplate": false,
    "clientPermission": false
  }
];

fs.writeFileSync(TEMPLATE_FILE, JSON.stringify(template, null, 2), 'utf8');
console.log('Generated projects.template.json');

// 2. Scan folders
async function scanAndProcess() {
  let existingProjects = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingProjects = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (e) {
      existingProjects = [];
    }
  }

  const existingMap = new Map(existingProjects.map(p => [p.id, p]));
  const folders = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const slug of folders) {
    const slugDir = path.join(PROJECTS_DIR, slug);
    const files = fs.readdirSync(slugDir);

    let coverFile = files.find(f => /^cover\.(jpe?g|png|webp)$/i.test(f)) || files.find(f => /\.(jpe?g|png|webp)$/i.test(f));
    let beforeFile = files.find(f => /^before\.(jpe?g|png|webp)$/i.test(f));
    let afterFile = files.find(f => /^after\.(jpe?g|png|webp)$/i.test(f));

    let width = 1200;
    let height = 900;

    if (coverFile && sharp) {
      const fullPath = path.join(slugDir, coverFile);
      const meta = await sharp(fullPath).metadata();
      width = meta.width || 1200;
      height = meta.height || 900;

      // Generate WebP if not already webp
      const webpCover = path.join(slugDir, 'cover.webp');
      const thumbCover = path.join(slugDir, 'cover-640.webp');
      
      if (!fs.existsSync(webpCover)) {
        await sharp(fullPath).resize(1600, null, { withoutEnlargement: true }).webp({ quality: 85 }).toFile(webpCover);
      }
      if (!fs.existsSync(thumbCover)) {
        await sharp(fullPath).resize(640, null, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(thumbCover);
      }
    }

    if (!existingMap.has(slug)) {
      existingMap.set(slug, {
        id: slug,
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        titleTa: "",
        category: "Villas",
        badge: "",
        location: "",
        area: "",
        year: "",
        cover: coverFile ? `assets/projects/${slug}/cover.webp` : "",
        coverThumb: coverFile ? `assets/projects/${slug}/cover-640.webp` : "",
        coverWidth: width,
        coverHeight: height,
        hasBeforeAfter: Boolean(beforeFile && afterFile),
        beforeImg: beforeFile ? `assets/projects/${slug}/${beforeFile}` : "",
        afterImg: afterFile ? `assets/projects/${slug}/${afterFile}` : "",
        beforeLabel: "BEFORE",
        afterLabel: "AFTER",
        description: "",
        descriptionTa: "",
        blurBrand: false,
        blurNameplate: false,
        clientPermission: false
      });
    }
  }

  console.log(`Scan completed. ${existingMap.size} projects active.`);
}

scanAndProcess().catch(console.error);
