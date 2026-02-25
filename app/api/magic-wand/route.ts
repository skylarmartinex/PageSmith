import { NextRequest, NextResponse } from "next/server";
import { generateMagicWandBrand } from "@/lib/ai/magicWand";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // ── Branding mode (existing) ─────────────────────────────────────────
        if (body.topic && !body.prompt) {
            const { topic, templateId } = body;
            const result = await generateMagicWandBrand(topic, templateId || "minimal");
            return NextResponse.json(result);
        }

        // ── AI Assist mode (new) — generic prompt passthrough ────────────────
        if (body.prompt) {
            const { prompt, maxTokens = 600, systemPrompt } = body;

            const message = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: maxTokens,
                system: systemPrompt || "You are an expert content writer and editor. Respond concisely and directly. No preamble.",
                messages: [{ role: "user", content: prompt }],
            });

            const result = message.content[0].type === "text" ? message.content[0].text : "";
            return NextResponse.json({ result });
        }

        return NextResponse.json({ error: "Either 'topic' or 'prompt' is required" }, { status: 400 });
    } catch (error) {
        console.error("Magic wand error:", error);
        return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }
}
