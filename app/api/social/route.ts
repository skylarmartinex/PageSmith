import { NextRequest, NextResponse } from "next/server";
import { generateSocialPosts } from "@/lib/ai/socialPosts";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, sections } = body;

        if (!title || !sections) {
            return NextResponse.json(
                { error: "title and sections are required" },
                { status: 400 }
            );
        }

        const result = await generateSocialPosts(title, sections);

        // Fetch images for each post
        const postsWithImages = await Promise.all(
            result.posts.map(async (post) => {
                try {
                    const imageRes = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/images?query=${encodeURIComponent(post.imageKeyword)}&count=1`
                    );
                    if (imageRes.ok) {
                        const imageData = await imageRes.json();
                        if (imageData.images?.[0]) {
                            return { ...post, image: imageData.images[0] };
                        }
                    }
                } catch { }
                return post;
            })
        );

        return NextResponse.json({ posts: postsWithImages });
    } catch (error) {
        console.error("Error generating social posts:", error);
        return NextResponse.json(
            { error: "Failed to generate social posts" },
            { status: 500 }
        );
    }
}
