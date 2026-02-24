import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface ElegantTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function ElegantTemplate({ content, config }: ElegantTemplateProps) {
    return (
        <div
            className="max-w-3xl mx-auto min-h-screen"
            style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily, color: config.colors.text }}
        >
            {/* Cover */}
            <div className="text-center px-16 py-20 pb-16 border-b" style={{ borderColor: config.colors.accent + "40" }}>
                {config.logoUrl && (
                    <div className="mb-10 flex justify-center">
                        <img src={config.logoUrl} alt="Brand logo" className="h-12 w-auto object-contain" />
                    </div>
                )}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px flex-1" style={{ backgroundColor: config.colors.accent }} />
                    <span className="text-lg" style={{ color: config.colors.accent }}>✦</span>
                    <div className="h-px flex-1" style={{ backgroundColor: config.colors.accent }} />
                </div>
                <h1 className="text-5xl font-bold leading-tight mb-6 italic" style={{ color: config.colors.primary }}>
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

            <TableOfContents content={content} config={config} />

            {content.sections.map((section, index) => (
                <SectionRenderer key={index} section={section} config={config} index={index} />
            ))}

            <div className="mt-4 pt-8 pb-12 text-center border-t mx-16" style={{ borderColor: config.colors.accent + "40" }}>
                <span style={{ color: config.colors.accent }}>✦ ✦ ✦</span>
            </div>
        </div>
    );
}
