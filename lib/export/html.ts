/**
 * HTML Export — generates a fully standalone, styled HTML file
 * that works offline without any CDN dependencies.
 */

interface ExportSection {
    title: string;
    content: string;
    pullQuote?: string;
    stats?: { label: string; value: string }[];
    callout?: { type: string; text: string };
    image?: { url: string; alt: string; attribution?: string };
    images?: { url: string; alt: string; attribution?: string }[];
}

interface ExportContent {
    title: string;
    subtitle?: string;
    author?: string;
    coverImage?: { url: string; alt: string };
    sections: ExportSection[];
}

interface ExportColors {
    primary: string;
    accent: string;
    background: string;
    text: string;
    secondary: string;
}

function escHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** Convert simple markdown (### h3, - bullets, **bold**) to HTML */
function markdownToHtml(text: string): string {
    const blocks = text.split(/\n\n+/);
    return blocks
        .map((block) => {
            const trimmed = block.trim();
            if (!trimmed) return "";
            if (trimmed.startsWith("### ")) {
                return `<h3>${escHtml(trimmed.slice(4))}</h3>`;
            }
            const lines = trimmed.split("\n");
            const isList = lines.every((l) => /^[-*]\s/.test(l.trim()) || !l.trim());
            if (isList) {
                const items = lines.filter((l) => l.trim()).map((l) =>
                    `<li>${escHtml(l.replace(/^[-*]\s+/, "")).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`
                );
                return `<ul>${items.join("")}</ul>`;
            }
            const html = escHtml(trimmed).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
            return `<p>${html}</p>`;
        })
        .join("\n");
}

export function generateHTML(
    content: ExportContent,
    colors: ExportColors,
    fontFamily: string
): string {
    const safeFont = fontFamily.includes(",") ? fontFamily : `'${fontFamily}', Georgia, serif`;

    const tocItems = content.sections
        .map(
            (s, i) =>
                `<li><a href="#section-${i}">${escHtml(s.title)}</a></li>`
        )
        .join("");

    const sectionHtml = content.sections
        .map((section, i) => {
            const img =
                section.images?.[0] ?? section.image ?? null;
            const imgHtml = img
                ? `<div class="section-image">
            <img src="${escHtml(img.url)}" alt="${escHtml(img.alt)}" />
            ${img.attribution ? `<p class="attribution">${escHtml(img.attribution)}</p>` : ""}
           </div>`
                : "";

            const statsHtml =
                section.stats && section.stats.length > 0
                    ? `<div class="stats">
              ${section.stats
                        .map(
                            (s) =>
                                `<div class="stat-card"><div class="stat-value">${escHtml(s.value)}</div><div class="stat-label">${escHtml(s.label)}</div></div>`
                        )
                        .join("")}
             </div>`
                    : "";

            const pullQuoteHtml = section.pullQuote
                ? `<blockquote class="pull-quote">${escHtml(section.pullQuote)}</blockquote>`
                : "";

            const calloutEmoji =
                section.callout?.type === "warning"
                    ? "⚠️"
                    : section.callout?.type === "insight"
                        ? "🔑"
                        : "💡";
            const calloutHtml = section.callout
                ? `<div class="callout callout-${section.callout.type}">
             <span class="callout-icon">${calloutEmoji}</span>
             <p>${escHtml(section.callout.text)}</p>
           </div>`
                : "";

            return `
<section id="section-${i}" class="section">
  <div class="section-number">0${i + 1}</div>
  <h2>${escHtml(section.title)}</h2>
  ${imgHtml}
  <div class="body-text">${markdownToHtml(section.content)}</div>
  ${pullQuoteHtml}
  ${statsHtml}
  ${calloutHtml}
</section>`;
        })
        .join("\n");

    const coverBg = content.coverImage
        ? `background-image: linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.primary}99 100%), url('${content.coverImage.url}'); background-size: cover; background-position: center;`
        : `background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(content.title)}</title>
  <meta name="description" content="${escHtml(content.subtitle || content.title)}" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: ${colors.primary};
      --accent: ${colors.accent};
      --bg: ${colors.background};
      --text: ${colors.text};
      --secondary: ${colors.secondary};
    }
    body {
      font-family: ${safeFont};
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      font-size: 17px;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── Cover ── */
    .cover {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px 10%;
      ${coverBg}
      color: white;
    }
    .cover h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 1rem;
    }
    .cover .subtitle {
      font-size: 1.25rem;
      opacity: 0.85;
      font-style: italic;
      margin-bottom: 0.75rem;
    }
    .cover .author {
      font-size: 1rem;
      opacity: 0.7;
      margin-top: 1.5rem;
    }

    /* ── TOC ── */
    .toc {
      max-width: 720px;
      margin: 60px auto;
      padding: 0 24px;
    }
    .toc h2 {
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--secondary);
      margin-bottom: 1.5rem;
    }
    .toc ol { padding-left: 1.5rem; }
    .toc li { margin-bottom: 0.5rem; font-size: 1rem; }

    /* ── Section ── */
    .section {
      max-width: 760px;
      margin: 0 auto 80px;
      padding: 0 24px;
    }
    .section-number {
      font-size: 0.65rem;
      font-weight: 900;
      letter-spacing: 0.2em;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    h2 {
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800;
      color: var(--primary);
      line-height: 1.25;
      margin-bottom: 1.5rem;
    }
    .body-text h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary);
      margin: 1.5rem 0 0.5rem;
    }
    .body-text p { margin-bottom: 1rem; }
    .body-text ul { margin: 0.75rem 0 1rem 1.5rem; }
    .body-text li { margin-bottom: 0.4rem; }

    /* ── Section image ── */
    .section-image { margin: 1.5rem 0; }
    .section-image img {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: 12px;
    }
    .attribution { font-size: 0.7rem; color: var(--secondary); margin-top: 0.4rem; }

    /* ── Pull quote ── */
    .pull-quote {
      border-left: 4px solid var(--accent);
      padding: 0.5rem 0 0.5rem 1.25rem;
      margin: 2rem 0;
      font-size: 1.2rem;
      font-style: italic;
      color: var(--primary);
      line-height: 1.5;
    }
    .pull-quote::before { content: open-quote; }
    .pull-quote::after { content: close-quote; }

    /* ── Stats ── */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .stat-card {
      background: color-mix(in srgb, var(--primary) 8%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 900;
      color: var(--primary);
    }
    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--secondary);
      margin-top: 0.25rem;
    }

    /* ── Callout ── */
    .callout {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      margin: 1.5rem 0;
      border-left: 4px solid var(--accent);
      background: color-mix(in srgb, var(--accent) 8%, transparent);
    }
    .callout p { font-size: 0.95rem; line-height: 1.6; }
    .callout-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.1rem; }

    /* ── Footer ── */
    footer {
      text-align: center;
      padding: 60px 24px;
      font-size: 0.85rem;
      color: var(--secondary);
      border-top: 1px solid color-mix(in srgb, var(--primary) 12%, transparent);
      margin-top: 60px;
    }

    @media (max-width: 640px) {
      .cover { padding: 60px 6%; }
      .section { padding: 0 16px; }
    }

    @media print {
      .cover { min-height: auto; padding: 40px 10%; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Cover -->
  <div class="cover">
    <h1>${escHtml(content.title)}</h1>
    ${content.subtitle ? `<p class="subtitle">${escHtml(content.subtitle)}</p>` : ""}
    ${content.author ? `<p class="author">By ${escHtml(content.author)}</p>` : ""}
  </div>

  <!-- Table of Contents -->
  <nav class="toc" aria-label="Table of Contents">
    <h2>Contents</h2>
    <ol>${tocItems}</ol>
  </nav>

  <!-- Sections -->
  <main>${sectionHtml}</main>

  <!-- Footer -->
  <footer>
    <p>${escHtml(content.title)}${content.author ? ` · By ${escHtml(content.author)}` : ""}</p>
    <p style="margin-top:0.4rem; opacity:0.6;">Generated with PageSmith · ${new Date().getFullYear()}</p>
  </footer>
</body>
</html>`;
}

/** Trigger client-side download of an HTML string */
export function downloadHTML(content: ExportContent, colors: ExportColors, fontFamily: string, filename?: string): void {
    const html = generateHTML(content, colors, fontFamily);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
