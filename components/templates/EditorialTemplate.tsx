import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface EditorialTemplateProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function EditorialTemplate({ content, config }: EditorialTemplateProps) {
    const wordCount = content.sections.reduce(
        (acc, s) => acc + s.content.split(" ").length,
        0
    );
    const readTime = Math.ceil(wordCount / 200);

    return (
        <div
            className="max-w-4xl mx-auto min-h-screen"
            style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily, color: config.colors.text }}
        >
            {/* Magazine-style cover */}
            <div className="relative overflow-hidden" style={{ minHeight: "520px" }}>
                {content.coverImage ? (
                    <>
                        <img
                            src={content.coverImage.url}
                            alt={content.coverImage.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: "brightness(0.5) saturate(1.1)" }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.85) 100%)` }}
                        />
                    </>
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(160deg, ${config.colors.primary} 0%, #000 100%)` }}
                    />
                )}

                {/* Top bar */}
                <div className="relative flex items-center justify-between px-10 pt-8">
                    {config.logoUrl ? (
                        <img src={config.logoUrl} alt="Logo" className="h-8 w-auto object-contain opacity-90" />
                    ) : (
                        <div className="h-px w-16 opacity-40" style={{ backgroundColor: config.colors.accent }} />
                    )}
                    <div className="text-xs tracking-[0.3em] uppercase text-white/60">
                        {readTime} min read · {content.sections.length} chapters
                    </div>
                </div>

                {/* Cover text — bottom-anchored */}
                <div className="relative px-10 pb-12 mt-auto" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                    {/* Category label */}
                    <div
                        className="inline-block mb-5 px-3 py-1 text-xs font-bold uppercase tracking-widest"
                        style={{ backgroundColor: config.colors.accent, color: "#fff" }}
                    >
                        Essential Guide
                    </div>

                    <h1
                        className="font-black leading-none mb-4 tracking-tight"
                        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#ffffff" }}
                    >
                        {content.title}
                    </h1>

                    {content.subtitle && (
                        <p className="text-base text-white/70 italic mb-5 max-w-xl">
                            {content.subtitle}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="h-px w-10" style={{ backgroundColor: config.colors.accent }} />
                        {content.author && (
                            <p className="text-sm text-white/60 uppercase tracking-widest">{content.author}</p>
                        )}
                    </div>
                </div>
            </div>

            <TableOfContents content={content} config={config} />

            {content.sections.map((section, index) => (
                <SectionRenderer key={index} section={section} config={config} index={index} />
            ))}

            {/* Footer rule */}
            <div className="mx-10 mt-4 mb-12 pt-6 border-t flex items-center justify-between text-xs text-opacity-40"
                style={{ borderColor: config.colors.text + "20", color: config.colors.secondary }}
            >
                <span className="uppercase tracking-widest">{content.title}</span>
                <span>{content.author || ""}</span>
            </div>
        </div>
    );
}
