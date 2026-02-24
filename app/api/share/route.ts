import { NextRequest, NextResponse } from "next/server";
import { saveEbook } from "@/lib/share/redis";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content, templateId, brandConfig } = body;

        if (!content?.title || !content?.sections?.length) {
            return NextResponse.json({ error: "Invalid ebook content" }, { status: 400 });
        }

        const id = await saveEbook({ content, templateId, brandConfig });
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pagesmith.vercel.app";
        const url = `${baseUrl}/share/${id}`;

        return NextResponse.json({ id, url });
    } catch (err) {
        console.error("Share error:", err);
        return NextResponse.json({ error: "Failed to save ebook" }, { status: 500 });
    }
}
