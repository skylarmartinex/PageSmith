import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

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
                    {content.subtitle && (
                        <p className="text-xl text-white/70 italic mb-4">{content.subtitle}</p>
                    )}
                    <div
                        className="inline-block px-4 py-1 text-sm font-bold uppercase tracking-widest"
                        style={{ backgroundColor: config.colors.accent, color: "#ffffff" }}
                    >
                        {content.author ? `by ${content.author}` : "Essential Guide"}
                    </div>
                </div>
            </div>

            <TableOfContents content={content} config={config} />

            {content.sections.map((section, index) => (
                <SectionRenderer key={index} section={section} config={config} index={index} />
            ))}
        </div>
    );
}
