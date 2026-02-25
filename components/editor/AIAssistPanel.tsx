"use client";

import { useState, useCallback } from "react";
import { EbookSection, TemplateConfig } from "@/lib/templates/types";
import { detectContentType, applySmartLayoutPipeline } from "@/lib/templates/smartLayout";

interface AIAssistProps {
    section: EbookSection;
    sectionIndex: number;
    allSections: EbookSection[];
    config: TemplateConfig;
    ebookTitle: string;
    onUpdateSection: (index: number, updated: EbookSection) => void;
    onUpdateAllSections: (sections: EbookSection[]) => void;
}

type AssistOp =
    | "improve-text"
    | "suggest-layout"
    | "add-stats"
    | "rewrite-pullquote"
    | "add-callout"
    | "expand"
    | "shorten";

const OPS: { id: AssistOp; icon: string; label: string; description: string }[] = [
    { id: "improve-text", icon: "✨", label: "Improve Text", description: "Rewrite for clarity, punch, and flow" },
    { id: "expand", icon: "📖", label: "Expand", description: "Add more depth and examples" },
    { id: "shorten", icon: "✂️", label: "Shorten", description: "Cut to the most essential points" },
    { id: "rewrite-pullquote", icon: "💬", label: "New Pull Quote", description: "Generate a better pull quote" },
    { id: "add-callout", icon: "💡", label: "Add Callout", description: "Insert an actionable tip or insight" },
    { id: "add-stats", icon: "📊", label: "Add Stats", description: "Research and insert real statistics" },
    { id: "suggest-layout", icon: "🎨", label: "Smart Layout", description: "Re-run layout engine on all sections" },
];

export function AIAssistPanel({
    section,
    sectionIndex,
    allSections,
    config,
    ebookTitle,
    onUpdateSection,
    onUpdateAllSections,
}: AIAssistProps) {
    const [loading, setLoading] = useState<AssistOp | null>(null);
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runAssist = useCallback(async (op: AssistOp) => {
        setLoading(op);
        setError(null);
        setLastResult(null);

        try {
            // ── Smart Layout: no API call needed ──────────────────────────────
            if (op === "suggest-layout") {
                const rebalanced = applySmartLayoutPipeline(allSections);
                onUpdateAllSections(rebalanced);
                setLastResult("✓ Smart Layout applied to all sections");
                return;
            }

            // ── All other ops: call Claude via API ────────────────────────────
            const promptMap: Record<Exclude<AssistOp, "suggest-layout">, string> = {
                "improve-text": `Rewrite the following section content for clarity, authority, and reader engagement. Keep the same core information but make it more punchy and specific. Return ONLY the improved text (no JSON, no preamble):\n\nSection: "${section.title}"\n\n${section.content}`,
                expand: `Expand this section with more depth, concrete examples, and actionable detail. Target 280–350 words. Return ONLY the expanded text:\n\nSection: "${section.title}"\n\n${section.content}`,
                shorten: `Shorten this section to its most essential points in 120–170 words. Keep the most impactful ideas. Return ONLY the shortened text:\n\nSection: "${section.title}"\n\n${section.content}`,
                "rewrite-pullquote": `Write 3 alternative pull quotes for this section — punchy, quotable, max 20 words each. Number them 1-3. Return ONLY the 3 options:\n\nSection: "${section.title}"\n${section.content.slice(0, 400)}`,
                "add-callout": `Write an actionable callout tip for this section. It should be specific, practical, and 1–2 sentences. Return ONLY the callout text (no label, no JSON):.\n\nSection: "${section.title}"\n${section.content.slice(0, 300)}`,
                "add-stats": `Find or generate 2–3 realistic, specific statistics relevant to: "${section.title}" (part of ebook: "${ebookTitle}"). Each stat should have a label and specific value (e.g. "67%", "$2.4M"). Return JSON array: [{"label":"...","value":"..."}]`,
            };

            const res = await fetch("/api/magic-wand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: promptMap[op as Exclude<AssistOp, "suggest-layout">],
                    maxTokens: 600,
                }),
            });

            if (!res.ok) throw new Error("AI request failed");
            const { result } = await res.json();

            // ── Apply results based on op ─────────────────────────────────────
            if (op === "improve-text" || op === "expand" || op === "shorten") {
                onUpdateSection(sectionIndex, { ...section, content: result.trim() });
                setLastResult("✓ Content updated");
            } else if (op === "rewrite-pullquote") {
                setLastResult(result.trim()); // Show options, don't auto-apply
            } else if (op === "add-callout") {
                onUpdateSection(sectionIndex, {
                    ...section,
                    callout: { type: "tip", text: result.trim() },
                });
                setLastResult("✓ Callout added");
            } else if (op === "add-stats") {
                try {
                    const jsonMatch = result.match(/\[[\s\S]*\]/);
                    if (!jsonMatch) throw new Error("No JSON found");
                    const stats = JSON.parse(jsonMatch[0]);
                    onUpdateSection(sectionIndex, { ...section, stats });
                    setLastResult(`✓ Added ${stats.length} stat${stats.length !== 1 ? "s" : ""}`);
                } catch {
                    setLastResult(result); // Show raw result if can't parse
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(null);
        }
    }, [section, sectionIndex, allSections, ebookTitle, onUpdateSection, onUpdateAllSections]);

    const contentType = detectContentType(section, sectionIndex, allSections.length);

    return (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: config.colors.accent + "25" }}>
            {/* Header */}
            <div
                className="px-4 py-3 border-b"
                style={{ background: `linear-gradient(135deg, ${config.colors.primary}12, ${config.colors.accent}08)`, borderColor: config.colors.accent + "20" }}
            >
                <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: config.colors.primary }}>
                    <span>✦</span> AI Assist
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: config.colors.secondary }}>
                    Editing: <span className="font-semibold">{section.title}</span>
                    <span className="ml-1.5 opacity-60">· {contentType}</span>
                </p>
            </div>

            {/* Op buttons */}
            <div className="p-3 space-y-1.5">
                {OPS.map(op => (
                    <button
                        key={op.id}
                        onClick={() => runAssist(op.id)}
                        disabled={loading !== null}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all group"
                        style={{
                            backgroundColor: loading === op.id ? config.colors.accent + "12" : "white",
                            borderColor: loading === op.id ? config.colors.accent : config.colors.accent + "20",
                            opacity: loading && loading !== op.id ? 0.5 : 1,
                        }}
                    >
                        <span className="text-base w-6 flex-shrink-0">{loading === op.id ? "⏳" : op.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold" style={{ color: config.colors.primary }}>
                                {loading === op.id ? "Working..." : op.label}
                            </p>
                            <p className="text-[10px] truncate" style={{ color: config.colors.secondary }}>
                                {op.description}
                            </p>
                        </div>
                        <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: config.colors.accent, color: "white" }}
                        >
                            Run
                        </span>
                    </button>
                ))}
            </div>

            {/* Result display */}
            {(lastResult || error) && (
                <div
                    className="mx-3 mb-3 rounded-xl p-3 text-xs"
                    style={{
                        backgroundColor: error ? "#fef2f2" : config.colors.accent + "10",
                        borderLeft: `3px solid ${error ? "#ef4444" : config.colors.accent}`,
                    }}
                >
                    <p className="font-semibold mb-1" style={{ color: error ? "#dc2626" : config.colors.primary }}>
                        {error ? "⚠️ Error" : "Result"}
                    </p>
                    <p className="leading-relaxed whitespace-pre-wrap" style={{ color: error ? "#991b1b" : config.colors.text }}>
                        {error || lastResult}
                    </p>
                    {!error && lastResult && !lastResult.startsWith("✓") && (
                        <p className="mt-2 text-[10px] opacity-60" style={{ color: config.colors.secondary }}>
                            (Review above — click ops to apply automatically or copy the text)
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
