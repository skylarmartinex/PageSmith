import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface ElegantTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function ElegantTemplate({ content, config }: ElegantTemplateProps) {
    return (
        <div
            className="max-w-3xl mx-auto min-h-screen px-16 py-20"
            style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily, color: config.colors.text }}
        >
            {/* Cover */}
            <div className="text-center mb-24 pb-16 border-b" style={{ borderColor: config.colors.accent + "40" }}>
                {config.logoUrl && (
                    <div className="mb-10 flex justify-center">
                        <img src={config.logoUrl} alt="Brand logo" className="h-12 w-auto object-contain" />
                    </div>
                )}
                {/* Decorative top rule */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px flex-1" style={{ backgroundColor: config.colors.accent }} />
                    <span className="text-lg" style={{ color: config.colors.accent }}>✦</span>
                    <div className="h-px flex-1" style={{ backgroundColor: config.colors.accent }} />
                </div>
                <h1 className="text-5xl font-bold leading-tight mb-6" style={{ color: config.colors.primary, fontStyle: "italic" }}>
                    {content.title}
                </h1>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-16" style={{ backgroundColor: config.colors.accent }} />
                    <span className="text-sm tracking-[0.3em] uppercase" style={{ color: config.colors.secondary }}>
                        {content.subtitle || "A Complete Guide"}
                    </span>
                    <div className="h-px w-16" style={{ backgroundColor: config.colors.accent }} />
                </div>
                {content.author && (
                    <p className="mt-4 text-sm italic" style={{ color: config.colors.secondary }}>by {content.author}</p>
                )}
            </div>

            {/* Sections */}
            <div className="space-y-16">
                {content.sections.map((section, index) => (
                    <div key={index}>
                        <div className="flex items-center gap-6 mb-6">
                            <span
                                className="text-xs tracking-[0.25em] uppercase font-semibold"
                                style={{ color: config.colors.accent }}
                            >
                                Chapter {index + 1}
                            </span>
                            <div className="h-px flex-1" style={{ backgroundColor: config.colors.accent + "30" }} />
                        </div>
                        <h2 className="text-3xl font-bold mb-6 italic" style={{ color: config.colors.primary }}>
                            {section.title}
                        </h2>
                        <div className="space-y-4 text-lg leading-[1.9]">
                            {section.content.split("\n").map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                        {section.image && (
                            <div className="mt-8">
                                <img src={section.image.url} alt={section.image.alt} className="w-full rounded-sm" />
                                <p className="text-xs text-center mt-3 italic" style={{ color: config.colors.secondary }}>
                                    {section.image.attribution}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer ornament */}
            <div className="mt-24 pt-8 text-center border-t" style={{ borderColor: config.colors.accent + "40" }}>
                <span style={{ color: config.colors.accent }}>✦ ✦ ✦</span>
            </div>
        </div>
    );
}
