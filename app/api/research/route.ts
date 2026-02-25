import { NextRequest, NextResponse } from "next/server";
import { researchTopic } from "@/lib/research/exa";

export async function GET(req: NextRequest) {
    const topic = req.nextUrl.searchParams.get("topic");
    if (!topic) return NextResponse.json({ facts: [], error: "Missing topic" });

    try {
        const facts = await researchTopic(topic);
        return NextResponse.json({ facts });
    } catch (err) {
        console.error("Research error:", err);
        return NextResponse.json({ facts: [], error: "Research unavailable" });
    }
}
