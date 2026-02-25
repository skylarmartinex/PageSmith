import { EbookSection, SectionLayout } from "./types";

// ─── Content type taxonomy ────────────────────────────────────────────────
export type ContentType =
    | "concept"    // Explaining an idea
    | "process"    // Step-by-step how-to
    | "comparison" // Comparing options
    | "stats"      // Data-heavy
    | "story"      // Narrative
    | "benefits"   // List of features/advantages
    | "quote"      // Key insight/quote-centric
    | "intro"      // Opening section
    | "conclusion";// Closing section

// ─── Layout rules (Gamma-inspired) ────────────────────────────────────────
interface LayoutRule {
    layout: SectionLayout;
    preferredComponents: string[];
    textStyle: "balanced" | "numbered" | "structured" | "data-focused" | "narrative" | "bulleted" | "minimal" | "engaging" | "summary";
}

const LAYOUT_RULES: Record<ContentType, LayoutRule> = {
    concept: {
        layout: "image-right",
        preferredComponents: ["pullQuote", "callout"],
        textStyle: "balanced",
    },
    process: {
        layout: "image-grid",
        preferredComponents: ["diagram:process", "iconGrid"],
        textStyle: "numbered",
    },
    comparison: {
        layout: "text-only",
        preferredComponents: ["comparisonTable"],
        textStyle: "structured",
    },
    stats: {
        layout: "image-left",
        preferredComponents: ["statBlocks", "chart:bar"],
        textStyle: "data-focused",
    },
    story: {
        layout: "image-full",
        preferredComponents: ["pullQuote"],
        textStyle: "narrative",
    },
    benefits: {
        layout: "text-only",
        preferredComponents: ["iconGrid"],
        textStyle: "bulleted",
    },
    quote: {
        layout: "image-overlay",
        preferredComponents: ["pullQuote"],
        textStyle: "minimal",
    },
    intro: {
        layout: "image-full",
        preferredComponents: ["pullQuote"],
        textStyle: "engaging",
    },
    conclusion: {
        layout: "image-overlay",
        preferredComponents: ["callout:insight"],
        textStyle: "summary",
    },
};

// ─── Content type detection ────────────────────────────────────────────────
export function detectContentType(
    section: EbookSection,
    index: number,
    totalSections: number
): ContentType {
    const { title, content, stats, pullQuote } = section;
    const combined = `${title} ${content}`.toLowerCase();

    // Position-based (highest priority)
    if (index === 0) return "intro";
    if (index === totalSections - 1) return "conclusion";

    // Process indicators
    if (/\bstep\b|how to|guide|tutorial|phase|stage|workflow|implement|install|setup|configure/i.test(title)) return "process";
    if (/\d+\.\s/.test(content) && content.split("\n").filter(l => /^\d+\./.test(l.trim())).length >= 3) return "process";

    // Comparison indicators
    if (/\bvs\b|versus|compar|difference|choice|option|alternative|between|which/i.test(title)) return "comparison";
    if (section.comparisonTable) return "comparison";

    // Stats-heavy
    if ((stats && stats.length >= 2) || /\d+%/.test(content)) return "stats";
    if (section.chart) return "stats";

    // Benefits / list of features
    if (/\bbenefit|advantage|why use|reason|pros|feature|value|gain/i.test(title)) return "benefits";
    if (section.iconGrid) return "benefits";

    // Quote / insight-centric
    if (pullQuote && content.split(" ").length < 120) return "quote";

    // Story / narrative
    if (/\bstory|journey|case study|example|experience|real-world|discover/i.test(combined)) return "story";

    // Default
    return "concept";
}

// ─── Apply smart layout to a single section ───────────────────────────────
function applySmartLayout(
    section: EbookSection,
    index: number,
    total: number
): EbookSection {
    // If the section already has images AND a layoutType set by AI, respect it.
    // Only override if we have no image (no point in an image layout without one)
    // or if layoutType wasn't set.
    const hasImages = (section.images && section.images.length > 0) || !!section.image;
    const aiLayout = section.layoutType;

    const type = detectContentType(section, index, total);
    const rule = LAYOUT_RULES[type];

    let proposedLayout: SectionLayout = rule.layout;

    // If proposed layout needs images but section has none → fall back to text-only
    if (!hasImages && proposedLayout !== "text-only") {
        proposedLayout = "text-only";
    }

    // If AI set a layout and images exist, keep AI's choice (it already knows the content)
    const finalLayout: SectionLayout =
        aiLayout && hasImages ? aiLayout : proposedLayout;

    return {
        ...section,
        layoutType: finalLayout,
    };
}

// ─── Visual balance pass ───────────────────────────────────────────────────
// Prevents monotony: avoids 3+ text-only sections in a row,
// alternates image-right / image-left for variety.
function balanceVisuals(sections: EbookSection[]): EbookSection[] {
    let consecutiveTextOnly = 0;
    let lastImageLayout: SectionLayout | null = null;

    return sections.map((section, i) => {
        const layout = section.layoutType ?? "text-only";
        const hasImages =
            (section.images && section.images.length > 0) || !!section.image;

        if (layout === "text-only") {
            consecutiveTextOnly++;
            // After 2 consecutive text-only sections, force a visual if we have images
            if (consecutiveTextOnly >= 3 && hasImages) {
                consecutiveTextOnly = 0;
                return { ...section, layoutType: "image-right" };
            }
        } else {
            consecutiveTextOnly = 0;

            // Alternate image-right / image-left to avoid same-side monotony
            if (layout === "image-right" && lastImageLayout === "image-right") {
                lastImageLayout = "image-left";
                return { ...section, layoutType: "image-left" };
            }
            if (layout === "image-left" && lastImageLayout === "image-left") {
                lastImageLayout = "image-right";
                return { ...section, layoutType: "image-right" };
            }

            lastImageLayout = layout;
        }

        return section;
    });
}

// ─── Typography scaling ───────────────────────────────────────────────────
export interface TypographyHint {
    textSize: "xl" | "lg" | "base";
    lineHeight: "relaxed" | "normal" | "snug";
    columns: 1 | 2;
}

export function scaleTypography(section: EbookSection): TypographyHint {
    const wordCount = section.content.split(" ").length;

    if (wordCount < 60) {
        return { textSize: "xl", lineHeight: "relaxed", columns: 1 };
    } else if (wordCount < 160) {
        return { textSize: "lg", lineHeight: "normal", columns: 1 };
    } else {
        return { textSize: "base", lineHeight: "snug", columns: 1 };
    }
}

// ─── Master pipeline function ─────────────────────────────────────────────
/**
 * Run the complete Smart Layout pipeline over an array of EbookSections.
 * Call this AFTER AI generation and BEFORE rendering.
 */
export function applySmartLayoutPipeline(sections: EbookSection[]): EbookSection[] {
    const total = sections.length;

    // 1. Detect + apply layout per section
    const withLayouts = sections.map((s, i) => applySmartLayout(s, i, total));

    // 2. Balance visuals (prevent monotony)
    const balanced = balanceVisuals(withLayouts);

    return balanced;
}
