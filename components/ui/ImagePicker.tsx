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
}

export function ImagePicker({ onSelect, onClose, initialQuery = "" }: ImagePickerProps) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<ImageResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        if (initialQuery) search(initialQuery);
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

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") search(query);
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
                {/* Header */}
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

                {/* Results grid */}
                <div className="overflow-y-auto p-3" style={{ maxHeight: "65vh" }}>
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

                {/* Attribution note */}
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                    <p className="text-[10px] text-gray-400 text-center">Photos from Unsplash · Click an image to replace</p>
                </div>
            </div>
        </div>
    );
}
