"use client";

interface EbookSection {
    title: string;
    content: string;
    image?: {
        url: string;
        thumb: string;
        alt: string;
        attribution: string;
    };
}

interface EbookContent {
    title: string;
    subtitle?: string;
    author?: string;
    sections: EbookSection[];
}

interface TemplateColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

// Convert hex to RGB array
function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r || 0, g || 0, b || 0];
}

function hexNoHash(hex: string): string {
    return (hex || "#000000").replace("#", "");
}

export async function exportToPPTX(
    content: EbookContent,
    colors: TemplateColors,
    fontFamily: string,
    logoUrl?: string
) {
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();

    pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches

    const primary = hexNoHash(colors.primary);
    const accent = hexNoHash(colors.accent);
    const bgColor = hexNoHash(colors.background);
    const textColor = hexNoHash(colors.text);
    const white = "FFFFFF";

    // ── Cover Slide ──────────────────────────────────────────────────────────
    const cover = pptx.addSlide();
    cover.background = { color: primary };

    // Accent bar at bottom
    cover.addShape(pptx.ShapeType.rect, {
        x: 0, y: 6.5, w: "100%", h: 1,
        fill: { color: accent },
    });

    // Logo
    if (logoUrl && logoUrl.startsWith("data:image")) {
        try {
            cover.addImage({ data: logoUrl, x: 0.5, y: 0.4, w: 1.5, h: 0.6, sizing: { type: "contain", w: 1.5, h: 0.6 } });
        } catch { }
    }

    // Title
    cover.addText(content.title, {
        x: 0.5, y: 1.5, w: 12.3, h: 2.5,
        fontSize: 44, bold: true, color: white,
        fontFace: "Arial",
        wrap: true,
        valign: "middle",
    });

    // Subtitle
    if (content.subtitle) {
        cover.addText(content.subtitle, {
            x: 0.5, y: 4.1, w: 12.3, h: 0.6,
            fontSize: 20, color: white, italic: true,
            fontFace: "Arial", transparency: 20,
        });
    }

    // Author
    if (content.author) {
        cover.addText(`by ${content.author}`, {
            x: 0.5, y: 6.6, w: 6, h: 0.7,
            fontSize: 16, color: white, fontFace: "Arial",
        });
    }

    // ── Section Slides ────────────────────────────────────────────────────────
    content.sections.forEach((section, i) => {
        const slide = pptx.addSlide();
        slide.background = { color: bgColor || "FFFFFF" };

        // Accent sidebar strip
        slide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 0, w: 0.12, h: "100%",
            fill: { color: primary },
        });

        // Section number chip
        slide.addShape(pptx.ShapeType.rect, {
            x: 0.25, y: 0.3, w: 0.55, h: 0.35,
            fill: { color: accent },
            line: { color: accent },
        });
        slide.addText(String(i + 1).padStart(2, "0"), {
            x: 0.25, y: 0.3, w: 0.55, h: 0.35,
            fontSize: 11, bold: true, color: white,
            fontFace: "Arial", align: "center", valign: "middle",
        });

        // Section title
        slide.addText(section.title, {
            x: 0.95, y: 0.25, w: 11.8, h: 0.8,
            fontSize: 28, bold: true, color: primary,
            fontFace: "Arial", wrap: true,
        });

        // Divider line
        slide.addShape(pptx.ShapeType.line, {
            x: 0.95, y: 1.1, w: 11.8, h: 0,
            line: { color: accent, width: 2 },
        });

        // Image (right column) if available
        const hasImage = !!section.image?.url;
        const contentWidth = hasImage ? 7.5 : 12;
        const contentX = 0.95;

        if (hasImage) {
            try {
                slide.addImage({
                    path: section.image!.url,
                    x: 8.8, y: 1.3, w: 4, h: 5.2,
                    sizing: { type: "cover", w: 4, h: 5.2 },
                    rounding: true,
                });
            } catch { }
        }

        // Body text — truncate to ~600 chars to keep slide readable
        const body = section.content.slice(0, 650) + (section.content.length > 650 ? "…" : "");
        slide.addText(body, {
            x: contentX, y: 1.3, w: contentWidth, h: 5.5,
            fontSize: 14, color: textColor || "333333",
            fontFace: "Arial", wrap: true, valign: "top",
            lineSpacingMultiple: 1.3,
        });

        // Slide number footer
        slide.addText(`${i + 1} / ${content.sections.length}`, {
            x: 12, y: 7.1, w: 1.2, h: 0.3,
            fontSize: 9, color: "999999", align: "right",
        });
    });

    // ── Thank You Slide ───────────────────────────────────────────────────────
    const end = pptx.addSlide();
    end.background = { color: accent };
    end.addText("Thank You", {
        x: 0.5, y: 2.5, w: 12.3, h: 2,
        fontSize: 54, bold: true, color: white,
        fontFace: "Arial", align: "center",
    });
    if (content.author) {
        end.addText(content.author, {
            x: 0.5, y: 4.5, w: 12.3, h: 0.6,
            fontSize: 18, color: white, align: "center", fontFace: "Arial",
        });
    }

    // Download
    const filename = `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}.pptx`;
    await pptx.writeFile({ fileName: filename });
}
