import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

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
    sections: ExportSection[];
}

interface ExportColors {
    primary: string;
    accent: string;
    background: string;
    text: string;
    secondary: string;
}

function escXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function slugify(str: string): string {
    return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function markdownToXhtml(text: string): string {
    const blocks = text.split(/\n\n+/);
    return blocks
        .map((block) => {
            const trimmed = block.trim();
            if (!trimmed) return "";
            if (trimmed.startsWith("### ")) {
                return `<h3>${escXml(trimmed.slice(4))}</h3>`;
            }
            const lines = trimmed.split("\n");
            const isList = lines.every((l) => /^[-*]\s/.test(l.trim()) || !l.trim());
            if (isList) {
                const items = lines
                    .filter((l) => l.trim())
                    .map((l) =>
                        `<li>${escXml(l.replace(/^[-*]\s+/, "")).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`
                    );
                return `<ul>${items.join("")}</ul>`;
            }
            return `<p>${escXml(trimmed).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
        })
        .join("\n");
}

function buildSectionXhtml(section: ExportSection, index: number, colors: ExportColors): string {
    const img = section.images?.[0] ?? section.image ?? null;
    const imgXhtml = img
        ? `<div class="section-image"><img src="${escXml(img.url)}" alt="${escXml(img.alt)}" /></div>`
        : "";

    const pullQuoteXhtml = section.pullQuote
        ? `<blockquote class="pull-quote"><p>${escXml(section.pullQuote)}</p></blockquote>`
        : "";

    const statsXhtml =
        section.stats && section.stats.length > 0
            ? `<div class="stats">${section.stats
                .map(
                    (s) =>
                        `<div class="stat-card"><div class="stat-value">${escXml(s.value)}</div><div class="stat-label">${escXml(s.label)}</div></div>`
                )
                .join("")}</div>`
            : "";

    const calloutEmoji =
        section.callout?.type === "warning" ? "⚠️" : section.callout?.type === "insight" ? "🔑" : "💡";
    const calloutXhtml = section.callout
        ? `<div class="callout"><span>${calloutEmoji}</span><p>${escXml(section.callout.text)}</p></div>`
        : "";

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escXml(section.title)}</title>
  <link rel="stylesheet" type="text/css" href="../styles/main.css" />
</head>
<body epub:type="bodymatter chapter">
  <section>
    <p class="chapter-num">Chapter ${index + 1}</p>
    <h1>${escXml(section.title)}</h1>
    ${imgXhtml}
    <div class="body-text">${markdownToXhtml(section.content)}</div>
    ${pullQuoteXhtml}
    ${statsXhtml}
    ${calloutXhtml}
  </section>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content, colors, fontFamily }: { content: ExportContent; colors: ExportColors; fontFamily: string } = body;

        if (!content?.title || !Array.isArray(content.sections)) {
            return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        }

        const zip = new JSZip();
        const bookId = `pagesmith-${Date.now()}`;
        const now = new Date().toISOString().split("T")[0];
        const titleSlug = slugify(content.title);

        // ── mimetype (must be first, uncompressed) ────────────────────────────
        zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

        // ── META-INF/container.xml ────────────────────────────────────────────
        zip.folder("META-INF")!.file(
            "container.xml",
            `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>`
        );

        const epub = zip.folder("EPUB")!;

        // ── CSS ───────────────────────────────────────────────────────────────
        epub.folder("styles")!.file(
            "main.css",
            `
body { font-family: Georgia, 'Times New Roman', serif; font-size: 1em; line-height: 1.75; margin: 0 auto; max-width: 38em; padding: 1.5em; color: #222; }
h1 { font-size: 1.8em; color: ${colors.primary}; margin-bottom: 0.6em; line-height: 1.2; }
h3 { font-size: 1.15em; color: ${colors.primary}; margin: 1.2em 0 0.4em; }
p { margin: 0 0 1em; }
ul { margin: 0.5em 0 1em 1.5em; }
li { margin-bottom: 0.3em; }
img { max-width: 100%; height: auto; border-radius: 8px; }
.chapter-num { font-size: 0.7em; text-transform: uppercase; letter-spacing: 0.15em; color: ${colors.accent}; margin-bottom: 0.3em; }
.pull-quote { border-left: 4px solid ${colors.accent}; margin: 1.5em 0; padding: 0.3em 0 0.3em 1.2em; font-style: italic; font-size: 1.15em; color: ${colors.primary}; }
.stats { display: flex; gap: 0.8em; margin: 1.2em 0; flex-wrap: wrap; }
.stat-card { flex: 1; min-width: 100px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.8em; text-align: center; }
.stat-value { font-size: 1.6em; font-weight: 900; color: ${colors.primary}; }
.stat-label { font-size: 0.7em; text-transform: uppercase; letter-spacing: 0.08em; color: ${colors.secondary}; }
.callout { display: flex; gap: 0.8em; padding: 0.8em 1em; border-radius: 8px; background: #f0f9ff; border-left: 3px solid ${colors.accent}; margin: 1.2em 0; }
.callout p { margin: 0; font-size: 0.92em; }
`
        );

        // ── Section XHTML files ────────────────────────────────────────────────
        const sectionFolder = epub.folder("content")!;
        content.sections.forEach((section, i) => {
            sectionFolder.file(
                `section-${i}.xhtml`,
                buildSectionXhtml(section, i, colors)
            );
        });

        // ── Cover page ────────────────────────────────────────────────────────
        const coverXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escXml(content.title)}</title>
  <link rel="stylesheet" type="text/css" href="../styles/main.css" />
</head>
<body epub:type="frontmatter cover">
  <section epub:type="cover" style="text-align:center;padding:3em 1em;background:${colors.primary};color:white;min-height:80vh;display:flex;flex-direction:column;justify-content:center;">
    <h1 style="color:white;font-size:2em;">${escXml(content.title)}</h1>
    ${content.subtitle ? `<p style="color:rgba(255,255,255,0.85);font-style:italic;font-size:1.2em;">${escXml(content.subtitle)}</p>` : ""}
    ${content.author ? `<p style="color:rgba(255,255,255,0.7);margin-top:2em;">By ${escXml(content.author)}</p>` : ""}
  </section>
</body>
</html>`;
        epub.folder("content")!.file("cover.xhtml", coverXhtml);

        // ── TOC XHTML (epub:type="toc") ────────────────────────────────────────
        const tocNav = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head><meta charset="UTF-8" /><title>Table of Contents</title></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Contents</h1>
    <ol>
      <li><a href="content/cover.xhtml">Cover</a></li>
      ${content.sections.map((s, i) => `<li><a href="content/section-${i}.xhtml">${escXml(s.title)}</a></li>`).join("\n      ")}
    </ol>
  </nav>
</body>
</html>`;
        epub.file("nav.xhtml", tocNav);

        // ── OPF Package document ───────────────────────────────────────────────
        const manifest = [
            `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
            `<item id="css" href="styles/main.css" media-type="text/css"/>`,
            `<item id="cover-page" href="content/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/>`,
            ...content.sections.map(
                (_, i) =>
                    `<item id="section-${i}" href="content/section-${i}.xhtml" media-type="application/xhtml+xml"/>`
            ),
        ].join("\n    ");

        const spine = [
            `<itemref idref="cover-page"/>`,
            ...content.sections.map((_, i) => `<itemref idref="section-${i}"/>`),
        ].join("\n    ");

        const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">${bookId}</dc:identifier>
    <dc:title>${escXml(content.title)}</dc:title>
    ${content.subtitle ? `<dc:description>${escXml(content.subtitle)}</dc:description>` : ""}
    ${content.author ? `<dc:creator>${escXml(content.author)}</dc:creator>` : ""}
    <dc:language>en</dc:language>
    <dc:date>${now}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    ${manifest}
  </manifest>
  <spine>
    ${spine}
  </spine>
</package>`;
        epub.file("content.opf", opf);

        // ── Generate zip buffer ───────────────────────────────────────────────
        const buffer = await zip.generateAsync({
            type: "nodebuffer",
            mimeType: "application/epub+zip",
            compression: "DEFLATE",
            compressionOptions: { level: 9 },
        });

        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                "Content-Type": "application/epub+zip",
                "Content-Disposition": `attachment; filename="${titleSlug}.epub"`,
            },
        });
    } catch (error) {
        console.error("EPUB export error:", error);
        return NextResponse.json({ error: "Failed to generate EPUB" }, { status: 500 });
    }
}
