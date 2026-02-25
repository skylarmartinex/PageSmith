"use client";

import { useState } from "react";
import { TEMPLATES, TemplateConfig } from "@/lib/templates/types";

interface TemplateGalleryProps {
    /** Currently selected template ID */
    selectedTemplate?: string;
    /** Called when user clicks "Use this template" */
    onSelectTemplate?: (id: string) => void;
    /** Show full-screen modal overlay */
    mode?: "modal" | "page";
}

// ─── Colour swatch badge ───────────────────────────────────────────────────
function ColorDots({ colors }: { colors: TemplateConfig["colors"] }) {
    return (
        <div className="flex gap-1.5">
            {[colors.primary, colors.accent, colors.background].map((c, i) => (
                <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: c }}
                    title={c}
                />
            ))}
        </div>
    );
}

// ─── Rich mini-preview card ────────────────────────────────────────────────
function TemplateThumbnail({ config }: { config: TemplateConfig }) {
    const { colors, id } = config;

    // Build a fake "cover" + "body" layout matching the template style
    const Cover = () => {
        if (id === "tech") {
            return (
                <div className="h-20 flex" style={{ backgroundColor: "#0f1117" }}>
                    <div className="w-1" style={{ background: `linear-gradient(180deg,${colors.primary},${colors.accent})` }} />
                    <div className="flex-1 p-2">
                        <div className="flex gap-1 mb-1.5">
                            {["#ef4444", "#eab308", "#22c55e"].map((c, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                        <div className="h-1 w-8 rounded mb-2" style={{ backgroundColor: colors.accent, opacity: 0.7 }} />
                        <div className="h-2 w-20 rounded" style={{ backgroundColor: "#e8e8e8", opacity: 0.8 }} />
                    </div>
                </div>
            );
        }
        if (id === "bold") {
            return (
                <div className="h-20 relative flex items-end px-3 pb-2" style={{ backgroundColor: colors.primary }}>
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `repeating-linear-gradient(45deg, ${colors.accent} 0, ${colors.accent} 1px, transparent 0, transparent 50%)`,
                            backgroundSize: "10px 10px",
                        }}
                    />
                    <div className="h-2.5 w-24 rounded" style={{ backgroundColor: "rgba(255,255,255,0.9)" }} />
                </div>
            );
        }
        if (id === "elegant") {
            return (
                <div className="h-20 flex flex-col items-center justify-center px-3 pb-1" style={{ backgroundColor: colors.background, borderBottom: `1px solid ${colors.accent}40` }}>
                    <div className="flex items-center gap-2 mb-1.5 w-full">
                        <div className="h-px flex-1" style={{ backgroundColor: colors.accent }} />
                        <div className="text-[7px]" style={{ color: colors.accent }}>✦</div>
                        <div className="h-px flex-1" style={{ backgroundColor: colors.accent }} />
                    </div>
                    <div className="h-2 w-20 rounded" style={{ backgroundColor: colors.primary, opacity: 0.8 }} />
                    <div className="flex items-center gap-2 mt-1.5 w-full">
                        <div className="h-px w-6" style={{ backgroundColor: colors.accent }} />
                        <div className="h-1 w-12 rounded" style={{ backgroundColor: colors.secondary, opacity: 0.5 }} />
                        <div className="h-px w-6" style={{ backgroundColor: colors.accent }} />
                    </div>
                </div>
            );
        }
        if (id === "luxury") {
            return (
                <div className="h-20 relative flex flex-col items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.accent }} />
                    <div className="h-1 w-6 rounded mb-2" style={{ backgroundColor: colors.accent, opacity: 0.6 }} />
                    <div className="h-2 w-20 rounded" style={{ backgroundColor: "rgba(255,255,255,0.85)" }} />
                    <div className="h-1 w-12 rounded mt-2" style={{ backgroundColor: colors.accent, opacity: 0.5 }} />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.accent }} />
                </div>
            );
        }
        if (id === "editorial") {
            return (
                <div className="h-20 relative flex items-end px-3 pb-2" style={{ backgroundColor: "#1a1a1a" }}>
                    <div className="absolute top-3 left-3">
                        <div className="w-8 h-0.5 rounded" style={{ backgroundColor: colors.accent }} />
                        <div className="mt-0.5 text-[6px] font-bold text-white/40 uppercase tracking-widest">Essential Guide</div>
                    </div>
                    <div className="h-2.5 w-24 rounded" style={{ backgroundColor: "rgba(255,255,255,0.9)" }} />
                </div>
            );
        }
        if (id === "gradient") {
            return (
                <div className="h-20 flex items-center justify-center" style={{ background: `linear-gradient(135deg,${colors.primary},${colors.accent})` }}>
                    <div className="h-2.5 w-24 rounded" style={{ backgroundColor: "rgba(255,255,255,0.9)" }} />
                </div>
            );
        }
        // Default: professional / minimal / modern / warm
        return (
            <div className="h-20 flex items-end px-3 pb-2" style={{ background: id === "modern" ? `linear-gradient(135deg,${colors.primary},${colors.secondary})` : colors.primary }}>
                <div className="h-2.5 w-24 rounded" style={{ backgroundColor: "rgba(255,255,255,0.9)" }} />
            </div>
        );
    };

    const Body = () => (
        <div className="px-3 pt-2 pb-1 space-y-1.5" style={{ backgroundColor: colors.background }}>
            {/* Fake section heading */}
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: colors.accent + "40" }} />
                <div className="h-1.5 w-16 rounded" style={{ backgroundColor: colors.primary, opacity: 0.7 }} />
            </div>
            {/* Fake body lines */}
            <div className="h-1 w-full rounded" style={{ backgroundColor: colors.text, opacity: 0.2 }} />
            <div className="h-1 w-5/6 rounded" style={{ backgroundColor: colors.text, opacity: 0.15 }} />
            {/* Fake stat block */}
            <div className="flex gap-1.5 pt-0.5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex-1 rounded-lg py-1 flex flex-col items-center" style={{ backgroundColor: colors.primary + "12" }}>
                        <div className="h-1.5 w-5 rounded mb-0.5" style={{ backgroundColor: colors.primary, opacity: 0.7 }} />
                        <div className="h-1 w-6 rounded" style={{ backgroundColor: colors.text, opacity: 0.2 }} />
                    </div>
                ))}
            </div>
            {/* Fake pull quote */}
            <div className="border-l-2 pl-2 py-0.5 mt-0.5" style={{ borderColor: colors.accent }}>
                <div className="h-1 w-4/5 rounded" style={{ backgroundColor: colors.secondary, opacity: 0.4 }} />
            </div>
        </div>
    );

    return (
        <div className="rounded-xl overflow-hidden border border-black/10 shadow-sm" style={{ fontFamily: config.fontFamily }}>
            <Cover />
            <Body />
        </div>
    );
}

// ─── Full Gallery Component ────────────────────────────────────────────────
export function TemplateGallery({ selectedTemplate, onSelectTemplate, mode = "page" }: TemplateGalleryProps) {
    const [hovered, setHovered] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<"all" | "light" | "dark" | "serif">("all");

    const categories: { id: typeof activeCategory; label: string }[] = [
        { id: "all", label: "All Templates" },
        { id: "light", label: "Light" },
        { id: "dark", label: "Dark" },
        { id: "serif", label: "Serif / Classic" },
    ];

    const darkIds = new Set(["bold", "tech", "luxury"]);
    const serifIds = new Set(["elegant", "luxury", "editorial", "warm", "professional"]);

    const filtered = TEMPLATES.filter((t) => {
        if (activeCategory === "dark") return darkIds.has(t.id);
        if (activeCategory === "light") return !darkIds.has(t.id);
        if (activeCategory === "serif") return serifIds.has(t.id);
        return true;
    });

    return (
        <div
            className={mode === "modal" ? "bg-white rounded-2xl shadow-2xl overflow-hidden" : ""}
            style={{ maxWidth: mode === "modal" ? "900px" : undefined }}
        >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Choose a Template</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    {TEMPLATES.length} professional templates — click to apply instantly
                </p>

                {/* Filter tabs */}
                <div className="flex gap-2 mt-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                            style={{
                                backgroundColor: activeCategory === cat.id ? "#1e40af" : "#f3f4f6",
                                color: activeCategory === cat.id ? "white" : "#6b7280",
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto" style={{ maxHeight: mode === "modal" ? "60vh" : undefined }}>
                {filtered.map((template) => {
                    const isSelected = template.id === selectedTemplate;
                    const isHovered = hovered === template.id;

                    return (
                        <div
                            key={template.id}
                            className="group relative cursor-pointer"
                            onMouseEnter={() => setHovered(template.id)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => onSelectTemplate?.(template.id)}
                        >
                            {/* Selection ring */}
                            <div
                                className="absolute -inset-1 rounded-xl transition-all duration-200 pointer-events-none"
                                style={{
                                    boxShadow: isSelected
                                        ? `0 0 0 2px #2563eb, 0 4px 12px rgba(37,99,235,0.25)`
                                        : isHovered
                                            ? `0 0 0 1.5px #d1d5db, 0 4px 10px rgba(0,0,0,0.08)`
                                            : "none",
                                }}
                            />

                            <TemplateThumbnail config={template} />

                            {/* Name + colors */}
                            <div className="mt-2 px-0.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-800">{template.name}</p>
                                    {isSelected && (
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-2">
                                    {template.description}
                                </p>
                                <div className="mt-1.5">
                                    <ColorDots colors={template.colors} />
                                </div>
                            </div>

                            {/* Hover action overlay */}
                            {isHovered && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div
                                        className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur"
                                        style={{ backgroundColor: isSelected ? "#16a34a" : "#1e40af" }}
                                    >
                                        {isSelected ? "✓ Applied" : "Apply Template"}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Trigger button to open gallery as modal ───────────────────────────────
export function TemplateGalleryButton({
    selectedTemplate,
    onSelectTemplate,
}: {
    selectedTemplate: string;
    onSelectTemplate: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const current = TEMPLATES.find((t) => t.id === selectedTemplate);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 border-dashed transition-all hover:border-blue-400 hover:bg-blue-50"
                style={{ borderColor: "#d1d5db" }}
            >
                <div>
                    <p className="text-sm font-semibold text-gray-900 text-left">{current?.name ?? "Select Template"}</p>
                    <p className="text-xs text-gray-400 text-left">{current?.description ?? "Browse all templates"}</p>
                </div>
                <div className="flex gap-1">
                    {current && <ColorDots colors={current.colors} />}
                    <span className="ml-1 text-xs text-gray-400">▾</span>
                </div>
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                    onClick={() => setOpen(false)}
                >
                    <div onClick={(e) => e.stopPropagation()} className="w-full" style={{ maxWidth: "900px" }}>
                        <TemplateGallery
                            mode="modal"
                            selectedTemplate={selectedTemplate}
                            onSelectTemplate={(id) => {
                                onSelectTemplate(id);
                                setOpen(false);
                            }}
                        />
                        <button
                            onClick={() => setOpen(false)}
                            className="mt-3 w-full text-center text-white/60 text-sm hover:text-white transition-colors"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
