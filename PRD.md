# PageSmith - Product Requirements Document

**Version:** 0.1  
**Last Updated:** 2026-02-24  
**Status:** In Development  
**Live Site:** https://pagesmith-chi.vercel.app

---

## 1. Executive Summary

**Product Name:** PageSmith  
**Category:** AI-Powered Content Creation Tool  
**Target User:** Personal use (Skylar) - creating lead magnets, guides, and ebooks  
**Goal:** Replace Typeset with a better, self-hosted alternative

### Problem Statement
Typeset costs $31-39/month for ebook creation. We can build a superior tool that:
- Uses latest Claude AI (better content generation)
- Is free to use (self-hosted, pay only for API usage)
- Provides more control and customization
- Focuses solely on ebooks/lead magnets (not bloated with other features)

---

## 2. Product Vision

### What We're Building
A web application that generates professional ebooks and lead magnets using AI. Users input a topic or outline, and the system:
1. Generates complete content via Claude AI
2. Automatically suggests and inserts relevant images
3. Applies professional design templates
4. Exports to PDF, PNG, and PowerPoint

### Success Criteria
- Generates publication-ready ebooks in under 5 minutes
- Quality matches or exceeds Typeset output
- Easy enough for non-designers to use
- Cost < $5 per ebook (API usage only)

---

## 3. Core Features

### Phase 1: Foundation ✅ COMPLETE
- [x] Next.js 14 web application
- [x] TypeScript + Tailwind CSS
- [x] Basic landing page
- [x] Editor interface (input/preview layout)
- [x] Vercel deployment
- **Status:** Live at https://pagesmith-chi.vercel.app

### Phase 2: AI Content Generation (Next Priority)
- [ ] Claude API integration
- [ ] Topic → outline → full content generation
- [ ] Section-based content structure
- [ ] Rich text editor for content refinement
- [ ] Save/load drafts (local storage or database)
- [ ] AI-suggested image keywords per section

### Phase 3: Template System
- [ ] Dynamic template engine
- [ ] 3 initial templates (minimal, professional, modern)
- [ ] Auto-layout (adjusts as content changes)
- [ ] Template switcher (keep content, change design)
- [ ] Template preview mode

### Phase 4: Design Elements
- [ ] Icon library (Heroicons or Lucide)
- [ ] Quote boxes / callout components
- [ ] Stat cards / highlight boxes
- [ ] Dividers & section breaks
- [ ] CTA buttons
- [ ] Background patterns/textures
- [ ] Color overlays on images
- [ ] Charts/graphs for data

### Phase 5: Image Handling
- [ ] Unsplash API integration (5M images, 50 req/hour)
- [ ] Pexels API integration (fallback, 200 req/hour)
- [ ] AI-powered image search by keyword
- [ ] Manual image upload
- [ ] Image positioning/cropping/resizing
- [ ] Automatic attribution footer

### Phase 6: Branding System
- [ ] Brand color picker (primary, secondary, accent)
- [ ] Google Fonts integration
- [ ] Logo upload
- [ ] Save brand presets
- [ ] Apply brand consistently across templates

### Phase 7: Export (MVP Goal)
- [ ] PDF export (Puppeteer)
- [ ] Multi-column layouts
- [ ] Headers/footers with page numbers
- [ ] Auto-generated table of contents
- [ ] Cover page design
- [ ] PNG export (individual pages)
- [ ] PowerPoint export (PPTX)

### Phase 8: Advanced Features (Post-MVP)
- [ ] AI Magic Wand (design variations)
- [ ] One asset → multiple formats (ebook → social posts/ads)
- [ ] Social media templates (Instagram, LinkedIn, Twitter)
- [ ] Ad templates (Facebook, Google)
- [ ] 10+ professional templates
- [ ] Custom template creator

---

## 4. Technical Architecture

### Tech Stack
**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Lucide Icons

**AI & APIs:**
- Claude API (Anthropic) - content generation
- Unsplash API - free stock images
- Pexels API - backup image source
- Google Fonts API - typography

**Export:**
- Puppeteer - PDF generation (headless Chrome)
- html2canvas - PNG export
- pptxgenjs - PowerPoint export

**Hosting:**
- Vercel (free tier)
- GitHub (version control)

**Storage:**
- Local file system (personal use)
- Optional: Vercel Blob for cloud storage

### File Structure
```
pagesmith/
├── app/
│   ├── page.tsx              # Landing page ✅
│   ├── layout.tsx            # Root layout ✅
│   ├── editor/
│   │   └── page.tsx          # Main editor ✅
│   └── api/
│       ├── generate/         # AI content generation
│       ├── images/           # Image search/fetch
│       └── export/           # PDF/PNG/PPTX export
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
│   │   └── CTAButton.tsx
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── ai/
│   │   └── claude.ts         # Claude API wrapper
│   ├── images/
│   │   ├── unsplash.ts
│   │   └── pexels.ts
│   ├── pdf/
│   │   └── generator.ts
│   └── utils/
└── public/
    └── templates/            # Static template assets
```

---

## 5. User Workflows

### Workflow 1: Quick Ebook from Topic
1. User lands on homepage
2. Clicks "Start Creating"
3. Enters topic: "How to Start a Blog in 2026"
4. AI generates outline → user approves
5. AI writes full content (5-10 sections)
6. User picks template (e.g., "Modern")
7. AI suggests images per section
8. Auto-inserts images from Unsplash
9. User previews, makes minor edits
10. Exports to PDF
**Time:** 3-5 minutes

### Workflow 2: Ebook from Outline
1. User enters topic + custom outline
2. AI fills in content based on outline
3. User edits content in rich text editor
4. Applies template + brand colors
5. Manually adjusts some images
6. Exports to PDF + PNG (for social sharing)
**Time:** 10-15 minutes

### Workflow 3: Multi-Format Campaign
1. Creates ebook (as above)
2. Clicks "Generate Social Posts"
3. AI extracts key quotes/stats
4. Creates 5-10 social media graphics
5. Exports all as PNG
**Time:** +5 minutes

---

## 6. Competitive Analysis

### Typeset ($31-39/month)
**Strengths:**
- Established product, polished UI
- Multi-format (presentations, social, ads)
- Getty Images library (100M images)
- Real-time collaboration

**Weaknesses:**
- Expensive for personal use
- Older AI models
- Bloated features (we don't need presentations/ads)
- Requires subscription

**How We Win:**
- Latest Claude AI (better content)
- Self-hosted (no subscription)
- Focused on ebooks only (simpler, faster)
- Full control and customization

---

## 7. API Requirements & Costs

### Claude API (Anthropic)
- **Model:** Claude Sonnet 4
- **Cost:** ~$0.50-2.00 per ebook (depending on length)
- **Usage:** Content generation + image keyword suggestions

### Unsplash API
- **Tier:** Free
- **Limits:** 50 requests/hour
- **Cost:** $0

### Pexels API
- **Tier:** Free
- **Limits:** 200 requests/hour
- **Cost:** $0

### Total Cost per Ebook: ~$0.50-2.00
**vs. Typeset:** $31-39/month (15-78 ebooks to break even)

---

## 8. Development Timeline

### Week 1 (Current)
- ✅ Phase 1: Foundation (COMPLETE - deployed to Vercel)
- 🚧 Phase 2: AI content generation
- 🚧 Phase 3: Basic templates

**Goal:** Working MVP that generates content and exports basic PDFs

### Week 2
- Phase 4: Design elements
- Phase 5: Image handling
- Phase 6: Branding system

**Goal:** Full-featured ebook creator

### Week 3
- Phase 7: Export polish (PDF/PNG/PPT)
- Phase 8: Advanced features (if time)
- Testing & refinement

**Goal:** Production-ready tool

---

## 9. Success Metrics

### MVP Success (End of Week 1)
- ✅ Site live and accessible
- [ ] Generate 1000+ word ebook from topic
- [ ] Apply professional template
- [ ] Export to PDF
- [ ] Total time: < 5 minutes

### v1 Success (End of Week 3)
- [ ] Create 10 different ebooks (various topics)
- [ ] Quality matches Typeset output
- [ ] Cost per ebook < $2
- [ ] Use for actual lead magnets in ScaleSearch/SignalShip projects

---

## 10. Open Questions

1. **Auth:** Do we need user accounts, or keep it open?  
   → *Decision: Keep open for now (personal use)*

2. **Storage:** Local files or cloud storage?  
   → *Decision: Local for MVP, add Vercel Blob later if needed*

3. **Monetization:** Build as SaaS later?  
   → *Future consideration - focus on personal use first*

4. **Templates:** Buy template designs or build from scratch?  
   → *Decision: Build from scratch with Tailwind (faster)*

---

## 11. Current Status

**Phase 1:** ✅ Complete  
**Live URL:** https://pagesmith-chi.vercel.app  
**Next Task:** Claude API integration for content generation  
**Blocker:** Need Anthropic API key

---

## 12. References

- **Typeset:** https://typeset.com
- **GitHub Repo:** https://github.com/skylarmartinex/PageSmith
- **Vercel Dashboard:** https://vercel.com/skylarmartinexs-projects/pagesmith
- **Planning Docs:** PLAN.md, PROGRESS.md, SETUP.md
