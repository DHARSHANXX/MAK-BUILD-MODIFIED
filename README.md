# MAK BUILD — House Construction Packages in Sirkazhi

> Fast, crisp, single-page website for **MAK BUILD – Construction & Design**, Sirkazhi, Tamil Nadu.  
> Built with React + Tailwind CSS, optimized for performance on mobile devices.

---

## ⚡ 5-Line Quickstart & Configuration Guide

1. **Edit Business Content / Pricing / Contacts**: [`src/config.js`](file:///C:/Users/DHARSHAN/Documents/GitHub/MAK-BUILD-MODIFIED/src/config.js) (packages, rates, phones, specs, photos).
2. **Install Dependencies**: `npm install` (Node.js 18+ recommended).
3. **Run Local Dev Server**: `npm run dev` (starts Vite dev server with Hot Module Replacement).
4. **Build Production Bundle**: `npm run build` (outputs optimized bundle to `dist/` and syncs with repository root for GitHub Pages).
5. **Deploy to GitHub Pages**: Push repository `main` branch to GitHub (repository root is ready for direct GitHub Pages deployment).

---

## 🎨 Design System

- **Typography**:
  - Headings: `Archivo Black` (class `font-display`)
  - Body: `Hind` + `Noto Sans Tamil`
  - Loaded non-blocking via Google Fonts (`display=swap`)
- **Colors**:
  - Warm off-white background: `oklch(0.975 0.006 85)` (`var(--color-bg-light)`)
  - Charcoal text: `oklch(0.2 0.01 60)` (`var(--color-text-main)`)
  - Amber primary: `oklch(0.76 0.16 70)` (`var(--color-primary-amber)`)
  - Dark charcoal secondary sections: `oklch(0.22 0.01 60)` (`var(--color-bg-dark)`) with off-white text
  - Small radius: `0.25rem` (`rounded`)

---

## 📱 Page Sections (in exact order)

1. **Header**: Fixed top header with logo, brand name, and fixed language switch pill button (`"தமிழ் / English"`).
2. **Hero**: Full-screen (`min 88svh`) photo of a built villa with dark gradient from the bottom, eyebrow `"MAK BUILD · Sirkazhi"`, huge heading `"Your home. Built right."`, pill badge `"50+ homes built across Sirkazhi & Mayiladuthurai"`, subtitle `"Three clear packages from ₹2200/sq.ft. Residential, commercial & interiors."`, and one primary button `"Book a free site visit"` linking to WhatsApp.
3. **Why strip**: One row of 5 items with check icons: Free design charge · Customized plan · Structural design · GFC-standard drawings · Built to IS standards.
4. **Packages ("Packages 2026")**:
   - Subtitle: `"Price per sq.ft, including materials & labour."`
   - 3 cards with price/sq.ft, one-line note, "Popular" badge on Moderate (amber highlight card), first 7 spec rows, and `"Get {name} quote"` WhatsApp button:
     - **Basic ₹2200** — "Solid build, smart budget"
     - **Moderate ₹2400** — "Most chosen for family homes" (Popular, highlighted)
     - **Premium ₹2500** — "Top brands + soil test & structural design"
   - Expandable `"Compare full specification"` `<details>` table with all 12 spec rows and 4 quality assurance check rows.
5. **Our Work**: Dark section with heading + Instagram link (`https://www.instagram.com/mak_build_construction`). 4 photos in 2×2 mobile / 4-col desktop grid (4:5 aspect) with 16s Ken Burns zoom loop (CSS only, `prefers-reduced-motion` disables it):
   - Contemporary Villa (`assets/villa-contemporary-after.jpg`)
   - Penthouse Interior (`assets/penthouse-after-hd.jpg?v=6`)
   - Living & Kitchen (`assets/portfolio-interior-design.jpg`)
   - Retail Studio (`assets/commercial-retail-after.jpg`)
6. **Contact**: Heading `"Let's build."`, subtitle `"Free design consultation. Book a free site visit today."`, one big WhatsApp button, phone `81441 66022`, phone `93857 47544`, email `makbuildsy@gmail.com`, address `"No.117c, Pidari South Street, Sirkazhi 609110"`, and Google Maps iframe embed of `"117c Pidari South Street, Sirkazhi 609110"`.
7. **Footer**: `"© 2026 MAK BUILD, Sirkazhi"`.
8. **Fixed floating WhatsApp button**: Bottom-right (mobile only).

---

## 🌐 100% Bilingual Dictionary

Every string on the page is dynamically translated between English and Tamil using a complete dictionary in `src/translations.js`, toggled via the fixed top-right pill button with state persistence in `localStorage`.

---

© 2026 MAK BUILD — Construction & Design • Sirkazhi, Tamil Nadu.
