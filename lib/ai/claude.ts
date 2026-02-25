import Anthropic from "@anthropic-ai/sdk";
import { researchTopic, formatResearchContext } from "@/lib/research/exa";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateContentRequest {
  topic: string;
  outline?: string;
  sections?: number;
  brandVoice?: string;
  targetPersona?: string;
}

const LUCIDE_ICONS = [
  "Lightbulb", "Zap", "Target", "TrendingUp", "BookOpen", "Star",
  "Globe", "Shield", "Rocket", "Users", "Heart", "Brain",
  "Compass", "Layers", "Code", "BarChart", "Clock", "Award",
  "CheckCircle", "AlertCircle", "ArrowRight", "Sparkles", "Lock",
  "Megaphone", "PieChart", "Database", "Cpu", "Wrench", "Map",
  "Flag", "Trophy", "Briefcase", "ChevronRight", "Eye",
];

export async function generateEbookContent(
  request: GenerateContentRequest
) {
  const { topic, outline, sections = 6, brandVoice, targetPersona } = request;

  const systemPrompt = `You are an expert content strategist and ebook writer.
You create professional, visually-rich ebooks with varied layouts, compelling pull quotes,
specific statistics, and actionable callout boxes.
You write with clarity, depth, and authority — never with filler or vague generalities.
Always return valid JSON only — no markdown code fences, no explanation.

MANDATORY QUALITY RULES (violations will cause rejection):
1. Every section MUST include a pullQuote — make it quotable, punchy, ≤20 words.
2. Every section MUST include exactly one visual element (chart OR diagram OR comparisonTable OR iconGrid).
3. stats values must be specific and realistic (e.g., "67%", "$2.4M", "3.2x" — not round numbers like "50%").
4. callout.text must be actionable and specific — never generic (e.g., NOT "Consider your options carefully").
5. Content must have 2-3 distinct paragraphs separated by \\n\\n. Use "### Title" for H3 subheadings on their own line.
6. imageKeywords must be highly specific and visual (e.g., "remote team video call" not "teamwork").
${targetPersona ? `\nTARGET AUDIENCE: Write specifically for ${targetPersona}. Every section speaks directly to their challenges.` : ""}
${brandVoice ? `\nBRAND VOICE: Match this voice sample throughout — do not copy content, only tone:\n---\n${brandVoice}\n---` : ""}`;

  // Fetch real research context (best-effort)
  let researchContext = "";
  try {
    const facts = await researchTopic(topic);
    researchContext = formatResearchContext(facts);
  } catch {
    // Exa not configured or unavailable — proceed without research
  }

  const basePrompt = outline
    ? `Create a professional, visually-rich ebook about "${topic}" using this outline:\n\n${outline}\n\nGenerate exactly ${sections} sections.`
    : `Create a professional, visually-rich ebook about "${topic}". Generate exactly ${sections} sections covering the most important aspects. Section titles must be specific and compelling, not generic (e.g., NOT "Introduction" or "Conclusion").`;

  const formatPrompt = `

LAYOUT SELECTION GUIDE — choose based purely on content:
- "text-only": concept-heavy explanations without obvious visuals
- "image-right": narrative content with one supporting image on the right
- "image-left": alternate side for visual variety (don't use same side twice in a row)
- "image-full": dramatic openers or milestone sections (max 2 per ebook)
- "image-grid": multi-step or comparison sections (max 2 per ebook)
- "image-overlay": bold insight/quote sections (max 2, never first or last)

CONTENT TYPE GUIDE — pick the best visual component:
- process section → diagram type "process" (4-6 steps)
- timeline/history → diagram type "timeline" (4-6 milestones)
- data/trends → chart type "bar" or "area" or "line" (min 4 data points)
- distribution → chart type "pie" or "donut" (min 3 slices)
- feature comparison → comparisonTable (2-4 columns, 4-6 rows)
- features/tools list → iconGrid (4-6 items, columns 2 or 3)

Return ONLY this JSON (no markdown):
{
  "title": "Ebook title (6-10 words)",
  "subtitle": "Compelling subtitle (8-12 words)",
  "coverImageKeyword": "Single vivid keyword for cover (e.g. 'mountain sunrise')",
  "sections": [
    {
      "title": "Section title (5-8 words, specific and compelling)",
      "content": "Body text 220-320 words. Natural paragraphs with \\\\n\\\\n between them. Use ### for H3 subheads.",
      "layoutType": "image-right",
      "imageKeywords": ["specific keyword 1", "specific keyword 2", "specific keyword 3"],
      "pullQuote": "Punchy 1-sentence insight, quotable, ≤20 words",
      "iconName": "Lightbulb",
      "stats": [
        { "label": "Stat label", "value": "67%" }
      ],
      "callout": {
        "type": "tip",
        "text": "Specific, actionable advice in 1-2 sentences."
      },
      "chart": {
        "type": "bar",
        "title": "Chart title",
        "unit": "%",
        "data": [
          { "label": "Category A", "value": 72 },
          { "label": "Category B", "value": 45 },
          { "label": "Category C", "value": 61 },
          { "label": "Category D", "value": 38 }
        ]
      }
    }
  ]
}

RULES (these are enforced — violations break the parser):
- pullQuote: ALWAYS include, ALWAYS ≤20 words
- One and only one of: chart, diagram, comparisonTable, iconGrid per section
- NEVER chart + diagram on the same section
- stats: 1-3 entries, only for data-heavy sections — omit otherwise
- callout: include for 60% of sections; always actionable
- iconName from: ${LUCIDE_ICONS.join(", ")}
- chart.data: minimum 4 data points
- layoutType: vary — no layout should repeat 3+ times in a row
- image-overlay: max 2 sections, never first or last
- comparisonTable: include highlightCol (0-based index of the recommended column)
- chapterDivider: optionally add to 1-2 mid-document sections: { chapterNumber, title, subtitle }
- coverImageKeyword: single highly visual keyword`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          basePrompt + formatPrompt,
          researchContext ? `\n\nRESEARCH CONTEXT — use these facts actively:\n${researchContext}` : "",
        ].join(""),
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON — handles both raw JSON and code-fenced JSON
  const jsonMatch =
    responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
    responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Failed to parse Claude response");
  }

  const jsonText = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonText);
}
