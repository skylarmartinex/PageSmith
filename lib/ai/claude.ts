import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateContentRequest {
  topic: string;
  outline?: string;
  sections?: number;
}

export async function generateEbookContent(
  request: GenerateContentRequest
) {
  const { topic, outline, sections = 5 } = request;

  const layoutTypes = ["text-only", "image-right", "image-left", "image-full", "image-grid", "image-overlay"];
  const lucideIcons = [
    "Lightbulb", "Zap", "Target", "TrendingUp", "BookOpen", "Star",
    "Globe", "Shield", "Rocket", "Users", "Heart", "Brain",
    "Compass", "Layers", "Code", "BarChart", "Clock", "Award"
  ];

  const systemPrompt = `You are an expert content strategist and ebook writer. 
You create professional, visually rich ebooks with varied layouts, compelling pull quotes, 
key statistics, and actionable callout boxes. Always return valid JSON only — no markdown, no explanation.`;

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
      }
    }
  ]
}

Rules:
- iconName must be one of: ${lucideIcons.join(", ")}
- stats: include 1-3 real or illustrative statistics ONLY for sections where data adds value; omit otherwise (use null or omit the field)
- callout.type: "tip" for best practices, "warning" for pitfalls, "insight" for aha moments; omit if nothing meaningful to add
- pullQuote: always include — make it quotable and punchy
- imageKeywords: always 3 distinct, specific keywords
- layoutType: vary across sections; use "image-overlay" for 1-2 high-drama sections where a powerful image with text on top creates impact; never use it for the first or last section
- coverImageKeyword: single highly visual keyword that represents the ebook topic perfectly`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt + formatPrompt,
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
