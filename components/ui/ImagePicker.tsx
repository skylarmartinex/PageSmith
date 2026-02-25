"use client";

import { useState, useRef, useEffect } from "react";

export interface ImageResult {
    url: string;
    thumb: string;
    alt: string;
    attribution: string;
}

interface ImagePickerProps {
    onSelect: (img: ImageResult) => void;
    onClose: () => void;
    initialQuery?: string;
    sectionTitle?: string;
    sectionSummary?: string;
}

type Tab = "unsplash" | "ai";

export function ImagePicker({ onSelect, onClose, initialQuery = "", sectionTitle, sectionSummary }: ImagePickerProps) {
    const [tab, setTab] = useState<Tab>("unsplash");
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<ImageResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState(
        sectionTitle ? `${sectionTitle}${sectionSummary ? ` — ${sectionSummary.slice(0, 100)}` : ""}` : initialQuery
    );
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        if (initialQuery && tab === "unsplash") search(initialQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const search = async (q: string) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/images?query=${encodeURIComponent(q)}&count=12`);
            if (!res.ok) throw new Error("Search failed");
            const data = await res.json();
            setResults(data.images || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const generateAI = async () => {
        if (!aiPrompt.trim()) return;
        setAiLoading(true);
        setAiError(null);
        setAiResult(null);
        try {
            const res = await fetch("/api/imagen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "section",
                    title: sectionTitle || aiPrompt,
                    summary: sectionSummary,
                    prompt: aiPrompt !== (sectionTitle || "") ? aiPrompt : undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || "Generation failed");
            setAiResult(data.url);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "Failed to generate image");
        } finally {
            setAiLoading(false);
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tab === "unsplash") search(query);
        if (e.key === "Escape") onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ maxHeight: "80vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setTab("unsplash")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${tab === "unsplash"
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        📷 Unsplash
                    </button>
                    <button
                        onClick={() => setTab("ai")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${tab === "ai"
                                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        🤖 Generate with Imagen 3
                    </button>
                </div>

                {/* ── Unsplash Tab ── */}
                {tab === "unsplash" && (
                    <>
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <span className="text-gray-400 text-lg">🔍</span>
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Search Unsplash photos..."
                                className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none"
                            />
                            <button
                                onClick={() => search(query)}
                                disabled={loading}
                                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? "..." : "Search"}
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-1">✕</button>
                        </div>

                        <div className="overflow-y-auto p-3" style={{ maxHeight: "58vh" }}>
                            {loading && (
                                <div className="grid grid-cols-3 gap-2">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <div key={i} className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            )}
                            {!loading && results.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-12">
                                    {query ? "No results — try a different search" : "Type something to search"}
                                </p>
                            )}
                            {!loading && results.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {results.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onSelect(img)}
                                            className="relative group rounded-xl overflow-hidden aspect-video focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <img src={img.thumb || img.url} alt={img.alt} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                                <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all bg-black/50 px-2 py-1 rounded-lg">
                                                    Use this
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                            <p className="text-[10px] text-gray-400 text-center">Photos from Unsplash · Click an image to replace</p>
                        </div>
                    </>
                )}

                {/* ── Imagen 3 AI Tab ── */}
                {tab === "ai" && (
                    <div className="p-5 flex flex-col gap-4" style={{ minHeight: "400px" }}>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image prompt</label>
                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                rows={3}
                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                                placeholder="Describe the image you want to generate..."
                            />
                        </div>

                        <button
                            onClick={generateAI}
                            disabled={aiLoading || !aiPrompt.trim()}
                            className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                            style={{
                                background: aiLoading ? "#9ca3af" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                            }}
                        >
                            {aiLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Generating with Imagen 3...
                                </span>
                            ) : (
                                "✨ Generate Image"
                            )}
                        </button>

                        {aiError && (
                            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                                {aiError.includes("GOOGLE_AI_API_KEY")
                                    ? "⚙️ Add GOOGLE_AI_API_KEY to your .env.local to enable Imagen 3."
                                    : aiError}
                            </div>
                        )}

                        {aiResult && (
                            <div className="space-y-3">
                                <img src={aiResult} alt="AI generated" className="w-full rounded-xl object-cover shadow-md" style={{ maxHeight: "280px" }} />
                                <button
                                    onClick={() =>
                                        onSelect({
                                            url: aiResult,
                                            thumb: aiResult,
                                            alt: sectionTitle || aiPrompt,
                                            attribution: "Generated with Google Imagen 3",
                                        })
                                    }
                                    className="w-full py-2.5 rounded-xl font-bold text-sm text-white"
                                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                                >
                                    Use this image
                                </button>
                                <button
                                    onClick={generateAI}
                                    className="w-full py-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
                                >
                                    🔄 Regenerate
                                </button>
                            </div>
                        )}

                        {!aiResult && !aiLoading && !aiError && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-6 text-gray-400">
                                <p className="text-4xl mb-3">🎨</p>
                                <p className="text-sm font-medium">Powered by Google Imagen 3</p>
                                <p className="text-xs mt-1">Generates photorealistic images in ~8 seconds</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
