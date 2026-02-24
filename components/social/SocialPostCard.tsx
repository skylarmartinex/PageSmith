"use client";

import { useRef } from "react";
import { SocialPost } from "@/lib/ai/socialPosts";
import { BrandConfig } from "@/lib/templates/types";

const PLATFORM_DIMENSIONS: Record<string, { width: number; aspect: string; label: string }> = {
    instagram: { width: 400, aspect: "aspect-square", label: "1:1" },
    linkedin: { width: 400, aspect: "aspect-video", label: "1.91:1" },
    twitter: { width: 400, aspect: "aspect-video", label: "2:1" },
};

const PLATFORM_COLORS: Record<string, { bg: string; accent: string }> = {
    instagram: { bg: "#e1306c", accent: "#f77737" },
    linkedin: { bg: "#0077b5", accent: "#005fa3" },
    twitter: { bg: "#1da1f2", accent: "#0d8ecf" },
};

interface SocialPostCardProps {
    post: SocialPost;
    brand: BrandConfig;
}

export function SocialPostCard({ post, brand }: SocialPostCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const dim = PLATFORM_DIMENSIONS[post.platform];
    const platformColor = PLATFORM_COLORS[post.platform];

    const primaryColor = brand.primaryColor || "#1e3a8a";
    const accentColor = brand.accentColor || platformColor.accent;

    const handleExportPNG = async () => {
        if (!cardRef.current) return;
        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });
            const link = document.createElement("a");
            link.download = `${post.platform}-post-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("PNG export failed:", err);
        }
    };

    return (
        <div className="space-y-2">
            {/* Card */}
            <div
                ref={cardRef}
                className={`${dim.aspect} relative overflow-hidden rounded-xl w-full`}
                style={{
                    background: post.image
                        ? undefined
                        : `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
            >
                {/* Background image */}
                {post.image && (
                    <>
                        <img
                            src={post.image.url}
                            alt={post.image.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${primaryColor}cc 0%, ${accentColor}99 100%)` }} />
                    </>
                )}

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                    {/* Platform badge */}
                    <div className="flex justify-between items-start">
                        <span
                            className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                        >
                            {post.platform}
                        </span>
                    </div>

                    {/* Main text */}
                    <div>
                        <h3 className="text-white font-black text-xl leading-tight mb-2 drop-shadow">
                            {post.headline}
                        </h3>
                        <p className="text-white/85 text-sm leading-relaxed line-clamp-3">{post.body}</p>
                        <p className="text-white font-semibold text-sm mt-3 flex items-center gap-1">
                            <span>→</span> {post.cta}
                        </p>
                        <p className="text-white/60 text-xs mt-2">
                            {post.hashtags.map((h) => `#${h}`).join(" ")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Export button */}
            <button
                onClick={handleExportPNG}
                className="w-full text-xs py-1.5 px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
                ⬇ Export PNG
            </button>
        </div>
    );
}
