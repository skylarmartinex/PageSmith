import { NextRequest, NextResponse } from "next/server";
import { generateImage, buildCoverPrompt, buildSectionPrompt, buildInfographicPrompt } from "@/lib/ai/imagen";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, prompt, topic, keyword, title, summary, chartData } = body;

        let finalPrompt: string;

        if (prompt) {
            // Direct prompt override
            finalPrompt = prompt;
        } else if (type === "cover") {
            finalPrompt = buildCoverPrompt(topic ?? "professional", keyword);
        } else if (type === "infographic" && chartData) {
            finalPrompt = buildInfographicPrompt(title ?? "Data Overview", chartData);
        } else {
            finalPrompt = buildSectionPrompt(title ?? topic ?? "professional", summary);
        }

        const url = await generateImage(finalPrompt);
        return NextResponse.json({ url });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Imagen 3 error:", message);

        // Friendly error if API key is missing
        if (message.includes("GOOGLE_AI_API_KEY")) {
            return NextResponse.json(
                { error: "GOOGLE_AI_API_KEY is not configured. Add it to your .env.local file." },
                { status: 503 }
            );
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
