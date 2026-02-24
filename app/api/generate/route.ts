import { NextRequest, NextResponse } from "next/server";
import { generateEbookContent } from "@/lib/ai/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, outline, sections } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const result = await generateEbookContent({
      topic,
      outline,
      sections: sections || 5,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
