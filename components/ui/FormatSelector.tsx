"use client";

import { useState } from "react";
import { FORMAT_PRESET_LIST, FormatPreset } from "@/lib/formats/presets";

interface FormatSelectorProps {
    value: string;
    onChange: (presetId: string, preset: FormatPreset) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
    const [open, setOpen] = useState(false);
    const selected = FORMAT_PRESET_LIST.find((p) => p.id === value) ?? FORMAT_PRESET_LIST[0];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-xl text-sm font-medium bg-white hover:bg-gray-50 transition-all"
                style={{ color: "#374151" }}
            >
                <span>{selected.icon}</span>
                <span>{selected.label}</span>
                <span className="text-gray-400 text-xs ml-1">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute left-0 top-full mt-1.5 z-50 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content Format</p>
                        </div>
                        <div className="p-1.5 max-h-80 overflow-y-auto">
                            {FORMAT_PRESET_LIST.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => {
                                        onChange(preset.id, preset);
                                        setOpen(false);
                                    }}
                                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-gray-50 group"
                                    style={{
                                        backgroundColor: value === preset.id ? "#eff6ff" : "transparent",
                                    }}
                                >
                                    <span className="text-xl mt-0.5 flex-shrink-0">{preset.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-gray-800">{preset.label}</p>
                                            {value === preset.id && (
                                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{preset.description}</p>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span className="text-[9px] text-gray-400">{preset.sections} sections</span>
                                            <span className="text-gray-300">·</span>
                                            {preset.exportFormats.map((fmt) => (
                                                <span
                                                    key={fmt}
                                                    className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500"
                                                >
                                                    {fmt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
