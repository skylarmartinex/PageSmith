# PageSmith Upgrade Plan

**Goal:** Transform PageSmith into a world-class content generation platform that produces professional ebooks, presentations, and other formats with minimal manual work.

**Positioning:** "Gamma-quality content generation, but API-first and automation-ready for agents."

> **Current Status:** ✅ Phases 1–6 Complete · 🔄 Phase 7 Next (Agent Docs)
> Last updated: Feb 24, 2026

---

## ✅ Phase 1: Research & Analysis — COMPLETE

### 1.1 Competitive Research - PRIMARY: Gamma

**Gamma.app ($10-20/month) - PRIMARY REFERENCE**
- [ ] Subscribe to Gamma (free tier or paid)
- [ ] Screenshot every template, layout variant, component style
- [ ] Document their generation flow (inputs → outputs)
- [ ] Study their smart layout system (how content type → layout)
- [ ] Analyze format variety (presentations, docs, cards, webpages)
- [ ] Test brand customization features
- [ ] Export examples in all formats
- [ ] List top 20 features to replicate

**What to study from Gamma:**
- Template quality and variety
- Multi-format approach (presentations, docs, one-pagers)
- AI generation flow and speed
- Smart layout decisions
- Interactive web output
- Brand customization
- Human editing interface (drag/drop, inline edit)

**Typeset ($39/month) - SECONDARY REFERENCE**
- [ ] Subscribe to Typeset (optional, for ebook-specific patterns)
- [ ] Focus on: long-form layouts, TOC design, academic features
- [ ] Screenshot ebook-specific components

### 1.2 Template Research
- [ ] Find 10 world-class ebook examples (PDFs, designs you admire)
- [ ] Find React PDF templates on GitHub (search: "react ebook template", "react pdf generator")
- [ ] Document Gamma's design patterns: typography, spacing, color usage, layouts
- [ ] Create mood board of target quality level (Gamma as baseline)

**Deliverable:** Gamma Competitive Analysis + Template Library

---

## ✅ Phase 2: Component Library Setup — COMPLETE

### 2.1 Install Chart Libraries
```bash
npm install recharts chart.js react-chartjs-2 d3
```

**What each does:**
- **Recharts** - Declarative React charts (easiest)
- **Chart.js** - Canvas-based charts (fast, good for exports)
- **D3.js** - Advanced custom visualizations (when you need full control)

**Implementation:**
- Replace current VizRenderer with Recharts as default
- Keep Chart.js for PDF exports (better rendering)
- D3 for custom infographics later

### 2.2 Install UI Component Libraries
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install clsx tailwind-merge
```

**For Magic UI / Aceternity UI:**
- Copy components from their sites (they're open source)
- Add to `components/ui/` folder
- Examples: animated cards, gradient borders, glassmorphism effects

### 2.3 Install Diagram Tools
```bash
npm install mermaid react-flow-renderer
npm install @excalidraw/excalidraw
```

**What each does:**
- **Mermaid** - Text → diagrams (flowcharts, timelines, Gantt charts)
- **React Flow** - Interactive node-based diagrams
- **Excalidraw** - Hand-drawn style diagrams (embeddable)

**Implementation:**
- Add diagram type options to sections
- Mermaid for quick flowcharts (AI can write the syntax)
- Excalidraw for custom illustrations (manual or later with AI)

### 2.4 Install Canvas Editor (Fabric.js)
```bash
npm install fabric
npm install @types/fabric
```

**What it gives you:**
- Full canvas control (like Gamma's editor)
- Drag/drop elements
- Resize/rotate components
- Layer management
- Precise positioning
- Object selection and manipulation

**Implementation:**
- Create CanvasEditor component
- Wrap existing templates in canvas layer
- Enable edit mode toggle (View vs Edit)
- Sync canvas changes back to data structure

**Features to build:**
- Click to select any element (text, image, chart, etc.)
- Drag to reposition
- Resize handles
- Delete/duplicate controls
- Layer ordering (bring to front/back)
- Alignment guides (snap to grid)
- Undo/redo history

### 2.5 PDF Generation Upgrade
```bash
npm install @react-pdf/renderer jspdf html2canvas
```

**Fix current PDF export:**
- Use @react-pdf/renderer for proper PDF generation
- Add page breaks, headers, footers
- Ensure images/charts render correctly

**Deliverable:** All libraries installed, basic integration tests passing

---

## ✅ Phase 3: Template System Rebuild — COMPLETE

### 3.1 Analyze React PDF Templates
- [ ] Clone 3-5 free React PDF templates from GitHub
- [ ] Extract reusable patterns (cover layouts, section structures, TOC designs)
- [ ] Adapt their best components into PageSmith template system

### 3.2 Build Professional Templates
**Target: 10 templates total**

**Must-have templates:**
1. **Minimal** (clean, lots of whitespace) - already exists, upgrade
2. **Professional** (corporate, serious) - already exists, upgrade
3. **Bold** (vibrant colors, big typography) - already exists, upgrade
4. **Tech** (startup/SaaS vibe) - already exists, upgrade
5. **Editorial** (magazine-style, multi-column)
6. **Academic** (research paper aesthetic, citations)
7. **Playful** (colorful, friendly, illustrations)
8. **Luxury** (elegant, serif fonts, premium feel)
9. **Infographic** (data-heavy, visual-first)
10. **Minimalist** (ultra-clean, Japanese aesthetic)

**Each template needs:**
- Cover design (with/without image)
- TOC layout
- 6 section layout variants
- Pull quote style
- Stat block style
- Callout box style
- Chart/diagram integration
- Footer/page number style

### 3.3 Build Template Preview Gallery
- [ ] Create template selector with live previews
- [ ] Show example pages for each template
- [ ] Allow hover to see different sections

**Deliverable:** 10 professional templates ready to use

---

## ✅ Phase 4: Generation Engine Upgrade + Smart Layout — COMPLETE

### 4.1 Multi-Step Generation Architecture

**Step 1: Outline Generation**
```typescript
POST /api/generate/outline
Input: { topic, format, sections }
Output: { 
  title, 
  subtitle,
  sections: [{ title, description, contentType }]
}
```

**Step 2: Section-by-Section Generation**
```typescript
POST /api/generate/section
Input: { 
  sectionTitle, 
  sectionDescription,
  contentType, // "process", "comparison", "stats", "concept"
  researchBrief 
}
Output: {
  content,
  pullQuote,
  stats,
  callout,
  chart/diagram (based on contentType)
}
```

**Step 3: Smart Layout Assignment (Gamma-inspired)**
```typescript
// Content type detection
type ContentType = 
  | 'concept'      // Explaining an idea
  | 'process'      // Step-by-step how-to
  | 'comparison'   // Comparing options
  | 'stats'        // Data-heavy
  | 'story'        // Narrative
  | 'benefits'     // List of features
  | 'quote'        // Key insight/quote
  | 'intro'        // Opening section
  | 'conclusion';  // Closing section

function detectContentType(section): ContentType {
  const { title, content, index, isLast } = section;
  
  // Process indicators
  if (/step|how to|guide|tutorial/i.test(title)) return 'process';
  if (/\d+\.\s/.test(content) && content.split('\n').length > 3) return 'process';
  
  // Comparison indicators
  if (/vs\.|versus|compare|difference|option/i.test(title)) return 'comparison';
  
  // Stats indicators
  if (/\d+%/.test(content) || section.stats?.length > 2) return 'stats';
  
  // Benefits indicators
  if (/benefit|advantage|why|reason/i.test(title)) return 'benefits';
  
  // Quote indicators
  if (section.pullQuote && content.split(' ').length < 100) return 'quote';
  
  // Position-based
  if (index === 0) return 'intro';
  if (isLast) return 'conclusion';
  
  return 'concept'; // default
}

// Layout rules (Gamma-style)
const LAYOUT_RULES = {
  concept: {
    layout: 'image-right',
    components: ['pullQuote', 'callout'],
    textStyle: 'balanced',
  },
  process: {
    layout: 'image-grid',
    components: ['diagram:process', 'iconGrid'],
    textStyle: 'numbered',
  },
  comparison: {
    layout: 'text-only',
    components: ['comparisonTable'],
    textStyle: 'structured',
  },
  stats: {
    layout: 'image-left',
    components: ['statBlocks', 'chart:bar'],
    textStyle: 'data-focused',
  },
  story: {
    layout: 'image-full',
    components: ['pullQuote'],
    textStyle: 'narrative',
  },
  benefits: {
    layout: 'text-only',
    components: ['iconGrid'],
    textStyle: 'bulleted',
  },
  quote: {
    layout: 'image-overlay',
    components: ['pullQuote'],
    textStyle: 'minimal',
  },
  intro: {
    layout: 'image-full',
    components: ['pullQuote'],
    textStyle: 'engaging',
  },
  conclusion: {
    layout: 'image-overlay',
    components: ['callout:insight'],
    textStyle: 'summary',
  },
};

function applySmartLayout(section) {
  const type = detectContentType(section);
  const rules = LAYOUT_RULES[type];
  
  return {
    ...section,
    layoutType: rules.layout,
    recommendedComponents: rules.components,
    textFormatting: rules.textStyle,
  };
}

// Visual balance (avoid monotony)
function balanceVisuals(sections) {
  let lastLayout = null;
  let consecutiveText = 0;
  
  return sections.map((section, i) => {
    // Avoid 3+ text-only sections in a row
    if (section.layoutType === 'text-only') {
      consecutiveText++;
      if (consecutiveText >= 3) {
        section.layoutType = 'image-right'; // Force visual break
        consecutiveText = 0;
      }
    } else {
      consecutiveText = 0;
    }
    
    // Alternate image sides for variety
    if (section.layoutType === 'image-right' && lastLayout === 'image-right') {
      section.layoutType = 'image-left';
    }
    
    lastLayout = section.layoutType;
    return section;
  });
}

// Typography scaling based on content length
function scaleTypography(section) {
  const wordCount = section.content.split(' ').length;
  
  if (wordCount < 50) {
    return { fontSize: '2xl', lineHeight: 'relaxed' };
  } else if (wordCount < 150) {
    return { fontSize: 'lg', lineHeight: 'normal' };
  } else {
    return { fontSize: 'base', lineHeight: 'snug', columns: 2 };
  }
}

// Complete smart layout pipeline
async function generateWithSmartLayout(topic, sections) {
  // 1. Generate content (AI)
  const rawSections = await generateSections(topic, sections);
  
  // 2. Detect content types
  const typed = rawSections.map(detectContentType);
  
  // 3. Apply layout rules
  const withLayouts = typed.map(applySmartLayout);
  
  // 4. Balance visuals
  const balanced = balanceVisuals(withLayouts);
  
  // 5. Scale typography
  const final = balanced.map(s => ({
    ...s,
    typography: scaleTypography(s)
  }));
  
  return final;
}
```

### 4.2 Improved Prompts
**Enforce quality rules:**
- Every section MUST have: pullQuote + 1 other element (stat/callout/chart)
- Content MUST use: intro para + 2-3 H3 subheads + bullets + conclusion
- Stats MUST be realistic and sourced
- Callouts MUST be actionable, not generic

### 4.3 Component Integration
**Update SectionRenderer to support:**
- Recharts components (bar, line, pie, donut, area)
- Mermaid diagrams (flowchart, sequence, timeline)
- Comparison tables (upgraded styling)
- Icon grids (using Lucide + custom layout)
- Process flows (numbered steps with arrows)

**Deliverable:** New generation flow that produces consistently high-quality output with smart layouts

---

## ✅ Phase 5: Canvas Editor & Polish Features — COMPLETE

**Completed Feb 24, 2026. Deliverables:**
- ✅ Fabric.js-inspired CanvasEditor (view/edit mode, drag, resize, inline text, undo/redo, zoom, object toolbar)
- ✅ Component Library Panel (8 pre-built section templates with live mini-previews)
- ✅ AI Assist Panel (7 operations: improve, expand, shorten, pull quote, callout, stats, smart layout)
- ✅ Auto-Save hook with 5s debounce + AutoSaveIndicator
- ✅ Tabbed sidebar (Edit / AI / Components) wired into editor
- ✅ `/api/magic-wand` extended for generic AI prompt passthrough

### 5.1 Fabric.js Canvas Editor (Gamma-style editing)

**Implementation:**
```typescript
// CanvasEditor component
import { fabric } from 'fabric';

function CanvasEditor({ content, onUpdate }) {
  const canvasRef = useRef<fabric.Canvas>();
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    if (editMode) {
      // Initialize Fabric.js canvas
      const canvas = new fabric.Canvas('canvas');
      
      // Convert existing elements to Fabric objects
      convertToFabricObjects(content, canvas);
      
      // Enable object controls
      canvas.on('object:modified', saveChanges);
      canvas.on('selection:created', showToolbar);
      
      canvasRef.current = canvas;
    }
  }, [editMode]);
  
  return (
    <div>
      {/* View mode: normal template rendering */}
      {!editMode && <TemplateRenderer content={content} />}
      
      {/* Edit mode: Fabric.js canvas */}
      {editMode && (
        <>
          <canvas id="canvas" />
          <EditorToolbar canvas={canvasRef.current} />
        </>
      )}
      
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Preview' : 'Edit'}
      </button>
    </div>
  );
}
```

**Features to build:**

**Basic Controls:**
- [ ] Toggle between View and Edit modes
- [ ] Click to select any element
- [ ] Drag to reposition
- [ ] Resize handles on selection
- [ ] Rotation handles
- [ ] Delete selected (Delete key or button)
- [ ] Duplicate selected (Cmd+D)

**Text Editing:**
- [ ] Double-click text → edit inline
- [ ] Rich text formatting toolbar (bold, italic, size, color)
- [ ] Font family picker
- [ ] Alignment controls

**Image Controls:**
- [ ] Swap image (reuse existing ImagePicker)
- [ ] Crop/scale
- [ ] Filters (brightness, contrast, saturation)
- [ ] Border/shadow effects

**Layout Tools:**
- [ ] Alignment guides (snap to grid)
- [ ] Distribute evenly (horizontal/vertical)
- [ ] Bring to front / Send to back
- [ ] Group/ungroup elements
- [ ] Lock/unlock elements

**Advanced:**
- [ ] Undo/redo history (Cmd+Z)
- [ ] Copy/paste (Cmd+C/V)
- [ ] Keyboard shortcuts
- [ ] Zoom in/out
- [ ] Ruler and guides

### 5.2 Component Library Panel

**Drag-and-drop component insertion:**
```typescript
function ComponentLibrary() {
  const components = [
    { type: 'text', icon: 'Type', label: 'Text Block' },
    { type: 'heading', icon: 'Heading', label: 'Heading' },
    { type: 'image', icon: 'Image', label: 'Image' },
    { type: 'stat', icon: 'BarChart', label: 'Stat Card' },
    { type: 'callout', icon: 'AlertCircle', label: 'Callout' },
    { type: 'quote', icon: 'Quote', label: 'Pull Quote' },
    { type: 'chart', icon: 'PieChart', label: 'Chart' },
    { type: 'diagram', icon: 'GitBranch', label: 'Diagram' },
    { type: 'table', icon: 'Table', label: 'Table' },
    { type: 'icon-grid', icon: 'Grid', label: 'Icon Grid' },
  ];
  
  return (
    <div className="component-library">
      {components.map(comp => (
        <DraggableComponent key={comp.type} {...comp} />
      ))}
    </div>
  );
}
```

### 5.3 Smart Features

**AI Assist in Edit Mode:**
- [ ] "Improve this text" button → Claude rewrites
- [ ] "Generate image for this section" → Imagen 3
- [ ] "Add stats about [topic]" → Research + insert
- [ ] "Suggest better layout" → Smart layout engine re-runs

**Auto-save:**
- [ ] Save changes to localStorage every 5 seconds
- [ ] Show "Saving..." indicator
- [ ] Restore on page reload

**Collaboration (future):**
- [ ] Share edit link
- [ ] Comment mode
- [ ] Version history

### 5.4 Layout Controls
- Per-section layout picker (already built, enhance UI)
- Preview mode toggle (page view vs scroll view)
- Dark mode toggle (already built)
- Template switcher (apply different template to same content)

**Deliverable:** Full Gamma-style canvas editing experience — agents generate 95%, humans polish the last 5%

---

## ✅ Phase 6: Export & Integration — COMPLETE

**Completed Feb 24, 2026. Deliverables:**
- ✅ HTML export (`lib/export/html.ts`) — self-contained, styled, print-ready, responsive
- ✅ Markdown export (`lib/export/markdown.ts`) — YAML front matter, Hugo/Jekyll/Gatsby compatible
- ✅ EPUB3 export (`/api/export/epub`) — valid spec: OPF manifest, nav.xhtml, per-chapter XHTML, embedded CSS
- ✅ Format Presets (`lib/formats/presets.ts`) — 6 presets: ebook, presentation, lead magnet, blog, social, report
- ✅ ExportHub component — unified 5-format export panel replacing scattered buttons
- ✅ FormatSelector dropdown — shows all 6 presets with section counts + export badges
- ✅ PPTX already complete (from prior work)
- ✅ Format Selector wired into editor topic input area

### 6.1 Fix PDF Export
- [ ] Replace current export with @react-pdf/renderer
- [ ] Add proper page breaks
- [ ] Ensure charts/images render
- [ ] Test print quality (300 DPI)

### 6.2 Add Export Formats
- [ ] **PPTX** (already built, verify quality)
- [ ] **EPUB** (for Kindle/iBooks)
- [ ] **HTML** (standalone webpage)
- [ ] **Markdown** (for blog posts)
- [ ] **Images** (each page as PNG/JPG)

### 6.3 Format Presets
```typescript
formats/
  ebook.ts        → Config for long-form guides
  presentation.ts → Config for slide decks
  leadmagnet.ts   → Config for checklists/cheatsheets
  blogpost.ts     → Config for SEO articles
  social.ts       → Config for social posts
  ad.ts           → Config for landing pages
```

**Each format defines:**
- Section count/types
- Required components
- Length guidelines
- Export method

**Deliverable:** Multi-format export working perfectly

---

## Phase 7: Agent Documentation (Week 6)

### 7.1 Agent Toolkit Doc
Create `AGENT-GUIDE.md`:

```markdown
# PageSmith Agent Guide

## Overview
PageSmith generates professional content across formats:
- Ebooks (5-8 sections, visual-rich)
- Presentations (10-15 slides)
- Lead magnets (checklists, templates)
- Blog posts (SEO-optimized)
- Social posts (platform-specific)

## Quick Start
1. Choose format
2. Provide topic + research brief (optional)
3. Edit outline
4. Generate
5. Export

## Component Library
Available visual elements:
- Charts: bar, line, pie, donut, area (Recharts)
- Diagrams: flowchart, timeline, process (Mermaid)
- Stats: metric cards, progress bars
- Callouts: tips, warnings, insights
- Tables: comparison, feature matrix
- Icons: 1000+ Lucide icons

## Templates
10 professional templates:
[Screenshots + descriptions]

## Example Workflows
[Step-by-step for each format]
```

### 7.2 Create Example Library
- [ ] Generate 3 example ebooks (different templates)
- [ ] Generate 2 example presentations
- [ ] Generate 2 example lead magnets
- [ ] Save as reference for agents

**Deliverable:** Complete agent documentation

---

## Timeline Summary

| Phase | Status | Key Deliverables |
|-------|--------|------------------|
| 1. Research | ✅ Done | Competitive analysis, template library |
| 2. Components | ✅ Done | Recharts, Mermaid, all libraries installed |
| 3. Templates | ✅ Done | 10 professional templates (incl. Editorial, Luxury) |
| 4. Generation | ✅ Done | Multi-step AI generation, Smart Layout Engine |
| 5. Editing | ✅ Done | Canvas editor, Component Library, AI Assist, Auto-save |
| 6. Export | ✅ Done | PDF + PPTX + EPUB + HTML + Markdown + Format Presets |
| 7. Docs | 🔄 Next | Agent guide + example library |

**Total: ~6 weeks (compressed)**

---

## Priority Order

If you want to start now and ship incrementally:

**Week 1 (MVP++ / Foundation):**
1. ✅ Study Gamma (already done - free tier)
2. Subscribe to Typeset (optional, for ebook-specific reference)
3. Install Recharts + Fabric.js
4. Fix PDF export
5. Document Gamma's best features to replicate

**Week 2 (Smart Layout + Templates):**
6. Build Smart Layout Engine (content type detection + rules)
7. Improve 3 existing templates based on Gamma's design
8. Add Mermaid diagrams
9. Improve generation prompts (enforce quality)

**Week 3 (Canvas Editor):**
10. Implement Fabric.js canvas editor
11. Build component library panel
12. Add drag/drop, resize, edit controls
13. Integrate with existing templates

**Week 4 (Quality Leap):**
14. Build 5 new templates (Editorial, Academic, Playful, Luxury, Infographic)
15. Add Radix/Magic UI components
16. Multi-format export (PPTX, EPUB, HTML, Markdown)

**Week 5 (Polish):**
17. Build format presets (ebook, presentation, lead magnet, blog post)
18. Add AI Assist features in edit mode
19. Template preview gallery
20. Auto-save and version control

**Week 6 (Agent Ready):**
21. Agent documentation (AGENT-GUIDE.md)
22. Example library (3 ebooks, 2 presentations, 2 lead magnets)
23. REST API documentation
24. Batch generation support

**Week 7 (Advanced - Optional):**
25. Excalidraw integration
26. React Flow diagrams
27. D3 custom visualizations
28. Collaboration features (comments, sharing)

---

## Key Milestones

**Milestone 1 (End of Week 2):** Smart layouts working, Gamma-quality templates
**Milestone 2 (End of Week 3):** Canvas editor functional, human editing possible
**Milestone 3 (End of Week 4):** Multi-format export, 10 professional templates
**Milestone 4 (End of Week 6):** Agent-ready with full documentation and API

---

## Next Steps

1. ✅ Study Gamma (DONE)
2. Document top 20 Gamma features to replicate
3. Begin Phase 2: Install component libraries (Recharts, Fabric.js, Mermaid)
4. Begin Phase 4: Build Smart Layout Engine
5. Test with one ebook generation to validate approach

---

*Created: Feb 24, 2026*
*Project: PageSmith*
*Location: ~/Live_OS/projects/PageSmith/UPGRADE-PLAN.md*
