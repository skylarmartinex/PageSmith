import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface WarmTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function WarmTemplate({ content, config }: WarmTemplateProps) {
    return (
        <div className="max-w-3xl mx-auto min-h-screen" style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily, color: config.colors.text }}>
            {/* Cover */}
            <div className="relative px-12 py-20 text-center rounded-b-[3rem] overflow-hidden" style={{ backgroundColor: config.colors.primary + "18", minHeight: "340px" }}>
                {content.coverImage && (
                    <>
                        <img src={content.coverImage.url} alt={content.coverImage.alt} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.15) saturate(0.6)" }} />
                        <div className="absolute inset-0 rounded-b-[3rem]" style={{ backgroundColor: config.colors.primary + "25" }} />
                    </>
                )}
                <div className="relative">
                    {config.logoUrl && (
                        <div className="mb-8 flex justify-center">
                            <img src={config.logoUrl} alt="Brand logo" className="h-12 w-auto object-contain rounded-xl" />
                        </div>
                    )}
                    <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center text-3xl" style={{ backgroundColor: config.colors.accent + "30" }}>
                        🌿
                    </div>
                    <h1 className="text-4xl font-bold leading-snug mb-4" style={{ color: config.colors.primary }}>{content.title}</h1>
                    {content.subtitle && <p className="text-lg italic mb-2" style={{ color: config.colors.secondary }}>{content.subtitle}</p>}
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: config.colors.accent, opacity: 0.3 + i * 0.23 }} />
                        ))}
                    </div>
                    {content.author && <p className="mt-4 text-sm" style={{ color: config.colors.secondary }}>by {content.author}</p>}
                </div>
            </div>

            <TableOfContents content={content} config={config} />

            {content.sections.map((section, index) => (
                <SectionRenderer key={index} section={section} config={config} index={index} />
            ))}
        </div>
    );
}
