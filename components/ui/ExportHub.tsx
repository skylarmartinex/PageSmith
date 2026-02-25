"use client";

import { useState } from "react";
import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { downloadHTML } from "@/lib/export/html";
import { downloadMarkdown } from "@/lib/export/markdown";

interface ExportHubProps {
    content: EbookContent & { coverImageKeyword?: string };
    config: TemplateConfig;
    selectedTemplate: string;
    brandConfig?: { logoUrl?: string };
    /** Called when PPTX export is requested (handled by parent) */
    onExportPPTX: () => void;
    exportingPPTX: boolean;
}

type ExportFormat = "pdf" | "pptx" | "epub" | "html" | "markdown";

interface FormatDef {
    id: ExportFormat;
    icon: string;
    label: string;
    description: string;
    badge?: string;
}

const FORMATS: FormatDef[] = [
    {
        id: "pdf",
        icon: "📄",
        label: "PDF",
        description: "Print-ready, share anywhere",
        badge: "Popular",
    },
    {
        id: "pptx",
        icon: "📊",
        label: "PowerPoint",
        description: "Edit in Keynote or Slides",
    },
    {
        id: "epub",
        icon: "📚",
        label: "EPUB",
        description: "Kindle, Apple Books, Kobo",
        badge: "New",
    },
    {
        id: "html",
        icon: "🌐",
        label: "HTML",
        description: "Self-contained webpage",
        badge: "New",
    },
    {
        id: "markdown",
        icon: "✍️",
        label: "Markdown",
        description: "Blog post, Notion, Obsidian",
        badge: "New",
    },
];

export function ExportHub({
    content,
    config,
    selectedTemplate,
    brandConfig,
    onExportPPTX,
    exportingPPTX,
}: ExportHubProps) {
    const [exporting, setExporting] = useState<ExportFormat | null>(null);
    const [lastExported, setLastExported] = useState<ExportFormat | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async (format: ExportFormat) => {
        if (exporting) return;
        setError(null);
        setExporting(format);

        try {
            switch (format) {
                // ── PDF ──────────────────────────────────────────────────────────
                case "pdf": {
                    const res = await fetch("/api/export", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content, templateId: selectedTemplate }),
                    });
                    if (!res.ok) throw new Error("PDF export failed");
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    break;
                }

                // ── PPTX ─────────────────────────────────────────────────────────
                case "pptx": {
                    onExportPPTX();
                    break;
                }

                // ── EPUB ─────────────────────────────────────────────────────────
                case "epub": {
                    const res = await fetch("/api/export/epub", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            content,
                            colors: config.colors,
                            fontFamily: config.fontFamily,
                        }),
                    });
                    if (!res.ok) throw new Error("EPUB export failed");
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}.epub`;
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    break;
                }

                // ── HTML ─────────────────────────────────────────────────────────
                case "html": {
                    downloadHTML(content as Parameters<typeof downloadHTML>[0], config.colors, config.fontFamily);
                    break;
                }

                // ── Markdown ─────────────────────────────────────────────────────
                case "markdown": {
                    downloadMarkdown(content as Parameters<typeof downloadMarkdown>[0]);
                    break;
                }
            }

            setLastExported(format);
            // Reset success indicator after 3s
            setTimeout(() => setLastExported(null), 3000);
        } catch (err) {
            console.error(`${format} export failed:`, err);
            setError(`${format.toUpperCase()} export failed. Please try again.`);
        } finally {
            if (format !== "pptx") setExporting(null);
            else setExporting(null);
        }
    };

    return (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: config.colors.accent + "25" }}>
            {/* Header */}
            <div
                className="px-4 py-3 border-b"
                style={{
                    background: `linear-gradient(135deg, ${config.colors.primary}10, ${config.colors.accent}08)`,
                    borderColor: config.colors.accent + "20",
                }}
            >
                <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: config.colors.primary }}>
                    <span>⬇</span> Export
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: config.colors.secondary }}>
                    Download in 5 formats
                </p>
            </div>

            {/* Format buttons */}
            <div className="p-3 space-y-2">
                {FORMATS.map((fmt) => {
                    const isLoading = exporting === fmt.id || (fmt.id === "pptx" && exportingPPTX);
                    const isDone = lastExported === fmt.id;

                    return (
                        <button
                            key={fmt.id}
                            onClick={() => handleExport(fmt.id)}
                            disabled={!!exporting || exportingPPTX}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all group"
                            style={{
                                backgroundColor: isDone
                                    ? "#16a34a10"
                                    : isLoading
                                        ? config.colors.primary + "10"
                                        : "white",
                                borderColor: isDone
                                    ? "#16a34a"
                                    : isLoading
                                        ? config.colors.primary
                                        : config.colors.accent + "20",
                                opacity: exporting && !isLoading ? 0.5 : 1,
                                cursor: exporting ? "wait" : "pointer",
                            }}
                        >
                            {/* Icon */}
                            <span className="text-xl w-8 flex-shrink-0 text-center">
                                {isLoading ? (
                                    <span className="inline-block animate-spin text-sm">⏳</span>
                                ) : isDone ? (
                                    "✅"
                                ) : (
                                    fmt.icon
                                )}
                            </span>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p
                                        className="text-xs font-bold"
                                        style={{ color: isDone ? "#16a34a" : config.colors.primary }}
                                    >
                                        {isLoading
                                            ? `Exporting ${fmt.label}...`
                                            : isDone
                                                ? `${fmt.label} Downloaded!`
                                                : fmt.label}
                                    </p>
                                    {fmt.badge && !isLoading && !isDone && (
                                        <span
                                            className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                            style={{
                                                backgroundColor:
                                                    fmt.badge === "New"
                                                        ? config.colors.accent + "20"
                                                        : config.colors.primary + "15",
                                                color: fmt.badge === "New" ? config.colors.accent : config.colors.primary,
                                            }}
                                        >
                                            {fmt.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] truncate" style={{ color: config.colors.secondary }}>
                                    {fmt.description}
                                </p>
                            </div>

                            {/* Arrow on hover */}
                            {!isLoading && !isDone && (
                                <span
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                    style={{ color: config.colors.accent }}
                                >
                                    ↓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Error display */}
            {error && (
                <div className="mx-3 mb-3 rounded-xl px-3 py-2 bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                </div>
            )}

            {/* Share hint */}
            <div className="border-t px-4 py-2.5" style={{ borderColor: config.colors.accent + "15" }}>
                <p className="text-[10px]" style={{ color: config.colors.secondary }}>
                    🔗 Use <span className="font-semibold">Share Ebook</span> to get a public link
                </p>
            </div>
        </div>
    );
}
