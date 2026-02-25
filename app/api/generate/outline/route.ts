import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * POST /api/generate/outline
 * Generates a structured outline: title, subtitle, sections with titles + content types.
 * This is Step 1 of the multi-step generation pipeline.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, format = "ebook", sections = 6, brandVoice, targetPersona } = body;

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const contentTypes = [
            "concept",
            "process",
            "comparison",
            "stats",
            "story",
            "benefits",
            "intro",
            "conclusion",
        ];

        const systemPrompt = `You are an expert content strategist. 
You create crisp, reader-focused outlines for professional ${format}s.
Return ONLY valid JSON — no markdown code fences, no explanation.
${targetPersona ? `TARGET AUDIENCE: ${targetPersona}` : ""}
${brandVoice ? `BRAND VOICE SAMPLE (match the tone): ${brandVoice}` : ""}`;

        const userPrompt = `Create a high-quality ${format} outline about: "${topic}"

Requirements:
- Exactly ${sections} sections (not counting cover/TOC)
- First section = engaging intro, last section = actionable conclusion
- Middle sections must vary in content type
- Each section must have a specific, non-generic title (not "Introduction")
- Content types available: ${contentTypes.join(", ")}

Return this exact JSON structure:
{
  "title": "Compelling ebook title (6-10 words)",
  "subtitle": "Subheading explaining the value (8-12 words)",
  "coverImageKeyword": "Single vivid keyword for cover photo (e.g. 'mountain sunrise')",
  "format": "${format}",
  "sections": [
    {
      "title": "Section title (5-8 words)",
      "description": "What this section covers and why it matters (1-2 sentences)",
      "contentType": "intro",
      "estimatedWordCount": 250
    }
  ]
}`;

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
        });

        const text = message.content[0].type === "text" ? message.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse outline response");

        const outline = JSON.parse(jsonMatch[0]);
        return NextResponse.json(outline);
    } catch (error) {
        console.error("Outline generation error:", error);
        return NextResponse.json({ error: "Failed to generate outline" }, { status: 500 });
    }
}
