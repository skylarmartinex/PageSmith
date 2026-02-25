import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface LuxuryTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

// Decorative ornament using SVG
function GoldOrnament({ color }: { color: string }) {
    return (
        <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="10" x2="48" y2="10" stroke={color} strokeWidth="0.8" />
            <circle cx="60" cy="10" r="4" stroke={color} strokeWidth="0.8" />
            <circle cx="60" cy="10" r="1.5" fill={color} />
            <circle cx="52" cy="10" r="1.5" stroke={color} strokeWidth="0.8" />
            <circle cx="68" cy="10" r="1.5" stroke={color} strokeWidth="0.8" />
            <line x1="72" y1="10" x2="120" y2="10" stroke={color} strokeWidth="0.8" />
        </svg>
    );
}

export function LuxuryTemplate({ content, config }: LuxuryTemplateProps) {
    return (
        <div
            className="max-w-3xl mx-auto min-h-screen"
            style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily, color: config.colors.text }}
        >
            {/* Cover */}
            <div
                className="relative overflow-hidden text-center"
                style={{ minHeight: "540px", backgroundColor: config.colors.primary }}
            >
                {content.coverImage && (
                    <>
                        <img
                            src={content.coverImage.url}
                            alt={content.coverImage.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: "brightness(0.18) saturate(0.4)" }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(to bottom, ${config.colors.primary}ee, ${config.colors.primary}cc)` }}
                        />
                    </>
                )}

                {/* Thin top border line */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: config.colors.accent }} />

                {/* Cover content */}
                <div className="relative px-16 pt-16 pb-20 flex flex-col items-center justify-center" style={{ minHeight: "540px" }}>
                    {config.logoUrl && (
                        <img
                            src={config.logoUrl}
                            alt="Logo"
                            className="h-10 w-auto object-contain mb-10 opacity-80"
                            style={{ filter: "brightness(10)" }}
                        />
                    )}

                    {/* Top ornament */}
                    <div className="mb-8">
                        <GoldOrnament color={config.colors.accent} />
                    </div>

                    {/* Pre-title */}
                    <p
                        className="text-xs tracking-[0.5em] uppercase mb-8"
                        style={{ color: config.colors.accent }}
                    >
                        A Definitive Guide
                    </p>

                    <h1
                        className="font-bold italic leading-tight mb-8"
                        style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#ffffff" }}
                    >
                        {content.title}
                    </h1>

                    {/* Bottom ornament */}
                    <div className="mb-8">
                        <GoldOrnament color={config.colors.accent} />
                    </div>

                    {content.subtitle && (
                        <p
                            className="text-sm tracking-widest uppercase mb-6"
                            style={{ color: config.colors.accent + "cc" }}
                        >
                            {content.subtitle}
                        </p>
                    )}

                    {content.author && (
                        <p className="text-sm text-white/50 italic">by {content.author}</p>
                    )}
                </div>

                {/* Thin bottom border line */}
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: config.colors.accent }} />
            </div>

            <TableOfContents content={content} config={config} />

            {content.sections.map((section, index) => (
                <SectionRenderer key={index} section={section} config={config} index={index} />
            ))}

            {/* Colophon */}
            <div className="text-center py-16 px-16">
                <GoldOrnament color={config.colors.accent} />
                {content.author && (
                    <p className="mt-6 text-xs tracking-[0.4em] uppercase" style={{ color: config.colors.secondary }}>
                        {content.author}
                    </p>
                )}
            </div>
        </div>
    );
}
