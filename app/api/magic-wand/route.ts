import { NextRequest, NextResponse } from "next/server";
import { generateMagicWandBrand } from "@/lib/ai/magicWand";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, templateId } = body;

        if (!topic) {
            return NextResponse.json({ error: "topic is required" }, { status: 400 });
        }

        const result = await generateMagicWandBrand(topic, templateId || "minimal");
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating magic wand brand:", error);
        return NextResponse.json(
            { error: "Failed to generate brand suggestion" },
            { status: 500 }
        );
    }
}
