import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

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
            <div className="relative overflow-hidden py-28 text-center" style={{ minHeight: "380px" }}>
                {content.coverImage && (
                    <img src={content.coverImage.url} alt={content.coverImage.alt} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.25)" }} />
                )}
                <div className="absolute inset-0" style={{ background: content.coverImage ? `${grad}dd` : grad }} />
                <div className="relative px-12">
                    {config.logoUrl && (
                        <div className="mb-8 flex justify-center">
                            <img src={config.logoUrl} alt="Brand logo" className="h-14 w-auto object-contain opacity-90" />
                        </div>
                    )}
                    <h1 className="text-6xl font-black text-white mb-4 leading-tight">{content.title}</h1>
                    {content.subtitle && <p className="text-white/80 text-xl italic mb-2">{content.subtitle}</p>}
                    <p className="text-white/70 text-lg font-medium tracking-wide uppercase">
                        {content.author ? `by ${content.author}` : "Complete Guide"}
                    </p>
                </div>
            </div>

            <TableOfContents content={content} config={config} />

            {content.sections.map((section, index) => (
                <SectionRenderer key={index} section={section} config={config} index={index} />
            ))}
        </div>
    );
}
