import { TemplateConfig } from "@/lib/templates/types";

interface ChapterDividerProps {
    chapterNumber: number;
    title: string;
    subtitle?: string;
    config: TemplateConfig;
    imageUrl?: string;
}

export function ChapterDivider({ chapterNumber, title, subtitle, config, imageUrl }: ChapterDividerProps) {
    return (
        <div
            className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center"
            style={{
                minHeight: "320px",
                background: imageUrl
                    ? undefined
                    : `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
            }}
        >
            {/* Background image */}
            {imageUrl && (
                <>
                    <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ backgroundColor: config.colors.primary + "cc" }} />
                </>
            )}

            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 px-12 py-12">
                {/* Chapter pill */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                >
                    <span className="text-white text-xs font-black uppercase tracking-widest opacity-80">Chapter</span>
                    <span
                        className="text-xl font-black"
                        style={{ color: config.colors.accent }}
                    >
                        {String(chapterNumber).padStart(2, "0")}
                    </span>
                </div>

                {/* Title */}
                <h2
                    className="text-4xl font-black text-white leading-tight mb-3"
                    style={{ fontFamily: config.fontFamily, textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}
                >
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-white/70 text-base max-w-xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}

                {/* Decorative accent line */}
                <div
                    className="h-1 w-16 rounded-full mx-auto mt-6"
                    style={{ backgroundColor: config.colors.accent }}
                />
            </div>
        </div>
    );
}
