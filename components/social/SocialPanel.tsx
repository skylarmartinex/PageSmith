"use client";

import { useState } from "react";
import { SocialPost } from "@/lib/ai/socialPosts";
import { SocialPostCard } from "./SocialPostCard";
import { BrandConfig } from "@/lib/templates/types";

type Platform = "instagram" | "linkedin" | "twitter";

interface SocialPanelProps {
    title: string;
    sections: { title: string; content: string }[];
    brand: BrandConfig;
}

const PLATFORM_ICONS: Record<Platform, string> = {
    instagram: "📸",
    linkedin: "💼",
    twitter: "🐦",
};

export function SocialPanel({ title, sections, brand }: SocialPanelProps) {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activePlatform, setActivePlatform] = useState<Platform>("instagram");
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/social", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, sections }),
            });
            if (!res.ok) throw new Error("Failed to generate");
            const data = await res.json();
            setPosts(data.posts);
            setGenerated(true);
        } catch (err) {
            setError("Failed to generate social posts. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const platformPosts = posts.filter((p) => p.platform === activePlatform);
    const platforms: Platform[] = ["instagram", "linkedin", "twitter"];

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span>✨</span> Social Posts
                </p>
            </div>

            <div className="p-4 space-y-4 bg-white">
                {!generated ? (
                    <div className="text-center py-2">
                        <p className="text-xs text-gray-500 mb-3">
                            Turn your ebook into Instagram, LinkedIn & Twitter posts
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                            style={{
                                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                                color: "#fff",
                            }}
                        >
                            {loading ? "Generating posts…" : "✨ Generate Social Posts"}
                        </button>
                        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                    </div>
                ) : (
                    <>
                        {/* Platform tabs */}
                        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                            {platforms.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setActivePlatform(p)}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${activePlatform === p
                                            ? "bg-white shadow-sm text-gray-900"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {PLATFORM_ICONS[p]} {p}
                                </button>
                            ))}
                        </div>

                        {/* Post cards */}
                        <div className="space-y-4">
                            {platformPosts.length > 0 ? (
                                platformPosts.map((post, i) => (
                                    <SocialPostCard key={i} post={post} brand={brand} />
                                ))
                            ) : (
                                <p className="text-xs text-center text-gray-400 py-4">No posts for this platform</p>
                            )}
                        </div>

                        {/* Regenerate */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-lg transition-colors"
                        >
                            {loading ? "Regenerating…" : "↻ Regenerate All"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
