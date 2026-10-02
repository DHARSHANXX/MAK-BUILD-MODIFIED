# MAK BUILD — Construction & Design

> **Official Website**: [https://dharshanxx.github.io/MAK-BUILD-MODIFIED/](https://dharshanxx.github.io/MAK-BUILD-MODIFIED/)  
> **Studio Address**: 117C, Pidari South Street, Sirkazhi, Tamil Nadu 609110  
> **Key Engineer**: Er. Manikandan Rajendran, Civil & Structural Engineer, Registered Engineer  
> **Hotlines**: [+91 81441 66022](tel:+918144166022) | [+91 93857 47544](tel:+919385747544)  
> **WhatsApp**: [https://wa.me/918144166022](https://wa.me/918144166022)  
> **Email**: [makbuildsy@gmail.com](mailto:makbuildsy@gmail.com)  
> **Instagram**: [@mak_build_construction](https://www.instagram.com/mak_build_construction)  

---

## 📋 Owner Action Items Checklist (`TODO_OWNER`)

To maintain 100% authenticity, all missing items in `content.js` and `projects.json` are set to empty fields (`""` or `false`) and their respective UI elements are **automatically hidden** until verified:

- [ ] **Engineer Registration Number**:
  - Location: `content.js` -> `company.engineerRegNo` & `flags.showEngineerRegistrationNo`
  - Action: Enter the municipal/government civil engineering registration number and set `flags.showEngineerRegistrationNo: true`.
- [ ] **Studio Working Hours**:
  - Location: `content.js` -> `company.workingHours`
  - Action: Enter official working hours (e.g., `"Monday – Saturday: 9:00 AM – 7:30 PM"`).
- [ ] **Contact Form Key (Web3Forms / Formspree)**:
  - Location: `content.js` -> `company.web3FormsKey`
  - Action: Insert your free Web3Forms Access Key from [web3forms.com](https://web3forms.com). Until set, form submissions gracefully fallback to direct WhatsApp enquiry!
- [ ] **Commercial & PEB Shed Rate**:
  - Location: `content.js` -> `estimator.scopes[1].rate` & `hasRates`
  - Action: Set sq.ft rate when ready. While empty, the Quick Estimator prompts the client to share requirements via WhatsApp.
- [ ] **Interiors-Only Sq.Ft Rate**:
  - Location: `content.js` -> `estimator.scopes[2].rate` & `hasRates`
  - Action: Set indicative sq.ft rate for interior packages when ready.
- [ ] **Re-Verify Add-on Pricing in Estimator**:
  - Location: `content.js` -> `estimator.addOns`
  - Current values: Modular Kitchen & Wardrobes (₹2.75 L), 3D Elevation & CAD Plans (₹45,000), Vasthu Blueprints & Sanctions (₹35,000), Borewell & Sump (₹1.20 L).
- [ ] **Pin Code Verification**:
  - Location: `content.js` -> `company.address.pincode`
  - Action: Verified as `609110` (Pidari South Street). Re-confirm against postal authorities and Google Maps location.
- [ ] **High-Resolution Original Photographs**:
  - Replace cropped Instagram screenshots (`assets/designs/`) with original 4K/HD renders from SketchUp/Lumion/3ds Max when available.
- [ ] **Client Nameplate & Brand Permissions**:
  - Location: `projects.json` -> `clientPermission: false`
  - Residence elevation: Nameplate "Benjamin's cottage" is blurred via `blurNameplate: true`.
  - Jewellery showroom: Counter brand "Narayana Jewellers" is blurred via `blurBrand: true`. Set `clientPermission: true` once client approval is received.
- [ ] **Signboard / Studio Photo**:
  - Location: `assets/about/office-signboard.webp`
  - Replace the placeholder studio banner with a photograph of Er. Manikandan Rajendran outside or inside the 117C Pidari South Street studio.

---

## 🔍 Brand & Material Spelling Verification List

The following brand names and trade terms are transcribed directly from the 2026 specification document:

| Item | Transcribed Spelling | Verification Status / Suggested Brand |
| :--- | :--- | :--- |
| **Cement** | Coromandel (written "Coramantal") | Verified as Coromandel Cement |
| **Pipes** | Ashirvad (written "Ahirvad") | Verified as Ashirvad Pipes |
| **Wire** | Havells / Polycab (written "Polycap") | Verified as Polycab |
| **Plumbing** | Plumbing (written "Plumping") | Corrected typo to Plumbing |
| **Column** | Column (written "Coloumn") | Corrected typo to Column |
| **Switches** | Lisha / Hi-Fi (written "Lizha/Hi Fi") | Preserved as written |
| **Steel** | Kavery, Agni, Amman, JSW | Preserved as written |
| **Wood Windows** | Badak / Vembu | Preserved as written |

---

## 🚀 How to Add New Content

### Adding a New Project
1. Create a folder in `assets/projects/<slug>/` (e.g. `assets/projects/my-villa/`).
2. Add your images:
   - Single project: `cover.webp` (or `.jpg`/`.png`)
   - Before/After project: `before.jpg` and `after.jpg`
3. Run the automated scanner tool:
   ```bash
   node tools/make-projects.js
   ```
4. Open `projects.json` and adjust the title, category (`"Villas"` | `"Commercial & PEB"` | `"Interiors"` | `"3D Designs"`), area, and description.

### Adding Client Testimonials
1. Open `testimonials.json`.
2. Add a new client review:
   ```json
   {
     "id": "testimonial-1",
     "clientName": "K. Anbarasan",
     "location": "Sirkazhi",
     "projectType": "Contemporary Villa",
     "feedback": "MAK BUILD delivered our villa on schedule with structural precision.",
     "rating": 5,
     "consentGiven": true
   }
   ```
3. Set `"consentGiven": true` to display the review. If all entries have `consentGiven: false`, the testimonials section is automatically hidden.

---

## 🌐 Deployment to GitHub Pages

This website is a **pure static HTML + CSS + Vanilla JS** architecture.
- **No build steps required**: You do **not** need to run `npm run build` or Vite.
- Simply commit and push your repository to the `main` branch.
- GitHub Pages will automatically serve `index.html`, `styles.css`, `app.js`, and `content.js` from the repository root.

### Connecting a Custom Domain (e.g. `makbuild.in` / `makbuild.com`)
1. In your GitHub repository, go to **Settings** &rarr; **Pages**.
2. Under **Custom domain**, enter your domain name (e.g., `www.makbuild.in`).
3. Click **Save**.
4. In your domain registrar (GoDaddy, Namecheap, Google Domains):
   - Add a `CNAME` record pointing `www` to `dharshanxx.github.io`.
   - Add `A` records pointing `@` to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
5. Enable **Enforce HTTPS** in GitHub repository settings.
