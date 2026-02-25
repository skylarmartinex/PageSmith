/**
 * Markdown Export — generates a clean, blog-ready Markdown file with
 * front matter (compatible with Hugo, Jekyll, Gatsby, Contentful, Notion).
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
    sections: ExportSection[];
}

/** Remove markdown-in-markdown doubling, keep plain text clean */
function stripMarkdownSyntax(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, "$1") // **bold** → plain (re-written below)
        .trim();
}

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export function generateMarkdown(content: ExportContent): string {
    const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const slug = slugify(content.title);

    const lines: string[] = [];

    // ── YAML Front Matter ─────────────────────────────────────────────────────
    lines.push("---");
    lines.push(`title: "${content.title.replace(/"/g, '\\"')}"`);
    if (content.subtitle) lines.push(`description: "${content.subtitle.replace(/"/g, '\\"')}"`);
    if (content.author) lines.push(`author: "${content.author.replace(/"/g, '\\"')}"`);
    lines.push(`date: "${now}"`);
    lines.push(`slug: "${slug}"`);
    lines.push(`tags: []`);
    lines.push(`draft: false`);
    lines.push("---");
    lines.push("");

    // ── Cover heading ─────────────────────────────────────────────────────────
    lines.push(`# ${content.title}`);
    lines.push("");
    if (content.subtitle) {
        lines.push(`*${content.subtitle}*`);
        lines.push("");
    }
    if (content.author) {
        lines.push(`**By ${content.author}**`);
        lines.push("");
    }
    lines.push("---");
    lines.push("");

    // ── Table of Contents ─────────────────────────────────────────────────────
    lines.push("## Table of Contents");
    lines.push("");
    content.sections.forEach((section, i) => {
        const anchor = slugify(section.title);
        lines.push(`${i + 1}. [${section.title}](#${anchor})`);
    });
    lines.push("");
    lines.push("---");
    lines.push("");

    // ── Sections ──────────────────────────────────────────────────────────────
    content.sections.forEach((section, i) => {
        const anchor = slugify(section.title);

        // Section heading with anchor
        lines.push(`## ${section.title} {#${anchor}}`);
        lines.push("");

        // Section image
        const img = section.images?.[0] ?? section.image ?? null;
        if (img) {
            lines.push(`![${img.alt}](${img.url})`);
            if (img.attribution) lines.push(`*${img.attribution}*`);
            lines.push("");
        }

        // Content — already has ### h3, - bullets, **bold** — pass straight through
        lines.push(section.content.trim());
        lines.push("");

        // Pull quote → markdown blockquote
        if (section.pullQuote) {
            lines.push(`> **${section.pullQuote}**`);
            lines.push("");
        }

        // Stats → table
        if (section.stats && section.stats.length > 0) {
            lines.push("| Metric | Value |");
            lines.push("|--------|-------|");
            section.stats.forEach((stat) => {
                lines.push(`| ${stat.label} | **${stat.value}** |`);
            });
            lines.push("");
        }

        // Callout → markdown blockquote with emoji
        if (section.callout) {
            const emoji =
                section.callout.type === "warning"
                    ? "⚠️"
                    : section.callout.type === "insight"
                        ? "🔑"
                        : "💡";
            lines.push(`> ${emoji} **${section.callout.type === "warning" ? "Watch Out" : section.callout.type === "insight" ? "Key Insight" : "Pro Tip"}:** ${section.callout.text}`);
            lines.push("");
        }

        // Divider between sections (not after last)
        if (i < content.sections.length - 1) {
            lines.push("---");
            lines.push("");
        }
    });

    // ── Footer ────────────────────────────────────────────────────────────────
    lines.push("---");
    lines.push("");
    lines.push(`*Generated with [PageSmith](https://pagesmith.app) on ${now}*`);
    lines.push("");

    return lines.join("\n");
}

/** Trigger client-side download of a Markdown file */
export function downloadMarkdown(content: ExportContent, filename?: string): void {
    const md = generateMarkdown(content);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
