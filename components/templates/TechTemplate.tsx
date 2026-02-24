import { EbookContent, TemplateConfig } from "@/lib/templates/types";

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
                <div className="mb-16 pb-10 border-b border-white/10">
                    {config.logoUrl && (
                        <div className="mb-8">
                            <img src={config.logoUrl} alt="Brand logo" className="h-10 w-auto object-contain opacity-80" />
                        </div>
                    )}
                    {/* Terminal-style header */}
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <p className="text-sm mb-3" style={{ color: config.colors.accent }}>
                        <span style={{ color: "#666" }}>$ </span>
                        cat guide.md
                    </p>
                    <h1 className="text-4xl font-bold leading-tight" style={{ color: "#e8e8e8" }}>
                        # {content.title}
                    </h1>
                    {content.subtitle && (
                        <p className="mt-2 text-base italic" style={{ color: config.colors.accent }}>// {content.subtitle}</p>
                    )}
                    <p className="mt-4 text-sm" style={{ color: "#555" }}>
                        {content.sections.length} sections · Estimated read time:{" "}
                        {Math.ceil(
                            content.sections.reduce((acc, s) => acc + s.content.split(" ").length, 0) / 200
                        )}{" "}
                        min{content.author ? ` · ${content.author}` : ""}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-14">
                    {content.sections.map((section, index) => (
                        <div key={index}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: config.colors.primary + "25", color: config.colors.primary }}>
                                    [{String(index + 1).padStart(2, "0")}]
                                </span>
                                <h2 className="text-xl font-bold" style={{ color: "#e8e8e8" }}>
                                    {section.title}
                                </h2>
                            </div>

                            <div
                                className="border-l-2 pl-6 space-y-3 text-[15px] leading-relaxed"
                                style={{ borderColor: config.colors.primary + "40", color: "#9ca3af" }}
                            >
                                {section.content.split("\n").map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>

                            {section.image && (
                                <div
                                    className="mt-6 rounded-lg overflow-hidden border"
                                    style={{ borderColor: config.colors.primary + "30" }}
                                >
                                    <div className="px-3 py-1.5 text-xs border-b flex items-center gap-2" style={{ backgroundColor: "#1a1d27", borderColor: config.colors.primary + "30", color: "#666" }}>
                                        <span style={{ color: config.colors.accent }}>●</span>
                                        {section.imageKeywords[0] || "figure"}.jpg
                                    </div>
                                    <img src={section.image.url} alt={section.image.alt} className="w-full" />
                                    <p className="text-xs px-3 py-2" style={{ color: "#555" }}>{section.image.attribution}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
