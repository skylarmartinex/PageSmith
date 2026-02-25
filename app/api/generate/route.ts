import { NextRequest, NextResponse } from "next/server";
import { generateEbookContent } from "@/lib/ai/claude";
import { applySmartLayoutPipeline } from "@/lib/templates/smartLayout";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, outline, sections, brandVoice, targetPersona } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Step 1: Generate raw content from AI
    const result = await generateEbookContent({
      topic,
      outline,
      sections: sections || 6,
      brandVoice,
      targetPersona,
    });

    // Step 2: Apply Smart Layout Engine (post-processing)
    // This runs BEFORE images are fetched, so layout decisions are based on content type
    if (result.sections && Array.isArray(result.sections)) {
      result.sections = applySmartLayoutPipeline(result.sections);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
