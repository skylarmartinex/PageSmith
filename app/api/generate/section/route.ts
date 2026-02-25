import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LUCIDE_ICONS = [
    "Lightbulb", "Zap", "Target", "TrendingUp", "BookOpen", "Star",
    "Globe", "Shield", "Rocket", "Users", "Heart", "Brain",
    "Compass", "Layers", "Code", "BarChart", "Clock", "Award",
    "CheckCircle", "AlertCircle", "ArrowRight", "Sparkles", "Lock",
    "Megaphone", "PieChart", "Database", "Cpu", "Wrench", "Map",
    "Flag", "Trophy", "Briefcase", "ChevronRight", "Eye",
];

/**
 * POST /api/generate/section
 * Generates rich content for a single section, given its title, description, and contentType.
 * Step 2 of the multi-step generation pipeline — call once per section.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            sectionTitle,
            sectionDescription,
            contentType = "concept",
            ebookTitle,
            researchContext = "",
            brandVoice,
            targetPersona,
            index = 0,
            totalSections = 6,
        } = body;

        if (!sectionTitle) {
            return NextResponse.json({ error: "sectionTitle is required" }, { status: 400 });
        }

        // Determine which visual elements to require based on contentType
        const componentGuidance: Record<string, string> = {
            concept: "Include a pullQuote and a callout (tip or insight). Omit chart/diagram.",
            process: "Include a pullQuote and a diagram with type 'process'. Steps should be 4-6 with brief descriptions.",
            comparison: 'Include a pullQuote and a comparisonTable (3-4 columns, 4-6 rows). Do NOT include a chart.',
            stats: "Include 2-3 stats and a bar or area chart with real-looking data. Include a pullQuote.",
            story: "Include a pullQuote. Add a callout with type 'insight'. Skip charts.",
            benefits: "Include an iconGrid with 4-6 items and a pullQuote.",
            intro: "Include a pullQuote. Add a callout with type 'tip'. Make the content engaging and inviting.",
            conclusion: "Include a pullQuote and a callout with type 'insight'. Summarize the key takeaways.",
        };

        const systemPrompt = `You are an expert content writer specializing in high-quality ebooks and professional guides.
You write engaging, specific, well-structured prose — never generic or padded.
You always include concrete examples, real-sounding statistics, and actionable insights.
Return ONLY valid JSON — no markdown code fences, no preamble.
${targetPersona ? `TARGET AUDIENCE: ${targetPersona}. Write specifically for them.` : ""}
${brandVoice ? `BRAND VOICE: Match the tone of: ${brandVoice}` : ""}`;

        const sectionContext = index === 0
            ? "This is the OPENING section. Hook the reader immediately. Establish why this topic matters."
            : index === totalSections - 1
                ? "This is the FINAL section. Synthesize key learnings, inspire action, end memorably."
                : `This is section ${index + 1} of ${totalSections}. Build on what's been covered, go deeper.`;

        const userPrompt = `Generate content for a section of the ebook: "${ebookTitle || sectionTitle}"

SECTION TITLE: "${sectionTitle}"
CONTEXT: ${sectionDescription || "Cover this topic thoroughly."}
CONTENT TYPE: ${contentType}
POSITION: ${sectionContext}

VISUAL REQUIREMENTS: ${componentGuidance[contentType] || componentGuidance.concept}
${researchContext ? `\nRESEARCH TO INCORPORATE:\n${researchContext}` : ""}

QUALITY RULES:
- content: 200-320 words, naturally structured with 2-3 clear paragraphs. Use \\n\\n between paragraphs.
- Add H3 subheads within the content by prefixing lines with "### Title" on their own line.
- pullQuote: ALWAYS include — make it quotable, punchy, max 20 words.
- callout.text: MUST be actionable and specific (not "Consider your options"). 1-2 sentences.
- stats: values must be realistic percentages or numbers (not "50%", use specific like "67%" or "$2.4M").
- chart.data: minimum 4 data points with realistic, varied values.
- comparisonTable.rows: minimum 4 rows comparing meaningful attributes.
- iconGrid.items: each item needs icon (from the list below), 3-5 word title, 1-2 sentence description.

Return ONLY this JSON structure:
{
  "title": "${sectionTitle}",
  "content": "...",
  "layoutType": "image-right",
  "imageKeywords": ["keyword1", "keyword2", "keyword3"],
  "pullQuote": "...",
  "iconName": "Lightbulb",
  "stats": [{ "label": "...", "value": "..." }],
  "callout": { "type": "tip", "text": "..." },
  "chart": { "type": "bar", "title": "...", "unit": "%", "data": [{ "label": "...", "value": 0 }] },
  "diagram": { "type": "process", "title": "...", "steps": [{ "title": "...", "description": "..." }] },
  "comparisonTable": { "title": "...", "headers": ["..."], "rows": [{ "feature": "...", "values": ["..."] }], "highlightCol": 0 },
  "iconGrid": { "title": "...", "columns": 3, "items": [{ "icon": "Star", "title": "...", "description": "..." }] }
}

NOTES:
- Include only ONE of: chart, diagram, comparisonTable, iconGrid (whichever fits the contentType)
- layoutType must be one of: text-only, image-right, image-left, image-full, image-grid, image-overlay
- iconName must be one of: ${LUCIDE_ICONS.join(", ")}
- Omit any top-level key entirely if it's not applicable (e.g., omit "chart" if using diagram)`;

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 3000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
        });

        const text = message.content[0].type === "text" ? message.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse section response");

        const section = JSON.parse(jsonMatch[0]);
        return NextResponse.json(section);
    } catch (error) {
        console.error("Section generation error:", error);
        return NextResponse.json({ error: "Failed to generate section" }, { status: 500 });
    }
}
