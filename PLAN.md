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
- [ ] Edit generated content (rich text editor)
- [ ] Save/load drafts (local storage or DB)

### Phase 3: Template System
- [x] Template engine architecture
- [x] 3 basic templates (minimal, professional, modern)
- [x] Dynamic layout system (auto-adjusts as content changes)
- [x] Template preview mode
- [ ] Template switcher (change template, keep content) - regenerates for now

### Phase 4: Design Elements
- [x] Icon library integration (Lucide React)
- [x] Quote boxes component
- [x] Callout components (info, tip, warning, success)
- [x] Stat cards / highlight boxes
- [x] Dividers & section breaks (line, dots, wave, stars)
- [x] CTA buttons (multiple styles and icons)
- [ ] Integrate elements into templates
- [ ] Background patterns/textures
- [ ] Color overlays on images
- [ ] Charts/graphs for data visualization

### Phase 5: Image Handling
- [x] Unsplash API integration
- [x] Pexels API integration (fallback)
- [x] Image search by keyword
- [x] Attribution footer (automatic)
- [x] Integrate images into ebook generation
- [x] Auto-fetch images per section
- [ ] Manual image upload (optional)
- [ ] Image positioning controls (optional)
- [ ] Image cropping/resizing (optional)

### Phase 6: Branding System
- [ ] Brand color picker (primary, secondary, accent)
- [ ] Font selector (Google Fonts integration)
- [ ] Logo upload
- [ ] Save brand presets
- [ ] Apply brand across all templates
- [ ] Brand consistency enforcement

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
- [ ] Table of contents generation (optional)
- [ ] PDF optimization (file size) (optional)

### Phase 8: Multi-Format Export
- [ ] PNG export (individual pages)
- [ ] PNG export (full document as images)
- [ ] PowerPoint export (PPTX)
- [ ] Slide deck mode

### Phase 9: Advanced Features (Week 2-3)
- [ ] AI Magic Wand (design variations)
- [ ] One asset → multiple formats (ebook → social posts)
- [ ] Social media post templates (Instagram, LinkedIn, Twitter)
- [ ] Ad templates (Facebook, Google)
- [ ] Banner templates
- [ ] Template library (10+ professional templates)
- [ ] Custom template creator

### Phase 10: Polish & UX
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality
- [ ] Auto-save
- [ ] Mobile responsive (optional)

---

## Technical Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui (component library)
- Lucide Icons
- React Hook Form

**AI & APIs:**
- Claude API (Anthropic)
- Unsplash API
- Pexels API
- Google Fonts API

**PDF Generation:**
- Puppeteer
- html2canvas (for PNG export)
- pptxgenjs (for PowerPoint export)

**Storage:**
- Local file system (personal use)
- Optional: Vercel Blob for cloud storage

**Deployment:**
- Vercel (web version)
- Electron (optional desktop app later)

---

## File Structure

```
pagesmith/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── editor/
│   │   └── page.tsx          # Main editor interface
│   ├── api/
│   │   ├── generate/         # AI content generation
│   │   ├── images/           # Image search/fetch
│   │   └── export/           # PDF/PNG/PPTX export
├── components/
│   ├── editor/
│   │   ├── ContentEditor.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── DesignPanel.tsx
│   ├── templates/
│   │   ├── MinimalTemplate.tsx
│   │   ├── ProfessionalTemplate.tsx
│   │   └── ModernTemplate.tsx
│   ├── elements/
│   │   ├── QuoteBox.tsx
│   │   ├── StatCard.tsx
│   │   ├── CalloutBox.tsx
│   │   └── CTAButton.tsx
│   └── ui/                   # Shadcn components
├── lib/
│   ├── ai/
│   │   └── claude.ts         # Claude API wrapper
│   ├── images/
│   │   ├── unsplash.ts
│   │   └── pexels.ts
│   ├── pdf/
│   │   └── generator.ts
│   └── utils/
├── styles/
│   └── globals.css
├── public/
│   └── templates/            # Static template assets
├── .env.local                # API keys (gitignored)
├── package.json
└── README.md
```

---

## API Keys Needed

- [ ] Anthropic API Key (Claude)
- [ ] Unsplash Access Key
- [ ] Pexels API Key
- [ ] (Optional) Getty Images API

---

## GitHub Setup

**Repo:** https://github.com/skylarmartinex/PageSmith  
**Branch Strategy:** `main` for stable, feature branches for new work  
**Commit Style:** Keep commits atomic, one feature per commit

---

## Notes

- Start with **Phase 1-3** to get a working MVP
- Antigravity can handle most component building
- SignalShip provides architecture guidance
- Update `PROGRESS.md` as you complete items
- Flag blockers in `PROGRESS.md` for SignalShip to help with
