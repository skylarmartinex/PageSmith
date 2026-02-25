/**
 * Format Presets — define the generation config for each content type.
 * Each preset controls: section count, required components, length guidelines,
 * preferred export format, and UI labels.
 */

export interface FormatPreset {
    id: string;
    label: string;
    description: string;
    icon: string;
    /** Target section count */
    sections: number;
    /** Sections that must exist by position */
    requiredSectionTypes: string[];
    /** Word count guidance per section */
    wordCountRange: [number, number];
    /** Preferred export formats for this type */
    exportFormats: ("pdf" | "pptx" | "html" | "markdown" | "epub")[];
    /** Primary / recommended export */
    primaryExport: "pdf" | "pptx" | "html" | "markdown" | "epub";
    /** Extra prompt instructions for the AI */
    promptGuidance: string;
    /** Recommended template IDs */
    recommendedTemplates: string[];
}

export const FORMAT_PRESETS: Record<string, FormatPreset> = {
    ebook: {
        id: "ebook",
        label: "Ebook / Long-form Guide",
        description: "Comprehensive 6–8 section guide with visuals, stats, and charts",
        icon: "📘",
        sections: 7,
        requiredSectionTypes: ["intro", "concept", "concept", "process", "stats", "benefits", "conclusion"],
        wordCountRange: [250, 400],
        exportFormats: ["pdf", "epub", "html", "pptx"],
        primaryExport: "pdf",
        promptGuidance:
            "Write a comprehensive, authoritative guide. Each section should have: one pull quote + one visual element (chart/diagram/table). Use H3 subheadings and bullet points liberally. Include specific statistics and actionable advice.",
        recommendedTemplates: ["minimal", "professional", "editorial", "elegant"],
    },

    presentation: {
        id: "presentation",
        label: "Slide Deck / Presentation",
        description: "12–15 punchy slides optimized for speaking or investor pitches",
        icon: "🎯",
        sections: 12,
        requiredSectionTypes: [
            "intro", "problem", "solution", "market", "product",
            "traction", "team", "financials", "roadmap", "ask",
            "faq", "conclusion",
        ],
        wordCountRange: [80, 150],
        exportFormats: ["pptx", "pdf"],
        primaryExport: "pptx",
        promptGuidance:
            "Write concise, punchy slide content. Each section = one slide. Max 120 words per slide. Lead with a bold headline stat. Use bullet points (3-5 per section, max 10 words each). Include one stat per slide if relevant.",
        recommendedTemplates: ["bold", "gradient", "tech", "modern"],
    },

    leadmagnet: {
        id: "leadmagnet",
        label: "Lead Magnet / Checklist",
        description: "Actionable 4–5 section checklist, cheatsheet, or quick-start guide",
        icon: "✅",
        sections: 5,
        requiredSectionTypes: ["intro", "checklist", "checklist", "resources", "cta"],
        wordCountRange: [120, 220],
        exportFormats: ["pdf", "html"],
        primaryExport: "pdf",
        promptGuidance:
            "Keep it SHORT and ACTIONABLE. Every section should be a numbered checklist or step-by-step. Use bullet points for everything. Include one quick tip callout per section. No fluff — pure value. Max 200 words per section.",
        recommendedTemplates: ["minimal", "warm", "bold"],
    },

    blogpost: {
        id: "blogpost",
        label: "Blog Post / Article",
        description: "SEO-optimized 5–6 section article ready to publish",
        icon: "✍️",
        sections: 6,
        requiredSectionTypes: ["intro", "concept", "process", "examples", "faq", "conclusion"],
        wordCountRange: [300, 500],
        exportFormats: ["markdown", "html"],
        primaryExport: "markdown",
        promptGuidance:
            "Write conversational, SEO-friendly content. Use H2 and H3 headings naturally. Include real-world examples and case studies. Add FAQ section near end. Use transition sentences between sections. Write for a general audience first, expert second.",
        recommendedTemplates: ["minimal", "editorial", "warm"],
    },

    social: {
        id: "social",
        label: "Social Media Content Pack",
        description: "3–4 sections each generating platform-specific posts",
        icon: "📱",
        sections: 4,
        requiredSectionTypes: ["hook", "value", "story", "cta"],
        wordCountRange: [60, 120],
        exportFormats: ["markdown", "html"],
        primaryExport: "markdown",
        promptGuidance:
            "Write for social media. Each section = one core message. Open with a strong hook. Keep sentences short (max 15 words). Use line breaks frequently. Include one strong stat per section. End with a clear call to action.",
        recommendedTemplates: ["bold", "gradient", "modern"],
    },

    report: {
        id: "report",
        label: "Research Report / White Paper",
        description: "8–10 section data-heavy research report with citations and charts",
        icon: "📊",
        sections: 9,
        requiredSectionTypes: [
            "executive-summary", "intro", "methodology", "findings",
            "findings", "analysis", "implications", "recommendations", "conclusion",
        ],
        wordCountRange: [350, 550],
        exportFormats: ["pdf", "epub", "html"],
        primaryExport: "pdf",
        promptGuidance:
            "Write in a formal, authoritative research style. Lead each section with key findings. Include specific data points and percentages. Every section must have a bar or line chart. Use comparison tables where relevant. Maintain professional, third-person tone.",
        recommendedTemplates: ["professional", "minimal", "tech"],
    },
};

export const FORMAT_PRESET_LIST = Object.values(FORMAT_PRESETS);

/** Get generation config for a format preset */
export function getGenerationConfig(formatId: string): {
    sections: number;
    promptGuidance: string;
} {
    const preset = FORMAT_PRESETS[formatId] ?? FORMAT_PRESETS.ebook;
    return {
        sections: preset.sections,
        promptGuidance: preset.promptGuidance,
    };
}
