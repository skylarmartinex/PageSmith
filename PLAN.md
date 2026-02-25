# PageSmith - Full Typeset Replacement

**Goal:** Build a complete AI-powered ebook/lead magnet generator that matches or beats Typeset.

**Builder:** Skylar (using Antigravity)  
**Architect:** SignalShip  
**Timeline:** 2-3 weeks for v1

---

## Core Features (Must-Have)

### Phase 1: Foundation (Week 1)
- [x] Next.js 14 setup with App Router
- [x] TypeScript + Tailwind CSS
- [x] Basic project structure
- [x] Environment variables setup (.env.local)
- [x] Claude API integration
- [x] API route for content generation
- [x] Basic UI (input form)
- [x] Content editor component

### Phase 2: AI Content Generation
- [x] Topic/outline input form
- [x] Claude generates full ebook content
- [x] Section-based content structure
- [x] AI suggests image keywords per section
- [x] Edit generated content (inline EditPanel)
- [x] Save/load drafts (localStorage)
- [x] Brand voice matching (paste sample text → Claude matches tone)
- [x] Persona targeting (write for CFO / founder / marketer etc.)
- [x] Web-grounded stats via Exa (real cited statistics)

### Phase 3: Template System
- [x] Template engine architecture
- [x] 8 templates (Minimal, Professional, Modern, Bold, Elegant, Gradient, Tech, Warm)
- [x] Dynamic layout system (auto-adjusts as content changes)
- [x] Template preview mode
- [x] Template switcher (change template, keep content)

### Phase 4: Design Elements
- [x] Icon library integration (Lucide React)
- [x] Quote boxes / pull quotes component
- [x] Callout components (Tip, Warning, Key Insight)
- [x] Stat cards / highlight boxes
- [x] Dividers & section breaks
- [x] Charts/graphs for data visualization (SVG bar/line/pie/donut/progress)
- [x] Process flow diagrams (SVG)
- [x] Timeline components (SVG)
- [x] Comparison tables (brand-colored, ✓/✗ cells, recommended column)
- [x] Icon + text grids (2/3/4 col Lucide icon + title + description)
- [x] Chapter opener spreads (full-bleed section dividers)
- [x] AI Infographic toggle (Imagen 3 illustrated infographic per chart/diagram)
- [ ] Background patterns/textures
- [ ] Color overlays on images

### Phase 5: Image Handling
- [x] Unsplash API integration
- [x] Pexels API integration (fallback)
- [x] Image search by keyword
- [x] Attribution footer (automatic)
- [x] Integrate images into ebook generation
- [x] Auto-fetch images per section
- [x] Inline image swap (hover any image → Unsplash search or Imagen 3 AI Generate)
- [x] Imagen 3 (Google) image generation — dual-tab ImagePicker
- [ ] Manual image upload (optional)
- [ ] Image positioning controls (optional)
- [ ] Image cropping/resizing (optional)

### Phase 6: Branding System
- [x] Brand color picker (primary, secondary, accent, background, text)
- [x] Custom hex color inputs alongside swatches
- [x] Font selector (20 Google Fonts)
- [x] AI font pairing suggestions (Claude Haiku picks heading+body font pair)
- [x] Logo upload
- [x] Save brand presets (localStorage)
- [x] Apply brand across all templates
- [x] Brand voice matching field
- [x] Target persona selector

### Phase 7: PDF Export
- [x] Puppeteer setup
- [x] Template → HTML conversion
- [x] CSS for print/PDF
- [x] PDF generation API
- [x] Export button in editor
- [x] Automatic file download
- [x] Cover page design (all templates)
- [ ] Multi-column layouts (optional)
- [ ] Headers/footers with page numbers (optional)
- [x] Table of contents generation
- [ ] PDF optimization (file size) (optional)

### Phase 8: Multi-Format Export
- [ ] PNG export (individual pages)
- [ ] PNG export (full document as images)
- [x] PowerPoint export (PPTX)
- [ ] Slide deck mode

### Phase 9: Advanced Features (Week 2-3)
- [x] AI Magic Wand (brand palette from topic)
- [x] One asset → multiple formats (ebook → social posts)
- [x] Social media post templates (Instagram, LinkedIn, Twitter)
- [ ] Ad templates (Facebook, Google)
- [ ] Banner templates
- [ ] Custom template creator

### Phase 10: Polish & UX
- [x] Loading states
- [x] Error handling
- [x] Keyboard shortcuts (Enter to generate, Esc to close modals)
- [x] Draft persistence
- [x] Dark mode preview toggle
- [x] Section drag-and-drop reorder
- [x] Per-section layout override (6 layout options)
- [ ] Undo/redo functionality
- [ ] Auto-save
- [ ] Mobile responsive (optional)

### Phase 11: Publishing & Sharing
- [x] Shareable web URL (`/share/[id]`) — live webpage with reading progress, sticky ToC, scroll animations
- [x] Lead capture CTA page (branded email opt-in at end of every shared ebook)
- [ ] Gated download (email → get ebook funnel)
- [ ] Interactive flipbook mode
- [ ] EPUB export
- [ ] HTML embed export (`<iframe>`)

### Phase 12: Excalidraw-Style Infographics
**Goal:** Enable AI-generated infographics with hand-drawn/sketchy Excalidraw aesthetic as fallback when Imagen 3 isn't accurate enough

**What This Enables:**
- Visual infographics (not just flowcharts/diagrams)
- Hand-drawn aesthetic like Excalidraw
- Use in PageSmith ebooks and presentations
- AI-assisted generation with human-in-the-loop refinement

**Implementation Options:**
- [ ] **Option 1: AI → Excalidraw JSON → Render**
  - [ ] Claude generates Excalidraw-compatible JSON (elements: rectangles, text, arrows, etc.)
  - [ ] Embed Excalidraw React component in PageSmith to render/edit
  - [ ] User can tweak the output before exporting
  - [ ] Export as PNG/SVG for ebooks

- [ ] **Option 2: Human-in-the-Loop Flow**
  - [ ] AI generates detailed description/layout of the infographic
  - [ ] Opens Excalidraw (embedded or link to excalidraw.com)
  - [ ] User creates based on AI guidance, or AI pre-populates rough draft
  - [ ] User refines and exports

- [ ] **Option 3: Hybrid (Recommended)**
  - [ ] AI generates rough Excalidraw JSON with placeholders
  - [ ] User opens in embedded editor to polish
  - [ ] One-click export to ebook (PNG/SVG → insert into section)

**Deliverables:**
- [ ] Excalidraw React component embedded in PageSmith
- [ ] AI prompt that outputs Excalidraw JSON structure
- [ ] Export flow (PNG/SVG → insert into ebook)
- [ ] UI to trigger infographic generation from ebook editor
- [ ] Integration with existing image insertion flow

---

## Technical Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Hook Form

**AI & APIs:**
- Claude API (Anthropic) — content generation
- Google Gemini / Imagen 3 — image generation
- Exa — web-grounded statistics
- Unsplash API — stock photos
- Pexels API — stock photos fallback
- Google Fonts API

**PDF Generation:**
- Puppeteer
- html2canvas (for PNG export)
- pptxgenjs (for PowerPoint export)

**Storage:**
- Upstash Redis — shareable ebook URLs (30-day TTL)
- localStorage — drafts + brand presets
- Optional: Vercel Blob for cloud storage

**Deployment:**
- Vercel

---

## API Keys Needed

- [x] Anthropic API Key (Claude)
- [x] Unsplash Access Key
- [x] Google AI API Key (Imagen 3)
- [x] Upstash Redis URL + Token
- [x] Exa API Key (optional — web-grounded stats)
- [ ] Pexels API Key (optional fallback)

---

## GitHub Setup

**Repo:** https://github.com/skylarmartinex/PageSmith  
**Branch Strategy:** `main` for stable, feature branches for new work  
**Commit Style:** Keep commits atomic, one feature per commit

---

## Notes

- Update this file as features ship
- SignalShip provides architecture guidance
- Flag blockers for SignalShip to help with

*Last updated: Feb 24, 2026*
