"use client";

import { useState, useRef } from "react";
import { SectionLayout } from "@/lib/templates/types";

interface Section {
    title: string;
    content: string;
    layoutType?: SectionLayout;
    [key: string]: unknown;
}

interface SectionManagerProps {
    sections: Section[];
    onChange: (sections: Section[]) => void;
    config: { colors: { primary: string; accent: string; secondary: string; background: string; text: string } };
}

const LAYOUTS: { id: SectionLayout; label: string; icon: string }[] = [
    { id: "image-right", label: "Image Right", icon: "▣" },
    { id: "image-left", label: "Image Left", icon: "◧" },
    { id: "image-full", label: "Image Full", icon: "⬛" },
    { id: "image-grid", label: "Image Grid", icon: "⊞" },
    { id: "image-overlay", label: "Overlay", icon: "◈" },
    { id: "text-only", label: "Text Only", icon: "☰" },
];

export function SectionManager({ sections, onChange, config }: SectionManagerProps) {
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [overIdx, setOverIdx] = useState<number | null>(null);
    const [layoutPickerIdx, setLayoutPickerIdx] = useState<number | null>(null);
    const dragNode = useRef<number | null>(null);

    /* ── Drag handlers ─────────────────────────────── */
    const handleDragStart = (i: number) => {
        dragNode.current = i;
        setTimeout(() => setDragIdx(i), 0);
    };

    const handleDragEnter = (i: number) => {
        if (dragNode.current === i) return;
        setOverIdx(i);
    };

    const handleDrop = () => {
        if (dragNode.current === null || overIdx === null || dragNode.current === overIdx) {
            reset(); return;
        }
        const updated = [...sections];
        const [moved] = updated.splice(dragNode.current, 1);
        updated.splice(overIdx, 0, moved);
        onChange(updated);
        reset();
    };

    const reset = () => { setDragIdx(null); setOverIdx(null); dragNode.current = null; };

    /* ── Layout override ────────────────────────────── */
    const setLayout = (idx: number, layout: SectionLayout) => {
        const updated = sections.map((s, i) => i === idx ? { ...s, layoutType: layout } : s);
        onChange(updated);
        setLayoutPickerIdx(null);
    };

    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3" style={{ color: config.colors.text }}>
                Sections — drag to reorder
            </p>
            {sections.map((section, i) => {
                const isDragging = dragIdx === i;
                const isOver = overIdx === i;
                return (
                    <div
                        key={i}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragEnter={() => handleDragEnter(i)}
                        onDragEnd={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="relative rounded-xl border transition-all cursor-grab active:cursor-grabbing"
                        style={{
                            opacity: isDragging ? 0.4 : 1,
                            borderColor: isOver ? config.colors.accent : config.colors.accent + "25",
                            backgroundColor: isOver ? config.colors.accent + "08" : config.colors.background,
                            transform: isOver ? "scale(1.01)" : "scale(1)",
                        }}
                    >
                        <div className="flex items-center gap-2 px-3 py-2.5">
                            {/* Drag handle */}
                            <span className="text-gray-300 text-sm select-none flex-shrink-0">⠿</span>

                            {/* Section number + title */}
                            <span
                                className="text-[10px] font-black w-5 flex-shrink-0 tabular-nums"
                                style={{ color: config.colors.accent }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 text-xs font-medium truncate" style={{ color: config.colors.text }}>
                                {section.title}
                            </span>

                            {/* Layout badge + picker toggle */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setLayoutPickerIdx(layoutPickerIdx === i ? null : i); }}
                                className="flex-shrink-0 text-[9px] px-2 py-1 rounded-lg font-bold uppercase tracking-wide transition-all"
                                style={{
                                    backgroundColor: config.colors.accent + "18",
                                    color: config.colors.accent,
                                }}
                            >
                                {LAYOUTS.find((l) => l.id === (section.layoutType || "image-right"))?.icon || "▣"}
                                {" "}
                                {(section.layoutType || "image-right").replace("image-", "").replace("-", " ")}
                            </button>
                        </div>

                        {/* Layout picker dropdown */}
                        {layoutPickerIdx === i && (
                            <div
                                className="absolute right-0 top-full mt-1 z-50 rounded-xl border shadow-xl p-2 grid grid-cols-3 gap-1 w-52"
                                style={{ backgroundColor: config.colors.background, borderColor: config.colors.accent + "30" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {LAYOUTS.map((layout) => (
                                    <button
                                        key={layout.id}
                                        onClick={() => setLayout(i, layout.id)}
                                        className="flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all hover:scale-105"
                                        style={{
                                            backgroundColor: section.layoutType === layout.id ? config.colors.accent + "20" : "transparent",
                                            border: `1px solid ${section.layoutType === layout.id ? config.colors.accent : "transparent"}`,
                                        }}
                                    >
                                        <span className="text-lg">{layout.icon}</span>
                                        <span className="text-[9px] font-medium leading-tight" style={{ color: config.colors.text }}>
                                            {layout.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
