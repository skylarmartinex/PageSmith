"use client";

interface EbookSection {
    title: string;
    content: string;
    imageKeywords: string[];
    image?: {
        url: string;
        thumb: string;
        alt: string;
        attribution: string;
    };
}

interface GeneratedContent {
    title: string;
    sections: EbookSection[];
}

interface EditPanelProps {
    content: GeneratedContent;
    onChange: (content: GeneratedContent) => void;
}

export function EditPanel({ content, onChange }: EditPanelProps) {
    const updateTitle = (val: string) => {
        onChange({ ...content, title: val });
    };

    const updateSection = (index: number, field: "title" | "content", val: string) => {
        const updated = content.sections.map((s, i) =>
            i === index ? { ...s, [field]: val } : s
        );
        onChange({ ...content, sections: updated });
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-amber-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span>✏️</span> Edit Content
                </p>
            </div>

            <div className="p-4 space-y-5 bg-white max-h-96 overflow-y-auto">
                {/* Title */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                        Ebook Title
                    </label>
                    <input
                        type="text"
                        value={content.title}
                        onChange={(e) => updateTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Sections */}
                {content.sections.map((section, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                                style={{ backgroundColor: "#6b7280" }}
                            >
                                {i + 1}
                            </span>
                            <input
                                type="text"
                                value={section.title}
                                onChange={(e) => updateSection(i, "title", e.target.value)}
                                className="w-full px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Section ${i + 1} title`}
                            />
                        </div>
                        <textarea
                            value={section.content}
                            onChange={(e) => updateSection(i, "content", e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Section content..."
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
