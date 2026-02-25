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

export async function generateEbookContent(
  request: GenerateContentRequest
) {
  const { topic, outline, sections = 5, brandVoice, targetPersona } = request;

  const layoutTypes = ["text-only", "image-right", "image-left", "image-full", "image-grid", "image-overlay"];
  const lucideIcons = [
    "Lightbulb", "Zap", "Target", "TrendingUp", "BookOpen", "Star",
    "Globe", "Shield", "Rocket", "Users", "Heart", "Brain",
    "Compass", "Layers", "Code", "BarChart", "Clock", "Award"
  ];

  const systemPrompt = `You are an expert content strategist and ebook writer. 
You create professional, visually rich ebooks with varied layouts, compelling pull quotes, 
key statistics, and actionable callout boxes. Always return valid JSON only — no markdown, no explanation.

IMPORTANT: When research context is provided below, actively use those real statistics and facts in your content. 
Cite sources naturally (e.g., "According to [Source], ..."). 
Make your content credible and specific — not generic.
${targetPersona ? `\nTARGET AUDIENCE: Write specifically for ${targetPersona}. Use vocabulary, examples, and depth appropriate for this audience. Every section should speak directly to their challenges and goals.` : ""}
${brandVoice ? `\nBRAND VOICE: Match the tone, vocabulary, and style of the following example text throughout the entire ebook. Do not copy the content, only match the voice:\n---\n${brandVoice}\n---` : ""}`;

  // Fetch real research context from Exa (best-effort, won't block if unavailable)
  let researchContext = "";
  try {
    const facts = await researchTopic(topic);
    researchContext = formatResearchContext(facts);
  } catch {
    // Exa not configured or unavailable — proceed without research
  }

  const userPrompt = outline
    ? `Create a professional ebook about "${topic}" using this outline:\n\n${outline}\n\nGenerate ${sections} sections.`
    : `Create a professional ebook about "${topic}". Generate ${sections} sections covering the most important aspects.`;

  const formatPrompt = `

For each section choose the most appropriate layoutType based on content:
- "text-only": concept-heavy explanations with no obvious visual
- "image-right": narrative content with one supporting image on the right  
- "image-left": alternate side for visual variety
- "image-full": dramatic openers or milestone sections
- "image-grid": data/comparison/step-by-step sections that benefit from multiple visuals

Return ONLY this JSON structure (no markdown):
{
  "title": "Ebook title",
  "subtitle": "Compelling subtitle in 8 words or less",
  "coverImageKeyword": "A single vivid keyword for the cover hero image (e.g. 'golf swing', 'mountain sunrise', 'startup team')",
  "sections": [
    {
      "title": "Section title",
      "content": "Main body text, 200-300 words. Write naturally with paragraph breaks using \\n\\n.",
      "layoutType": "image-right",
      "imageKeywords": ["keyword1", "keyword2", "keyword3"],
      "pullQuote": "A compelling 1-sentence insight from this section worth highlighting",
      "iconName": "Lightbulb",
      "stats": [
        { "label": "Stat Label", "value": "73%" }
      ],
      "callout": {
        "type": "tip",
        "text": "A concise actionable tip, warning, or key insight in 1-2 sentences"
      },
      "chart": {
        "type": "bar",
        "title": "Chart title",
        "unit": "%",
        "data": [
          { "label": "Category A", "value": 72 },
          { "label": "Category B", "value": 45 }
        ]
      },
      "diagram": {
        "type": "process",
        "title": "Diagram title",
        "steps": [
          { "title": "Step 1", "description": "Brief explanation", "date": "Optional date or phase" }
        ]
      }
    }
  ]
}

Rules:
- iconName must be one of: ${lucideIcons.join(", ")}
- stats: include 1-3 real or illustrative statistics ONLY for sections where data adds value; omit otherwise
- callout.type: "tip" for best practices, "warning" for pitfalls, "insight" for aha moments; omit if nothing meaningful
- pullQuote: always include — make it quotable and punchy
- imageKeywords: always 3 distinct, specific keywords
- layoutType: vary across sections; use "image-overlay" for 1-2 high-drama sections; never use it for the first or last section
- coverImageKeyword: single highly visual keyword that represents the ebook topic perfectly
- chart: include on 1-3 sections where data comparisons, trends, distributions, or percentages add value. Types: "bar" (comparisons), "line" (trends over time), "pie" (distribution), "donut" (distribution with center space), "progress" (skill levels or completion rates). Omit chart if no data makes sense.
- diagram: include on 1-2 sections where a step-by-step process ("process") or chronological milestones ("timeline") would clarify the concept. Omit diagram if not applicable.
- NEVER include both chart and diagram on the same section
- chart and diagram data must be realistic, specific, and relevant to the content — not generic placeholders`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          userPrompt + formatPrompt,
          researchContext ? `\n\n${researchContext}` : "",
        ].join(""),
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON
  const jsonMatch =
    responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
    responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Failed to parse Claude response");
  }

  const jsonText = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonText);
}
