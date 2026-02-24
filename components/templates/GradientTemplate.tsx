import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface GradientTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function GradientTemplate({ content, config }: GradientTemplateProps) {
    const grad = `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.accent} 100%)`;

    return (
        <div
            className="max-w-4xl mx-auto min-h-screen"
            style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily }}
        >
            {/* Full-bleed gradient cover */}
            <div className="p-12 py-28 text-center" style={{ background: grad }}>
                {config.logoUrl && (
                    <div className="mb-8 flex justify-center">
                        <img src={config.logoUrl} alt="Brand logo" className="h-14 w-auto object-contain opacity-90" />
                    </div>
                )}
                <h1 className="text-6xl font-black text-white mb-4 leading-tight">
                    {content.title}
                </h1>
                <p className="text-white/70 text-lg font-medium tracking-wide uppercase">
                    Complete Guide
                </p>
            </div>

            {/* Alternating gradient-accent sections */}
            <div className="space-y-0">
                {content.sections.map((section, index) => {
                    const isAccent = index % 3 === 2;
                    return (
                        <div
                            key={index}
                            className="p-12"
                            style={{
                                background: isAccent ? grad : "transparent",
                                color: isAccent ? "#ffffff" : config.colors.text,
                            }}
                        >
                            <div className="max-w-2xl">
                                {/* Section pill */}
                                <div
                                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                                    style={{
                                        backgroundColor: isAccent ? "rgba(255,255,255,0.2)" : config.colors.primary + "18",
                                        color: isAccent ? "#ffffff" : config.colors.primary,
                                    }}
                                >
                                    Part {index + 1}
                                </div>
                                <h2
                                    className="text-4xl font-black mb-6 leading-tight"
                                    style={{ color: isAccent ? "#ffffff" : config.colors.primary }}
                                >
                                    {section.title}
                                </h2>
                                <div className="space-y-4 text-lg leading-relaxed">
                                    {section.content.split("\n").map((p, i) => (
                                        <p key={i} style={{ color: isAccent ? "rgba(255,255,255,0.85)" : config.colors.text }}>{p}</p>
                                    ))}
                                </div>
                                {section.image && (
                                    <div className="mt-8 rounded-2xl overflow-hidden shadow-xl">
                                        <img src={section.image.url} alt={section.image.alt} className="w-full" />
                                        <p className="text-xs mt-2 px-1" style={{ color: isAccent ? "rgba(255,255,255,0.6)" : config.colors.secondary }}>
                                            {section.image.attribution}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
