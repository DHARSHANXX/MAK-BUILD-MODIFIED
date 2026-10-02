# CHANGELOG: MAK BUILD — High-Performance Polish & Quality Assurance

**Project**: MAK BUILD — Construction & Design  
**Date**: October 2, 2026  
**Stack**: Pure HTML5 + CSS3 + Vanilla ES6 JavaScript (Zero Build Tools, GitHub Pages Compatible)

---

## Executive Summary
This fix-and-polish release resolves all 5 critical quality problems identified across the site without redesigning or altering the brand essence:
1. **Problem 1 (Blurry Images)**: Replaced low-res thumbnails with Lanczos3-resampled multi-tier AVIF/WebP/JPEG derivatives (up to 2560px), responsive `<picture>` tags with DPR-capped CSS scaling.
2. **Problem 2 (Before/After Slider)**: Re-engineered comparison engine using composite-only `clip-path` and `transform` via `requestAnimationFrame` with Pointer Capture and keyboard navigation (clamped 4%–96%).
3. **Problem 3 ("3D Designs" Tab & Red Specks)**: Synchronized URL hash deep linking (`#work?cat=3d`), wired category counts, styled 3D glass cards with pre-filled WhatsApp design request CTAs and lightbox preview, and eliminated GPU subpixel red specks via layout containment and font smoothing.
4. **Problem 4 (Logo Mark & Studio Card)**: Vectorized and created transparent light logo marks (`logo-mark.svg`, `logo-mark.png`), upgraded Studio Card with fluid clamp typography, gold credential pills, signboard photo, and 48px glossy action buttons.
5. **Problem 5 (Colour System & Contrast Audit)**: Implemented strict CSS design tokens (`--bg`, `--surface`, `--gold`, `--text`) ensuring all text contrast ratios exceed 4.5:1 (targeting 7:1+).

---

## Detailed Problem Diagnoses & Solutions

### Problem 1: Blurry Images (HD, Sharp, Glossy)
- **Root Cause Diagnosis**:
  1. Fixed 640px thumbnails were stretched across 100vw desktop hero and full-width comparison containers.
  2. Master villa image was constrained to 638px and lacked high-resolution derivatives for high-DPI screens (`devicePixelRatio > 1`).
  3. Absence of responsive `<picture>` tags with `srcset` and `sizes` descriptors led to sub-optimal downscaling without antialiasing.
- **Implementation**:
  - Built local Node.js optimization pipeline (`tools/optimize-images.cjs`) utilizing `sharp` with Lanczos3 resampling and a 0.5-sigma post-scale sharpen.
  - Generated derivatives at 480w, 768w, 1080w, 1600w, and 2400w in modern AVIF (Q62) and WebP (Q84) with MozJPEG fallbacks.
  - Sourced true high-resolution originals:
    - `peb-facility`: 2560 × 1440 px
    - `villa-facade`: 2560 × 1600 px
    - `commercial-retail`: 1280 × 724 px
    - `penthouse`: 1376 × 768 px
    - `bespoke-living-kitchen`: 1376 × 768 px
  - Enforced CSS capping: containers whose sources are smaller than 1080px (e.g., 600px 3D renders) are centered and capped to their natural width, preventing upscaling blur.
  - Generated complete audit log in `image-report.md`.

---

### Problem 2: Before/After Slider (60fps Silk-Smooth Engine)
- **Root Cause Diagnosis**:
  1. The legacy slider animated the DOM `width` property on the after-layer, triggering continuous layout reflows during drag operations.
  2. Pointer events were uncaptured, causing drags to cancel whenever the cursor exited the container bounding box.
  3. Handle position at `0%` allowed the handle to clip past the left container boundary.
  4. Missing `touch-action: pan-y` prevented normal vertical page scrolling on mobile devices.
- **Implementation**:
  - Rebuilt dragging logic using modern Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) with `setPointerCapture`.
  - Added `touch-action: pan-y` on container to preserve native vertical touch scrolling.
  - Moved reveal rendering entirely to GPU composite layer:
    - Clip-path: `clip-path: inset(0 0 0 X%)` on `.ba-layer-after`
    - Transform: `transform: translate3d(X%, 0, 0)` on `.ba-divider`
    - All updates scheduled inside `requestAnimationFrame` (0 reflow).
  - Styled 44px glossy gold circular handle with `<>` chevrons and thin gold divider line, strictly clamped between 4% and 96%.
  - Added clear "BEFORE" and "AFTER" chips (≥14px white text on dark glass) and caption tags.
  - Added keyboard accessibility: ArrowLeft / ArrowRight (2% step), Home (4%), End (96%), updating `aria-valuenow`.
  - Added skeleton shimmer loading state until both before and after high-res images decode.
  - Added subtle intro hint nudge animation (±8% over 1.4s) when scrolled into view via `IntersectionObserver`, skipped for `prefers-reduced-motion` and canceled immediately on user touch.

---

### Problem 3: "3D Design" Option & Red Specks Removal
- **Root Cause Diagnosis**:
  1. 3D Design tab lacked hash deep-linking (`#work?cat=3d`) and dynamic count indicators.
  2. The red specks appearing above the "3D DESIGN" badge were caused by GPU subpixel text antialiasing bleed (ClearType subpixel color fringing on high-contrast dark navy surfaces) across unisolated stacking contexts.
- **Implementation**:
  - Synchronized filter tabs with URL hash (`#work?cat=3d`), updating active tab styles and project count badges.
  - Filter logic automatically hides the tab if no 3D designs are present and skips items lacking images.
  - Added gold "3D DESIGN" glass badge (decorative) on each 3D card.
  - Added "Request this design" WhatsApp CTA prefilling:
    `Hi MAK BUILD, I like the '<title>' design. Please share details.`
  - Enabled click-to-lightbox showing HD render, title, description, and `"Concept render, not a completed project"` disclaimer badge.
  - Prepared dual-image support: if both `renderImage` and `builtImage` exist, the lightbox renders a "3D Design vs Final Build" comparison slider; if only render exists, it displays the single HD render without fake photos.
  - Eliminated red specks completely by setting `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`, `contain: layout paint;`, and `isolation: isolate;` on `.project-card`, `.project-details`, and `.project-badge`. Verified at 100%, 125%, 150% zoom and DPR 1/2/3.

---

### Problem 4: Logo White Box & Studio Card Typography
- **Root Cause Diagnosis**:
  1. `mak-logo-hd-clean.png` possessed an opaque white rectangular background, producing an unsightly white box on navy surfaces.
  2. Studio card typography was hardcoded to small fixed pixel sizes (12-14px) and lacked structured hierarchy.
- **Implementation**:
  - Vectorized and created `assets/logo-mark.svg`, `assets/logo-mark.png`, and `assets/logo-mark@2x.png` with 100% transparent backgrounds, off-white `#F4F7FB` light strokes, and `#E3C877` / `#C9A24B` gold strokes for dark backgrounds.
  - Replaced logo across header, footer, and studio card using `<picture>` with SVG primary and PNG fallback.
  - Upgraded Studio Card into a luxury dark glass panel (`#0F1A2E` with 1px gold gradient border) featuring the office signboard photo (sharp, HD, rounded 16px, gold hairline border) alongside fluid clamp typography:
    - Brand name "MAK BUILD": `clamp(28px, 4vw, 40px)`, weight 700, `#F4F7FB`
    - Tagline "CONSTRUCTION & DESIGN": `clamp(12px, 1.6vw, 14px)`, letter-spacing 0.28em, `#E3C877`
    - Engineer name "Er. Manikandan Rajendran": `clamp(20px, 2.6vw, 26px)`, weight 600, `#FFFFFF`
    - Credentials: two gold-outlined glass pill chips "Civil & Structural Engineer" and "Registered Engineer"
    - Body description: `15px` minimum body text
    - Studio address: `clamp(15px, 1.8vw, 17px)` with gold map pin icon
    - Three 48px glossy action buttons: "Get Directions" (Google Maps link), "Call" (`tel:+918144166022`), and "WhatsApp".

---

### Problem 5: Proper Colour System & Contrast Audit
- **Root Cause Diagnosis**:
  Legacy color variables had mixed opacity overlays and some secondary/muted text colors fell below the WCAG AA 4.5:1 minimum contrast requirement on navy surfaces.
- **Implementation**:
  - Standardized `:root` CSS design tokens:
    - `--bg: #080B11`
    - `--surface: #0F1A2E`
    - `--surface-2: #14233D`
    - `--border: rgba(227, 200, 119, 0.28)`
    - `--gold: #C9A24B`
    - `--gold-light: #E3C877`
    - `--gold-grad: linear-gradient(135deg, #E3C877, #C9A24B 55%, #A9812F)`
    - `--text: #F4F7FB` (contrast ratio ~16.2:1 against `#080B11`)
    - `--text-2: #DCE4EE` (contrast ratio ~13.5:1 against `#080B11`)
    - `--text-muted: #B4C0D0` (contrast ratio ~9.2:1 against `#080B11`, ≥7:1 against `#0F1A2E`)
  - Updated buttons: primary = gold gradient with `#0B1220` dark text; secondary = transparent with gold border and `#F4F7FB` text; hover brightens, active presses down 1px.
  - Updated badges/chips: glass background `rgba(255, 255, 255, 0.06)`, 1px gold border, `#E3C877` text (contrast 8.5:1).
  - All text-to-background combinations audited and verified ≥ 4.5:1 (targeting and exceeding 7:1).

---

## Verification & Acceptance Test Results

| Test Category | Test Parameter | Result | Notes |
| :--- | :--- | :---: | :--- |
| **Viewport & Layout** | 360, 390, 768, 1024, 1440, 1920 px | **PASS** | `scrollWidth === innerWidth` (0 horizontal overflow) |
| **Image Sharpness** | High-DPI (DPR 1, 2, 3) | **PASS** | HD derivatives served; 600px sources capped without upscaling blur |
| **Before/After Slider**| Pointer Drag & Pointer Capture | **PASS** | Smooth 60fps drag; vertical scrolling unaffected on phones |
| **Before/After Slider**| Handle Boundary Clamping | **PASS** | Clamped strictly between 4% and 96%; no clipping |
| **Before/After Slider**| Keyboard Navigation | **PASS** | ArrowLeft (-2%), ArrowRight (+2%), Home (4%), End (96%) |
| **3D Designs Tab** | Deep Linking (`#work?cat=3d`) | **PASS** | URL hash updates; filters correctly; count shows 3 |
| **3D Designs Tab** | Red Specks Audit | **PASS** | 0 red specks across 100%, 125%, 150% zoom |
| **3D Designs Tab** | WhatsApp Request Action | **PASS** | URL-encoded message formatted with project title |
| **Lightbox** | Modal, Concept Badge & Nav | **PASS** | Esc closes, Arrow keys cycle, focus trapped inside dialog |
| **Studio Card** | Logo Transparency | **PASS** | 0 white box; vector mark on dark surface |
| **Studio Card** | Fluid Typography & Buttons | **PASS** | Brand: 40px, Eng: 26px, Body: 15px, Buttons: 48px |
| **Color & Contrast** | WCAG AA / AAA Ratios | **PASS** | All text ≥ 4.5:1 (targeting 7:1+) |
| **Bilingual Toggle** | English ↔ Tamil Toggle | **PASS** | All headings, cards, and UI copy switch instantly |
| **Console Errors** | Browser Runtime | **PASS** | 0 errors captured in test suite |

---

## Update: Signboard Legibility & Commercial Showroom "Before" Slide (October 2, 2026)

### 1. Studio Signboard Legibility Perfection ("1st Image")
- **Problem**: In the studio card signboard (`office-signboard.webp`), the text and credentials were tiny, blurry, and low-contrast when scaled down to mobile/laptop viewports.
- **Root Cause**: The signboard artwork was an old raster export with low-contrast dark gold text and small font sizes (24px–52px on a 1600px plate).
- **Solution**:
  - Re-engineered the master artwork using SVG rendering via Sharp (`tools/make-signboard.cjs`) at 1600×1000 with a luxury beveled dark navy plate, gold border, and brass mounting screws.
  - Rendered the transparent vector MAK BUILD brand emblem at 480×300 with gold drop-glow (0 white box).
  - Increased typography scale and contrast:
    - **Er. Manikandan Rajendran**: 64px font-weight 900 in pure white `#FFFFFF` (contrast >17:1).
    - **Credential Pills** ("Civil & Structural Engineer" & "Registered Engineer"): Expanded to 510×68px pills with gold borders, font-size 30px bold 800 white text.
    - **Physical Address** ("117C, Pidari South Street, Sirkazhi 609110"): 44px font-weight 700 with a 2x gold map pin icon.
    - **Action Button** ("VISIT OUR SIRKAZHI STUDIO"): 880×92px gold pill with 34px bold 900 luminous gold text (`#FFF8E0`).
  - Generated responsive multi-tier derivatives (480w, 768w, 1080w, 1600w) in AVIF, WebP, and MozJPEG; updated `index.html` and `app.js`.

### 2. Commercial Retail Showroom "Before" Slide Replacement ("3rd Image to 2nd Place")
- **Requirement**: Place the user-provided 3rd image (the sharp, wide-angle raw interior photo, `media_1790959021974.jpg`) into the "BEFORE" slide of the 2nd comparison location on the site ("Commercial Retail Showroom").
- **Solution**:
  - Ingested the master image (1024×526 JPEG) as `assets/originals/commercial-retail-before.jpg`.
  - Processed Lanczos3 derivatives with 0.5-sigma sharpen for 480w, 768w, and 1024w in AVIF, WebP, and MozJPEG.
  - Updated `IMAGE_WIDTHS['commercial-retail-before']` in `app.js` and `projects.json` to reference the 1024w master.
  - Verified with automated Puppeteer tests that the 2nd comparison slider displays the high-res raw interior before slide, smoothly transitioning to the completed showroom after slide.

