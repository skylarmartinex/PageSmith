"use client";

import { useState } from "react";
import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface LeadCapturePageProps {
    content: EbookContent;
    config: TemplateConfig;
    /** Custom CTA headline — defaults to something generated from title */
    headline?: string;
    /** Custom body copy */
    body?: string;
    /** Button label */
    cta?: string;
}

export function LeadCapturePage({ content, config, headline, body, cta }: LeadCapturePageProps) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const defaultHeadline = `Want more insights like "${content.title}"?`;
    const defaultBody = "Join thousands of readers who get our best content delivered straight to their inbox. No spam, unsubscribe anytime.";
    const defaultCta = "Get Free Updates";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        // Simulate submission — integrate with your email provider here
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div
            className="relative overflow-hidden mt-2"
            style={{ background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)` }}
        >
            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${config.colors.accent} 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="relative px-12 py-16 text-center max-w-2xl mx-auto">
                {/* Icon */}
                <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: config.colors.accent + "30", backdropFilter: "blur(8px)" }}
                >
                    ✉️
                </div>

                {!submitted ? (
                    <>
                        <h2 className="text-3xl font-black text-white mb-3 leading-tight">
                            {headline || defaultHeadline}
                        </h2>
                        <p className="text-white/70 text-base mb-8 leading-relaxed">
                            {body || defaultBody}
                        </p>

                        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{ "--tw-ring-color": config.colors.accent } as React.CSSProperties}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 flex-shrink-0"
                                style={{ backgroundColor: config.colors.accent, color: "#ffffff" }}
                            >
                                {loading ? "..." : (cta || defaultCta)}
                            </button>
                        </form>

                        <p className="text-white/40 text-xs mt-4">
                            No spam · Unsubscribe anytime
                        </p>
                    </>
                ) : (
                    <div className="py-4">
                        <div className="text-5xl mb-4">🎉</div>
                        <h2 className="text-3xl font-black text-white mb-3">You&apos;re in!</h2>
                        <p className="text-white/70 text-base">
                            Thanks for subscribing. Check your inbox for a confirmation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
