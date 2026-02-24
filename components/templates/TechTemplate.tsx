import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface TechTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function TechTemplate({ content, config }: TechTemplateProps) {
    return (
        <div
            className="min-h-screen flex"
            style={{ backgroundColor: "#0f1117", fontFamily: "JetBrains Mono, Fira Code, monospace" }}
        >
            {/* Left accent sidebar */}
            <div
                className="w-1.5 flex-shrink-0"
                style={{ background: `linear-gradient(180deg, ${config.colors.primary}, ${config.colors.accent})` }}
            />

            {/* Main content */}
            <div className="flex-1 p-10 max-w-3xl">
                {/* Cover */}
                <div className="mb-8 pb-8 border-b border-white/10">
                    {config.logoUrl && (
                        <div className="mb-8">
                            <img src={config.logoUrl} alt="Brand logo" className="h-10 w-auto object-contain opacity-80" />
                        </div>
                    )}
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <p className="text-sm mb-3" style={{ color: config.colors.accent }}>
                        <span style={{ color: "#666" }}>$ </span>cat guide.md
                    </p>
                    <h1 className="text-4xl font-bold leading-tight" style={{ color: "#e8e8e8" }}>
                        # {content.title}
                    </h1>
                    {content.subtitle && (
                        <p className="mt-2 text-base italic" style={{ color: config.colors.accent }}>// {content.subtitle}</p>
                    )}
                    <p className="mt-4 text-sm" style={{ color: "#555" }}>
                        {content.sections.length} sections · {Math.ceil(
                            content.sections.reduce((acc, s) => acc + s.content.split(" ").length, 0) / 200
                        )} min read{content.author ? ` · ${content.author}` : ""}
                    </p>
                </div>

                <TableOfContents content={content} config={config} />

                {content.sections.map((section, index) => (
                    <SectionRenderer key={index} section={section} config={config} index={index} />
                ))}
            </div>
        </div>
    );
}
