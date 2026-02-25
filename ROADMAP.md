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
- **Web-grounded stats via Exa** — real cited statistics injected into Claude's prompt
- **Brand voice matching** — paste sample text → Claude matches tone throughout
- **Persona targeting** — "Write for a CFO/founder/marketer" → Claude adapts vocabulary and depth
- **SVG bar/line/pie/donut/progress charts** — AI-generated data rendered as crisp SVG
- **Process flow diagrams** — numbered steps with arrows as styled SVG
- **Timeline components** — milestone timelines with dates and descriptions
- **Comparison tables** — feature matrix with brand colors, ✓/✗ cells, recommended column badge
- **Icon + text grids** — 2/3/4 col Lucide icon + title + description cards
- **Chapter opener spreads** — full-bleed section dividers with chapter number, title, dot pattern
- **Shareable web URL** — live webpage at `/share/[id]` with reading progress bar, sticky ToC, scroll animations
- **Lead capture CTA final page** — branded email opt-in on every shared ebook
- **Section drag-and-drop reorder** — drag handles in sidebar to reorder sections
- **Per-section layout override** — click badge → pick from 6 layouts per section
- **Inline image swap** — hover any image → "🔄 Swap image" → Unsplash OR Imagen 3 AI Generate
- **Custom hex color picker** — type exact hex codes alongside color swatches
- **Font pairing suggestions** — "✨ AI Font" button picks best Google Font pair for the topic
- **Dark mode preview toggle** — 🌙 button applies CSS invert filter across all templates
- **Imagen 3 (Nano Banana) hybrid integration** — dual-tab ImagePicker (Unsplash + AI Generate), AI Infographic toggle per chart/diagram section
- **Brand preset save/load** — named presets persist in localStorage

---

## 🗺️ Full Feature Roadmap

### 🧠 AI Intelligence

| Feature | Description | Impact |
|---------|-------------|--------|
| ~~**Web-grounded stats**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Brand voice matching**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Persona targeting**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| **Competitive angle mode** | "Position me as the expert vs [competitor]" — Claude writes to differentiate the author | ⭐⭐ |
| **Research brief mode** | User uploads a PDF/doc, Claude uses it as source material for the ebook | ⭐⭐⭐ |
| **Auto-longer content** | Option for 500-800 word sections with proper structure (H3, lists, transitions) | ⭐⭐ |
| **FAQ section generation** | Claude generates a real FAQ page as the final section based on the full content | ⭐ |
| **Executive summary page** | AI-written 1-page summary / TL;DR after the ToC | ⭐⭐ |
| **Content gap analysis** | After generating, Claude reviews what's missing and suggests 2-3 additional sections | ⭐⭐ |

---

### 📊 Visual Components (No Tool Does These)

| Feature | Description | Impact |
|---------|-------------|--------|
| ~~**SVG bar/line/pie charts**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Process flow diagrams**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Timeline components**~~ | ✅ Shipped | ~~⭐⭐~~ |
| ~~**Comparison table**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Icon + text grids**~~ | ✅ Shipped | ~~⭐⭐~~ |
| ~~**Chapter opener spreads**~~ | ✅ Shipped | ~~⭐⭐~~ |
| ~~**AI-generated image alt (Imagen 3)**~~ | ✅ Shipped — dual-tab ImagePicker + AI Infographic toggle | ~~⭐⭐~~ |
| ~~**Progress/percentage bars**~~ | ✅ Shipped (progress chart type) | ~~⭐~~ |
| **Excalidraw-style infographics** | AI → Excalidraw JSON → embedded editor → export PNG/SVG to ebook | ⭐⭐⭐ |
| **Quote cards** | Full-page or half-page stylized expert quotes with author attribution | ⭐⭐ |
| **Side-by-side quote vs stat** | Layout: pull quote on left, big stat on right with divider | ⭐ |

---

### 🌐 Publishing & Output

| Feature | Description | Impact |
|---------|-------------|--------|
| ~~**Shareable web URL**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Lead capture CTA page**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Dark mode ebook**~~ | ✅ Shipped (preview toggle) | ~~⭐⭐~~ |
| **Interactive flipbook mode** | Page-turning HTML flipbook export you can embed anywhere | ⭐⭐⭐ |
| **EPUB export** | Standard ebook format for Kindle / Apple Books / iBooks | ⭐⭐ |
| **HTML embed export** | Drop the ebook as an `<iframe>` on any website | ⭐⭐ |
| **Gated download** | Share a link, reader enters email → gets ebook — all handled by PageSmith | ⭐⭐⭐ |
| **Print-ready PDF** | Bleed marks, CMYK export option for professional printing | ⭐ |

---

### 🎨 Design & Editing

| Feature | Description | Impact |
|---------|-------------|--------|
| ~~**Section drag-and-drop reorder**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Per-section layout override**~~ | ✅ Shipped | ~~⭐⭐⭐~~ |
| ~~**Inline image swap**~~ | ✅ Shipped (Unsplash + Imagen 3) | ~~⭐⭐~~ |
| ~~**Custom color picker**~~ | ✅ Shipped (hex inputs) | ~~⭐⭐~~ |
| ~~**Brand preset save/load**~~ | ✅ Shipped | ~~⭐⭐~~ |
| ~~**Font pairing suggestions**~~ | ✅ Shipped (AI-powered) | ~~⭐⭐~~ |
| **Logo background removal** | Auto-remove background from uploaded logo | ⭐ |
| **Margin/spacing controls** | Adjust section padding globally or per-section in the editor | ⭐ |
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

## Priority Stack (Next 5 to build)

1. **Scroll-triggered animations on share page** — stat counters, fade-ins (high visual impact, web-native)
2. **Gated download** — email → ebook funnel (turns every share into a lead gen machine)
3. **Research brief mode** — upload PDF → Claude uses it as source material
4. **Excalidraw-style infographics** — AI → hand-drawn visual → export to ebook
5. **User accounts + ebook library** — cloud save, history dashboard

---

*Last updated: Feb 24, 2026*
