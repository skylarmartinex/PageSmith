import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface BoldTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function BoldTemplate({ content, config }: BoldTemplateProps) {
    return (
        <div
            className="max-w-4xl mx-auto min-h-screen"
            style={{ backgroundColor: "#0a0a0a", fontFamily: config.fontFamily }}
        >
            {/* Cover */}
            <div
                className="p-12 py-24 text-center relative overflow-hidden"
                style={{ backgroundColor: config.colors.primary }}
            >
                {config.logoUrl && (
                    <div className="mb-8 flex justify-center">
                        <img src={config.logoUrl} alt="Brand logo" className="h-14 w-auto object-contain opacity-90" />
                    </div>
                )}
                <div
                    className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, ${config.colors.accent} 0, ${config.colors.accent} 1px, transparent 0, transparent 50%)`,
                        backgroundSize: "12px 12px",
                    }}
                />
                <div className="relative">
                    <h1
                        className="text-7xl font-black uppercase tracking-tighter leading-none mb-6"
                        style={{ color: "#ffffff" }}
                    >
                        {content.title}
                    </h1>
                    <div
                        className="inline-block px-4 py-1 text-sm font-bold uppercase tracking-widest"
                        style={{ backgroundColor: config.colors.accent, color: "#ffffff" }}
                    >
                        Essential Guide
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="p-10 space-y-12">
                {content.sections.map((section, index) => (
                    <div key={index} className="border-l-4 pl-8" style={{ borderColor: config.colors.accent }}>
                        <div className="flex items-baseline gap-4 mb-4">
                            <span
                                className="text-5xl font-black leading-none"
                                style={{ color: config.colors.primary, opacity: 0.4 }}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <h2
                                className="text-3xl font-black uppercase tracking-tight"
                                style={{ color: "#ffffff" }}
                            >
                                {section.title}
                            </h2>
                        </div>

                        <div className="space-y-4 text-lg leading-relaxed" style={{ color: "#b0b0b0" }}>
                            {section.content.split("\n").map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>

                        {section.image && (
                            <div className="mt-6">
                                <img
                                    src={section.image.url}
                                    alt={section.image.alt}
                                    className="w-full rounded"
                                    style={{ filter: "contrast(1.1) brightness(0.85)" }}
                                />
                                <p className="text-xs mt-2" style={{ color: "#666" }}>{section.image.attribution}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
