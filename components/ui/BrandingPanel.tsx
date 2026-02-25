"use client";

import { useState, useEffect, useRef } from "react";
import { BrandConfig, BrandPreset, DEFAULT_BRAND } from "@/lib/templates/types";
import { GOOGLE_FONTS, loadGoogleFont } from "@/lib/fonts/googleFonts";

const STORAGE_KEY = "pagesmith_brand_presets";
const ACTIVE_KEY = "pagesmith_active_brand";

interface BrandingPanelProps {
    brand: BrandConfig;
    onChange: (brand: BrandConfig) => void;
    topic?: string;
    selectedTemplate?: string;
}

export function BrandingPanel({ brand, onChange, topic, selectedTemplate }: BrandingPanelProps) {
    const [presets, setPresets] = useState<BrandPreset[]>([]);
    const [presetName, setPresetName] = useState("");
    const [showSaveInput, setShowSaveInput] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [magicLoading, setMagicLoading] = useState(false);
    const [magicRationale, setMagicRationale] = useState("");
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleMagicWand = async () => {
        if (!topic?.trim()) return;
        setMagicLoading(true);
        setMagicRationale("");
        try {
            const res = await fetch("/api/magic-wand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, templateId: selectedTemplate }),
            });
            if (!res.ok) throw new Error("Magic wand failed");
            const suggestion = await res.json();
            const next: BrandConfig = {
                primaryColor: suggestion.primaryColor,
                secondaryColor: suggestion.secondaryColor,
                accentColor: suggestion.accentColor,
                backgroundColor: suggestion.backgroundColor,
                textColor: suggestion.textColor,
                fontFamily: suggestion.fontFamily || "",
                logoUrl: brand.logoUrl,
            };
            if (next.fontFamily) {
                const font = GOOGLE_FONTS.find((f) => f.value === next.fontFamily);
                if (font) loadGoogleFont(font.importUrl);
            }
            onChange(next);
            setMagicRationale(suggestion.rationale || "");
            setTimeout(() => setMagicRationale(""), 6000);
        } catch (err) {
            console.error("Magic wand error:", err);
        } finally {
            setMagicLoading(false);
        }
    };

    // Load presets from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setPresets(JSON.parse(stored));
            const activeBrand = localStorage.getItem(ACTIVE_KEY);
            if (activeBrand) onChange(JSON.parse(activeBrand));
        } catch { }
    }, []);

    // Persist active brand on change
    useEffect(() => {
        try {
            localStorage.setItem(ACTIVE_KEY, JSON.stringify(brand));
        } catch { }
    }, [brand]);

    const update = (key: keyof BrandConfig, value: string) => {
        const next = { ...brand, [key]: value };
        if (key === "fontFamily" && value) {
            const font = GOOGLE_FONTS.find((f) => f.value === value);
            if (font) loadGoogleFont(font.importUrl);
        }
        onChange(next);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            update("logoUrl", reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const savePreset = () => {
        if (!presetName.trim()) return;
        const updated = [
            ...presets.filter((p) => p.name !== presetName.trim()),
            { name: presetName.trim(), config: brand },
        ];
        setPresets(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setPresetName("");
        setShowSaveInput(false);
    };

    const loadPreset = (name: string) => {
        const preset = presets.find((p) => p.name === name);
        if (!preset) return;
        if (preset.config.fontFamily) {
            const font = GOOGLE_FONTS.find((f) => f.value === preset.config.fontFamily);
            if (font) loadGoogleFont(font.importUrl);
        }
        onChange(preset.config);
    };

    const deletePreset = (name: string) => {
        const updated = presets.filter((p) => p.name !== name);
        setPresets(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const reset = () => {
        onChange(DEFAULT_BRAND);
        localStorage.removeItem(ACTIVE_KEY);
    };

    const colorFields: { key: keyof BrandConfig; label: string }[] = [
        { key: "primaryColor", label: "Primary" },
        { key: "secondaryColor", label: "Secondary" },
        { key: "accentColor", label: "Accent" },
        { key: "backgroundColor", label: "Background" },
        { key: "textColor", label: "Text" },
    ];

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span>🎨</span> Brand Settings
                </span>
                <span className="text-gray-500 text-xs">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <div className="p-4 space-y-5 bg-white">

                    {/* Magic Wand */}
                    <button
                        onClick={handleMagicWand}
                        disabled={magicLoading || !topic?.trim()}
                        title={!topic?.trim() ? "Enter a topic first" : "AI-generated brand palette"}
                        className="w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                        style={{
                            background: magicLoading || !topic?.trim() ? undefined : "linear-gradient(135deg, #7c3aed, #db2777)",
                            backgroundColor: magicLoading || !topic?.trim() ? "#f3f4f6" : undefined,
                            color: magicLoading || !topic?.trim() ? "#9ca3af" : "#ffffff",
                        }}
                    >
                        <span>{magicLoading ? "✨" : "✨"}</span>
                        {magicLoading ? "Generating palette…" : "Magic Wand — AI Brand"}
                    </button>
                    {magicRationale && (
                        <p className="text-xs text-purple-600 bg-purple-50 rounded-lg px-3 py-2 italic">
                            {magicRationale}
                        </p>
                    )}

                    {/* Color Pickers */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Colors</p>
                        <div className="grid grid-cols-5 gap-2">
                            {colorFields.map(({ key, label }) => (
                                <div key={key} className="flex flex-col items-center gap-1">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                                        <input
                                            type="color"
                                            value={(brand[key] as string) || "#888888"}
                                            onChange={(e) => update(key, e.target.value)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            title={label}
                                        />
                                        <div
                                            className="w-full h-full"
                                            style={{ backgroundColor: (brand[key] as string) || "#e5e7eb" }}
                                        />
                                    </div>
                                    <span className="text-[9px] text-gray-500 leading-none">{label}</span>
                                    {/* Hex text input */}
                                    <input
                                        type="text"
                                        value={(brand[key] as string) || ""}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update(key, v);
                                        }}
                                        maxLength={7}
                                        placeholder="#hex"
                                        className="w-full text-[9px] text-center border border-gray-200 rounded px-0.5 py-0.5 bg-transparent text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Font Selector + AI Pairing */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Font</p>
                        <div className="flex gap-2">
                            <select
                                value={brand.fontFamily}
                                onChange={(e) => update("fontFamily", e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">— Template Default —</option>
                                {GOOGLE_FONTS.map((font) => (
                                    <option key={font.value} value={font.value}>
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                            {topic && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await fetch("/api/font-pairing", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ topic }),
                                            });
                                            if (!res.ok) throw new Error();
                                            const data = await res.json();
                                            update("fontFamily", data.fontFamily);
                                        } catch { /* silent fallback */ }
                                    }}
                                    className="px-3 py-2 rounded-lg text-xs font-bold border border-purple-200 text-purple-600 hover:bg-purple-50 transition-all flex-shrink-0"
                                    title="AI picks the best font pair for your topic"
                                >
                                    ✨ AI Font
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Logo</p>
                        {brand.logoUrl ? (
                            <div className="flex items-center gap-3">
                                <img
                                    src={brand.logoUrl}
                                    alt="Brand logo"
                                    className="h-12 w-auto rounded border border-gray-200 object-contain bg-gray-50 p-1"
                                />
                                <button
                                    onClick={() => update("logoUrl", "")}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => logoInputRef.current?.click()}
                                className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
                            >
                                + Upload Logo (PNG, JPG, SVG)
                            </button>
                        )}
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Brand Presets */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Presets</p>

                        {presets.length > 0 && (
                            <div className="space-y-1 mb-3">
                                {presets.map((preset) => (
                                    <div key={preset.name} className="flex items-center gap-2">
                                        <button
                                            onClick={() => loadPreset(preset.name)}
                                            className="flex-1 text-left text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 transition-colors"
                                        >
                                            {preset.name}
                                        </button>
                                        <button
                                            onClick={() => deletePreset(preset.name)}
                                            className="text-gray-400 hover:text-red-500 text-xs px-1"
                                            title="Delete preset"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showSaveInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={presetName}
                                    onChange={(e) => setPresetName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && savePreset()}
                                    placeholder="Preset name..."
                                    autoFocus
                                    className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={savePreset}
                                    className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowSaveInput(false)}
                                    className="text-sm px-2 py-1.5 text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowSaveInput(true)}
                                    className="flex-1 text-sm py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Save Preset
                                </button>
                                <button
                                    onClick={reset}
                                    className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors"
                                    title="Reset to template defaults"
                                >
                                    Reset
                                </button>
                            </div>
                        )}

                        {/* Brand Voice */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                ✍️ Brand Voice
                                <span className="text-gray-400 font-normal ml-1">(optional)</span>
                            </label>
                            <textarea
                                value={brand.brandVoice || ""}
                                onChange={(e) => onChange({ ...brand, brandVoice: e.target.value })}
                                placeholder="Paste 2-5 sentences written in your brand voice. Claude will match your style throughout the ebook."
                                rows={3}
                                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        {/* Target Persona */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                🎯 Write for
                            </label>
                            <select
                                value={brand.targetPersona || ""}
                                onChange={(e) => onChange({ ...brand, targetPersona: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">General audience</option>
                                <option value="C-suite executives (CEO, CFO, COO)">C-suite executives</option>
                                <option value="small business owners and solopreneurs">Small business owners</option>
                                <option value="marketing professionals and growth teams">Marketing professionals</option>
                                <option value="software engineers and technical teams">Software engineers</option>
                                <option value="sales professionals and account executives">Sales professionals</option>
                                <option value="HR and people operations leaders">HR & People Ops</option>
                                <option value="entrepreneurs and startup founders">Startup founders</option>
                                <option value="general consumers learning for personal growth">Personal growth readers</option>
                            </select>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
