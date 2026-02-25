import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Curated Google Font pairings by vibe
const PAIRINGS = [
    { heading: "Playfair Display", body: "Lato", vibe: "elegant, editorial, luxury, refined" },
    { heading: "Montserrat", body: "Merriweather", vibe: "professional, corporate, business, finance" },
    { heading: "Space Grotesk", body: "Inter", vibe: "tech, startup, SaaS, modern, digital" },
    { heading: "Fraunces", body: "DM Sans", vibe: "warm, creative, artisanal, personal" },
    { heading: "Bebas Neue", body: "Open Sans", vibe: "bold, high-energy, sports, fitness, impact" },
    { heading: "Cormorant Garamond", body: "Nunito", vibe: "fashion, lifestyle, feminine, premium" },
    { heading: "Josefin Sans", body: "Source Serif 4", vibe: "minimalist, clean, scandinavian, architectural" },
    { heading: "Raleway", body: "Roboto", vibe: "general, versatile, friendly, approachable" },
    { heading: "Oswald", body: "PT Serif", vibe: "authoritative, news, editorial, journalism" },
    { heading: "Outfit", body: "Libre Baskerville", vibe: "modern professional, consulting, coaching" },
];

export async function POST(req: NextRequest) {
    try {
        const { topic } = await req.json();
        if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

        const pairingList = PAIRINGS.map((p, i) => `${i}: ${p.heading}/${p.body} — ${p.vibe}`).join("\n");

        const response = await anthropic.messages.create({
            model: "claude-haiku-4-20250514",
            max_tokens: 200,
            messages: [{
                role: "user",
                content: `Given an ebook about "${topic}", which font pairing index (0-${PAIRINGS.length - 1}) is the best match for tone and audience? Return only a JSON object: {"index": <number>, "reason": "<one sentence>"}

Pairings:
${pairingList}`,
            }],
        });

        const text = response.content[0].type === "text" ? response.content[0].text : "{}";
        const match = text.match(/\{[\s\S]*\}/);
        const parsed = match ? JSON.parse(match[0]) : { index: 7 };
        const pairing = PAIRINGS[parsed.index] || PAIRINGS[7];

        return NextResponse.json({
            heading: pairing.heading,
            body: pairing.body,
            reason: parsed.reason || `Best match for ${topic}`,
            fontFamily: `${pairing.heading}, ${pairing.body}`,
        });
    } catch (err) {
        console.error("Font pairing error:", err);
        return NextResponse.json({ heading: "Outfit", body: "Inter", fontFamily: "Outfit, Inter" });
    }
}
