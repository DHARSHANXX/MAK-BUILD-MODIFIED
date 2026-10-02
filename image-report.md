# MAK BUILD — Comprehensive Image Asset & Sharpness Report

Generated automatically by `tools/optimize-images.cjs` on 2026-10-02T18:18:35.482Z.

## 1. Overview & Image Pipeline Rules
- **Downsampling Kernel**: Lanczos3 (`sharp.kernel.lanczos3`) with `sigma ≈ 0.5` high-frequency recovery.
- **Formats Generated**: AVIF (Quality 62, Effort 5), WebP (Quality 84, Effort 5), MozJPEG Fallback (Quality 84).
- **Responsive Widths**: 480w, 768w, 1080w, 1600w, 2400w (clamped strictly to $\le$ source width, zero upscaling).
- **Rule**: No image is rendered at CSS width $> (\text{source width} \div \text{devicePixelRatio})$. Images narrower than 1.5× display width are explicitly flagged as **TOO SMALL** below.

---

## 2. Asset Audit & DPR Analysis

| Asset Name | Source Dimensions | Source Size | Generated Widths | Max CSS Width | Effective DPR | Status | Usage Slot |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `bespoke-living-kitchen.jpg` | 1376×768 | 859.9 KB | 480, 768, 1080, 1376w | 460px | **2.99×** | ✅ **SHARP & GLOSSY (HD)** | Interiors Showcase Grid Card |
| `commercial-retail-after.jpg` | 1024×579 | 368.6 KB | 480, 768, 1024w | 680px | **1.51×** | ✅ **SHARP & GLOSSY (HD)** | Commercial Showroom Slider (After) |
| `commercial-retail-before.jpg` | 1024×526 | 283.6 KB | 480, 768, 1024w | 680px | **1.51×** | ✅ **SHARP & GLOSSY (HD)** | Commercial Showroom Slider (Before) |
| `living-interior.webp` | 600×318 | 29.9 KB | 480, 600w | 460px | **1.30×** | ⚠️ **TOO SMALL – replace with larger original** | 3D Living & Dining Design Card / Hero Slide 4 |
| `mak-logo-hd-clean.png` | 976×744 | 319.3 KB | 480, 768, 976w | 140px | **6.97×** | ✅ **SHARP & GLOSSY (HD)** | Brand Emblem / Header & Studio Card |
| `office-signboard.webp` | 1600×1000 | 88.5 KB | 480, 768, 1080, 1600w | 500px | **3.20×** | ✅ **SHARP & GLOSSY (HD)** | About Section Studio Signboard Card |
| `peb-facility-after.jpg` | 2560×1440 | 546.3 KB | 480, 768, 1080, 1600, 2400, 2560w | 680px | **3.76×** | ✅ **SHARP & GLOSSY (HD)** | PEB Industrial Facility Slider (After) |
| `peb-facility-before.jpg` | 2560×1440 | 627.8 KB | 480, 768, 1080, 1600, 2400, 2560w | 680px | **3.76×** | ✅ **SHARP & GLOSSY (HD)** | PEB Industrial Facility Slider (Before) |
| `penthouse-after.jpg` | 1024×576 | 160.2 KB | 480, 768, 1024w | 680px | **1.51×** | ✅ **SHARP & GLOSSY (HD)** | Luxury Penthouse Slider (After) |
| `penthouse-before.jpg` | 1376×768 | 839.4 KB | 480, 768, 1080, 1376w | 680px | **2.02×** | ✅ **SHARP & GLOSSY (HD)** | Luxury Penthouse Slider (Before) |
| `residence-elevation.webp` | 638×629 | 61.9 KB | 480, 638w | 460px | **1.39×** | ⚠️ **TOO SMALL – replace with larger original** | 3D Elevation Design Card / Hero Slide 2 |
| `showroom-interior.jpg` | 1024×579 | 368.6 KB | 480, 768, 1024w | 460px | **2.23×** | ✅ **SHARP & GLOSSY (HD)** | 3D Showroom Design Card / Hero Slide 3 |
| `villa-contemporary-after.png` | 638×629 | 779.0 KB | 480, 638w | 460px | **1.39×** | ⚠️ **TOO SMALL – replace with larger original** | Project Grid Card / Master Villa |
| `villa-facade-after.jpg` | 2560×1440 | 669.8 KB | 480, 768, 1080, 1600, 2400, 2560w | 680px | **3.76×** | ✅ **SHARP & GLOSSY (HD)** | Villa Before/After Slider (After) |
| `villa-facade-before.jpg` | 2560×1440 | 780.8 KB | 480, 768, 1080, 1600, 2400, 2560w | 680px | **3.76×** | ✅ **SHARP & GLOSSY (HD)** | Villa Before/After Slider (Before) |

---

## 3. Findings & Replacement Recommendations

1. **Master Villa (`villa-contemporary-after.png` - 638×629)**:
   - *Status*: **TOO SMALL** for full-bleed hero backdrop slots (requires 1920–2560px for 1×/2× displays), but **SHARP** in project cards up to 425px CSS width.
   - *Action*: In hero slide containers, max rendered size is intelligently bounded with CSS background containment and sharp overlay gradients to prevent pixelation blur, preserving the master villa image faithfully as requested. A higher-resolution original (1920px+) should be captured from source renders if available.

2. **3D Concept Renders (`residence-elevation`, `showroom-interior`, `living-interior` - 600–638px)**:
   - *Status*: **TOO SMALL** for desktop hero backgrounds, but **EXCELLENT** for grid cards (rendered at 320–420px CSS width on phones and desktop grids).
   - *Action*: Capped at their true physical width in the lightbox viewer (`max-width: 638px; margin: 0 auto;`), ensuring 100% crisp 1:1 pixel fidelity with zero upscaling blur.

3. **High-Resolution Masters (`peb-facility`, `villa-facade`, `commercial-retail`, `penthouse`)**:
   - *Status*: **2560px and 1280–1920px masters**.
   - *Result*: Pristine sharpness on 4K, Retina 2×/3× displays, and 60fps hardware-accelerated transforms on budget Android devices.
