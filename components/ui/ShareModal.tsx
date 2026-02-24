"use client";

import { useState } from "react";

interface ShareModalProps {
    url: string;
    onClose: () => void;
}

export function ShareModal({ url, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const input = document.createElement("input");
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">🔗 Your ebook is live!</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Share this link with anyone — no login needed</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* URL field */}
                <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-mono truncate">
                        {url}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all flex-shrink-0"
                        style={{
                            backgroundColor: copied ? "#16a34a" : "#2563eb",
                        }}
                    >
                        {copied ? "✓ Copied!" : "Copy"}
                    </button>
                </div>

                {/* Open link */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all mb-4"
                >
                    Open in new tab →
                </a>

                {/* Info */}
                <p className="text-xs text-gray-400 text-center">
                    ⏱ Link expires in 30 days · Accessible without login
                </p>
            </div>
        </div>
    );
}
