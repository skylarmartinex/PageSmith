import Anthropic from "@anthropic-ai/sdk";
import { GOOGLE_FONTS } from "@/lib/fonts/googleFonts";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface BrandSuggestion {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    rationale: string;
}

export async function generateMagicWandBrand(
    topic: string,
    templateId: string
): Promise<BrandSuggestion> {
    const fontOptions = GOOGLE_FONTS.map((f) => `"${f.value}"`).join(", ");

    const prompt = `You are a professional brand designer. Suggest a perfect color palette and font for an ebook about: "${topic}"

Template style: ${templateId}

Choose colors that:
- Feel right for the topic's mood/industry
- Have strong contrast between primary/background
- Feel professional and polished

Available fonts (use EXACTLY one of these values): ${fontOptions}

Respond with ONLY valid JSON (no markdown):
{
  "primaryColor": "#hexcode",
  "secondaryColor": "#hexcode", 
  "accentColor": "#hexcode",
  "backgroundColor": "#hexcode",
  "textColor": "#hexcode",
  "fontFamily": "exact font value from list above",
  "rationale": "One sentence why this palette fits the topic"
}`;

    const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
    });

    const responseText =
        message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch =
        responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
        responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("Failed to parse Claude response");

    const jsonText = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonText);
}
