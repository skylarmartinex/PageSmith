import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface WarmTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function WarmTemplate({ content, config }: WarmTemplateProps) {
    return (
        <div
            className="max-w-3xl mx-auto min-h-screen"
            style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily, color: config.colors.text }}
        >
            {/* Cover */}
            <div
                className="px-12 py-20 text-center rounded-b-[3rem]"
                style={{ backgroundColor: config.colors.primary + "18" }}
            >
                {config.logoUrl && (
                    <div className="mb-8 flex justify-center">
                        <img src={config.logoUrl} alt="Brand logo" className="h-12 w-auto object-contain rounded-xl" />
                    </div>
                )}
                {/* Sun/circle accent */}
                <div
                    className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center text-3xl"
                    style={{ backgroundColor: config.colors.accent + "30" }}
                >
                    🌿
                </div>
                <h1
                    className="text-4xl font-bold leading-snug mb-4"
                    style={{ color: config.colors.primary }}
                >
                    {content.title}
                </h1>
                {content.subtitle && (
                    <p className="text-lg italic mb-2" style={{ color: config.colors.secondary }}>{content.subtitle}</p>
                )}
                <div className="flex justify-center gap-2 mt-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: config.colors.accent, opacity: 0.3 + i * 0.23 }}
                        />
                    ))}
                </div>
                {content.author && (
                    <p className="mt-4 text-sm" style={{ color: config.colors.secondary }}>by {content.author}</p>
                )}
            </div>

            {/* Sections */}
            <div className="px-12 py-10 space-y-14">
                {content.sections.map((section, index) => (
                    <div key={index}>
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: config.colors.accent }}
                            >
                                {index + 1}
                            </div>
                            <h2
                                className="text-2xl font-bold"
                                style={{ color: config.colors.primary }}
                            >
                                {section.title}
                            </h2>
                        </div>

                        {section.image && (
                            <div className="mb-6 rounded-2xl overflow-hidden">
                                <img src={section.image.url} alt={section.image.alt} className="w-full" />
                                <p className="text-xs text-center mt-2" style={{ color: config.colors.secondary }}>
                                    {section.image.attribution}
                                </p>
                            </div>
                        )}

                        <div
                            className="space-y-4 text-[17px] leading-[1.85] rounded-2xl p-6"
                            style={{ backgroundColor: config.colors.primary + "08" }}
                        >
                            {section.content.split("\n").map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
