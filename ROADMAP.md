# PageSmith — 10x Roadmap

> Goal: not just a Typeset replacement — a tool that makes Typeset irrelevant.

---

## ✅ Already Shipped

- 8 templates (Minimal, Professional, Modern, Bold, Elegant, Gradient, Tech, Warm)
- AI content generation via Claude (enriched: pull quotes, callouts, stat blocks, icons)
- Table of Contents — auto-generated
- Multiple images per section (up to 3, per-keyword)
- 5 layout variants: text-only, image-right, image-left, image-full, image-grid
- image-overlay layout (magazine-style full-bleed photo with text overlay)
- Full-bleed cover hero image (AI picks the keyword, all 8 templates use it uniquely)
- Section Lucide icons
- Callout boxes: Tip / Warning / Key Insight
- Stat metric cards
- PDF export
- PowerPoint (PPTX) export
- Social Post Generator (Instagram / LinkedIn / Twitter)
- AI Magic Wand (brand palette from topic)
- Template hover previews
- Inline editing (EditPanel)
- Draft persistence (localStorage)
- Enter key shortcut for generation
- Author + subtitle fields on all covers
- 20 Google Fonts

---

## 🗺️ Full Feature Roadmap

### 🧠 AI Intelligence

| Feature | Description | Impact |
|---------|-------------|--------|
| **Web-grounded stats** | Integrate Exa/Tavily so every statistic Claude writes is real and cited — not plausible fiction | ⭐⭐⭐ |
| **Brand voice matching** | User pastes 3–5 sentences of their writing style → Claude matches tone throughout | ⭐⭐⭐ |
| **Competitive angle mode** | "Position me as the expert vs [competitor]" — Claude writes to differentiate the author | ⭐⭐ |
| **Research brief mode** | User uploads a PDF/doc, Claude uses it as source material for the ebook | ⭐⭐⭐ |
| **Auto-longer content** | Option for 500-800 word sections with proper structure (H3, lists, transitions) | ⭐⭐ |
| **FAQ section generation** | Claude generates a real FAQ page as the final section based on the full content | ⭐ |
| **Executive summary page** | AI-written 1-page summary / TL;DR after the ToC | ⭐⭐ |
| **Persona targeting** | "Write this for a CFO" / "Write this for a small business owner" — changes vocabulary, depth, examples | ⭐⭐⭐ |
| **Content gap analysis** | After generating, Claude reviews what's missing and suggests 2-3 additional sections | ⭐⭐ |

---

### 📊 Visual Components (No Tool Does These)

| Feature | Description | Impact |
|---------|-------------|--------|
| **SVG bar/line/pie charts** | Claude generates the data → render as real interactive SVG charts inline in sections | ⭐⭐⭐ |
| **Process flow diagrams** | Numbered steps with arrows rendered as styled SVG (like a flowchart) | ⭐⭐⭐ |
| **Timeline components** | Horizontal or vertical milestone timelines with dates and descriptions | ⭐⭐ |
| **Comparison table** | AI generates feature matrix / vs table → rendered as beautiful HTML table with brand colors | ⭐⭐⭐ |
| **Icon + text grids** | Key benefits / features listed as Lucide icon + heading + 1-line desc in a 2-3 col grid | ⭐⭐ |
| **Quote cards** | Full-page or half-page stylized expert quotes with author attribution | ⭐⭐ |
| **AI-generated image alt (custom illustration)** | Use Stability/Replicate to generate custom illustrations instead of stock photos | ⭐⭐ |
| **Chapter opener spreads** | Full-page graphic section dividers (large number + title + accent) between major sections | ⭐⭐ |
| **Progress/percentage bars** | Visual bar charts for showing completion, adoption rates, split stats | ⭐ |
| **Side-by-side quote vs stat** | Layout: pull quote on left, big stat on right with divider | ⭐ |

---

### 🌐 Publishing & Output

| Feature | Description | Impact |
|---------|-------------|--------|
| **Shareable web URL** | Render ebook as a beautiful live webpage at `/share/[id]` — scroll anim, sticky ToC, progress bar | ⭐⭐⭐ |
| **Interactive flipbook mode** | Page-turning HTML flipbook export you can embed anywhere | ⭐⭐⭐ |
| **EPUB export** | Standard ebook format for Kindle / Apple Books / iBooks | ⭐⭐ |
| **HTML embed export** | Drop the ebook as an `<iframe>` on any website | ⭐⭐ |
| **Lead capture CTA page** | Final page with branded email opt-in form + custom CTA copy | ⭐⭐⭐ |
| **Gated download** | Share a link, reader enters email → gets ebook — all handled by PageSmith | ⭐⭐⭐ |
| **Print-ready PDF** | Bleed marks, CMYK export option for professional printing | ⭐ |
| **Dark mode ebook** | Toggle between light/dark version of any template | ⭐⭐ |

---

### 🎨 Design & Editing

| Feature | Description | Impact |
|---------|-------------|--------|
| **Section drag-and-drop reorder** | Reorder sections after generation via drag handles | ⭐⭐⭐ |
| **Per-section layout override** | Click a section and choose its layout manually (override AI pick) | ⭐⭐⭐ |
| **Inline image swap** | Click any image to search for a replacement from Unsplash | ⭐⭐ |
| **Custom color picker** | Full HSL/hex color picker beyond the 5 preset swatches | ⭐⭐ |
| **Brand preset save/load** | Save a brand config as a named preset, load it on future ebooks | ⭐⭐ |
| **Logo background removal** | Auto-remove background from uploaded logo | ⭐ |
| **Margin/spacing controls** | Adjust section padding globally or per-section in the editor | ⭐ |
| **Font pairing suggestions** | AI picks a heading + body font pairing from Google Fonts based on template vibe | ⭐⭐ |
| **Custom template builder** | Visual editor to define your own template from scratch | ⭐⭐⭐ |
| **Gradient cover builder** | Choose gradient direction, colors, opacity for covers | ⭐ |
| **Section background tints** | Apply light tint backgrounds per-section for visual variety | ⭐ |
| **Animated cover (web view)** | Parallax or fade-in animation on cover photo when viewing in browser | ⭐⭐ |

---

### 📱 Interactive / Web-Native

| Feature | Description | Impact |
|---------|-------------|--------|
| **Scroll-triggered animations** | Stat numbers count up, sections fade in, pull quotes slide in on scroll | ⭐⭐⭐ |
| **Sticky table of contents** | Fixed sidebar ToC that highlights current section as you scroll | ⭐⭐ |
| **Reading progress bar** | Thin bar at top of page showing % read | ⭐ |
| **Clickable stat cards** | Expand stat cards to show source / methodology | ⭐ |
| **Embedded video support** | Add a YouTube/Loom embed to a section | ⭐⭐ |
| **Interactive quiz at end** | Claude generates 3-5 questions testing key concepts — engagement tool | ⭐⭐ |
| **Social share buttons** | One-click share for each page of the web view | ⭐ |
| **Ebook reading time estimate** | Show "12 min read" on the cover — auto-calculated | ⭐ |

---

### 🔧 Platform / Infrastructure

| Feature | Description | Impact |
|---------|-------------|--------|
| **User accounts** | Save ebooks to the cloud, access from any device | ⭐⭐⭐ |
| **Ebook history/library** | Dashboard showing all past ebooks with thumbnails | ⭐⭐⭐ |
| **Duplicate ebook** | Clone a past ebook and regenerate with a different topic/template | ⭐⭐ |
| **Team access** | Share an ebook with collaborators for editing | ⭐⭐ |
| **Version history** | See and restore previous versions of a generated ebook | ⭐⭐ |
| **API mode** | REST API to generate ebooks programmatically — for developers | ⭐⭐ |
| **Zapier/Make integration** | Trigger ebook generation from external workflows | ⭐ |
| **Usage analytics** | Track generations, exports, template popularity | ⭐ |

---

### 🔌 Integrations

| Feature | Description | Impact |
|---------|-------------|--------|
| **Getty/Pexels/Pixabay** | Expand image sources beyond Unsplash for better coverage | ⭐⭐ |
| **Noun Project icons** | 5M+ premium icons for section headings | ⭐⭐ |
| **Notion import** | Import a Notion doc as the ebook outline/content | ⭐⭐⭐ |
| **Google Docs import** | Turn a Google Doc into a formatted ebook | ⭐⭐⭐ |
| **HubSpot/ActiveCampaign** | Connect lead capture form to email marketing | ⭐⭐ |
| **Beehiiv / ConvertKit** | One-click send ebook to your newsletter subscribers | ⭐⭐ |
| **Canva export** | Export individual pages as Canva-compatible files | ⭐ |

---

## Priority Stack (if picking the next 5 things to build)

1. **Shareable web URL** — turns PageSmith from a download tool into a publishing platform
2. **SVG data visualizations** — charts/diagrams nobody else auto-generates
3. **Drag-and-drop section reorder + per-section layout override** — closes biggest UX gap
4. **Web-grounded stats via Exa** — real citations make content credibly useful
5. **Lead capture CTA final page** — makes the ebook a growth tool, not just a document

---

*Last updated: Feb 2026*
