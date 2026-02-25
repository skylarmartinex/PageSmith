import { EbookSection, TemplateConfig, SectionLayout } from "@/lib/templates/types";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import { VizRenderer } from "@/components/charts/VizRenderer";
import { useImageSwap } from "@/lib/context/ImageSwapContext";
import { ChapterDivider } from "@/components/sections/ChapterDivider";

interface SectionRendererProps {
    section: EbookSection;
    config: TemplateConfig;
    index: number;
    /** Called with (sectionIndex, imageIndex) when user clicks an image to swap it */
    onImageClick?: (sectionIndex: number, imageIndex: number, keyword: string) => void;
}

// ─── Lucide icon resolver ───────────────────────────────────────────────────
function SectionIcon({ name, color }: { name?: string; color: string }) {
    if (!name) return null;
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;
    const Icon = icons[name];
    if (!Icon) return null;
    return <Icon size={20} color={color} strokeWidth={2} />;
}

// ─── Rich markdown body parser ──────────────────────────────────────────────
// Handles: ### H3 headings, - bullet lists, **bold**, and plain paragraphs
function RichBodyText({
    content,
    config,
    textSize = "base",
}: {
    content: string;
    config: TemplateConfig;
    textSize?: "xl" | "lg" | "base";
}) {
    const fontSizeMap = { xl: "text-xl", lg: "text-lg", base: "text-[16px]" };
    const fontSize = fontSizeMap[textSize];

    // Split by double newline (paragraphs), then by single newline (lines)
    const rawBlocks = content.split(/\n\n+/);

    const blocks: React.ReactNode[] = [];

    rawBlocks.forEach((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return;

        // H3 heading
        if (trimmed.startsWith("### ")) {
            blocks.push(
                <h3
                    key={`h3-${bi}`}
                    className="font-bold mt-5 mb-2"
                    style={{ color: config.colors.primary, fontSize: "1.1em" }}
                >
                    {trimmed.replace(/^### /, "")}
                </h3>
            );
            return;
        }

        // Bullet list block (contains lines starting with - or *)
        const lines = trimmed.split("\n");
        const isList = lines.every(l => /^[-*]\s/.test(l.trim()) || l.trim() === "");
        if (isList) {
            blocks.push(
                <ul key={`ul-${bi}`} className="my-3 space-y-1.5 pl-4">
                    {lines.filter(l => l.trim()).map((line, li) => (
                        <li
                            key={li}
                            className="flex items-start gap-2 text-[15px] leading-relaxed"
                            style={{ color: config.colors.text }}
                        >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: config.colors.accent }} />
                            <span dangerouslySetInnerHTML={{ __html: parseBold(line.replace(/^[-*]\s+/, "")) }} />
                        </li>
                    ))}
                </ul>
            );
            return;
        }

        // Plain paragraph — parse **bold** inline
        blocks.push(
            <p
                key={`p-${bi}`}
                className={`${fontSize} leading-relaxed`}
                style={{ color: config.colors.text }}
                dangerouslySetInnerHTML={{ __html: parseBold(trimmed) }}
            />
        );
    });

    return <div className="space-y-3">{blocks}</div>;
}

/** Convert **text** → <strong>text</strong> */
function parseBold(text: string): string {
    return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// ─── Pull Quote ─────────────────────────────────────────────────────────────
function PullQuote({ text, config }: { text: string; config: TemplateConfig }) {
    return (
        <blockquote
            className="my-6 pl-5 border-l-4 py-1"
            style={{ borderColor: config.colors.accent }}
        >
            <p
                className="text-lg italic leading-relaxed"
                style={{ color: config.colors.primary }}
            >
                &ldquo;{text}&rdquo;
            </p>
        </blockquote>
    );
}

// ─── Callout Box ────────────────────────────────────────────────────────────
function CalloutBox({ type, text, config }: { type: string; text: string; config: TemplateConfig }) {
    const styles: Record<string, { bg: string; border: string; label: string; emoji: string }> = {
        tip: {
            bg: config.colors.accent + "14",
            border: config.colors.accent,
            label: "Tip",
            emoji: "💡",
        },
        warning: {
            bg: "#FEF3C7",
            border: "#F59E0B",
            label: "Watch Out",
            emoji: "⚠️",
        },
        insight: {
            bg: config.colors.primary + "10",
            border: config.colors.primary,
            label: "Key Insight",
            emoji: "🔑",
        },
    };
    const s = styles[type] || styles.tip;
    return (
        <div
            className="my-6 rounded-xl px-5 py-4 border-l-4"
            style={{ backgroundColor: s.bg, borderColor: s.border }}
        >
            <p
                className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"
                style={{ color: s.border }}
            >
                <span>{s.emoji}</span> {s.label}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: config.colors.text }}>
                {text}
            </p>
        </div>
    );
}

// ─── Stat Cards ─────────────────────────────────────────────────────────────
function StatBlock({ stats, config }: { stats: { label: string; value: string }[]; config: TemplateConfig }) {
    return (
        <div className="my-6 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)` }}>
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="rounded-xl p-4 text-center border"
                    style={{
                        backgroundColor: config.colors.primary + "08",
                        borderColor: config.colors.accent + "30",
                    }}
                >
                    <p
                        className="text-2xl font-black mb-1"
                        style={{ color: config.colors.primary }}
                    >
                        {stat.value}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: config.colors.secondary }}>
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
}

// ─── Image attribution helper ───────────────────────────────────────────────
function ImageAttrib({ text, light }: { text?: string; light?: boolean }) {
    if (!text) return null;
    return (
        <p className={`text-xs mt-1.5 ${light ? "text-white/50" : "opacity-50"}`}>
            {text}
        </p>
    );
}

// ─── Main SectionRenderer ───────────────────────────────────────────────────
export function SectionRenderer({ section, config, index, onImageClick: onImageClickProp }: SectionRendererProps) {
    const { onImageClick: ctxImageClick } = useImageSwap();
    const onImageClick = onImageClickProp ?? ctxImageClick ?? undefined;
    const layout: SectionLayout = section.layoutType || "image-right";
    const images = section.images && section.images.length > 0
        ? section.images
        : section.image
            ? [section.image]
            : [];

    // ── Swappable image with hover overlay ────────────────────────────────
    const SwappableImage = ({ img, imgIdx, className, style }: {
        img: { url: string; alt: string; attribution?: string };
        imgIdx: number;
        className?: string;
        style?: React.CSSProperties;
    }) => (
        <div
            className="relative group"
            style={{ cursor: onImageClick ? "pointer" : "default" }}
            onClick={() => onImageClick?.(index, imgIdx, section.imageKeywords?.[imgIdx] || section.title)}
        >
            <img src={img.url} alt={img.alt} className={className} style={style} />
            {onImageClick && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-xl">
                        🔄 Swap image
                    </span>
                </div>
            )}
        </div>
    );

    // ── Shared section heading ────────────────────────────────────────────
    const SectionHeading = (
        <div className="flex items-center gap-3 mb-4">
            {section.iconName && (
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.colors.accent + "20" }}
                >
                    <SectionIcon name={section.iconName} color={config.colors.accent} />
                </div>
            )}
            <h2
                className="text-2xl font-bold leading-tight"
                style={{ color: config.colors.primary, fontFamily: config.fontFamily }}
            >
                {section.title}
            </h2>
        </div>
    );

    // ── Rich body text (supports ### H3, - bullets, **bold**) ─────────────
    const BodyText = (
        <RichBodyText content={section.content} config={config} />
    );

    // ── Extra visual blocks ───────────────────────────────────────────────
    const ExtraBlocks = (
        <>
            {section.pullQuote && <PullQuote text={section.pullQuote} config={config} />}
            {section.stats && section.stats.length > 0 && (
                <StatBlock stats={section.stats} config={config} />
            )}
            {section.callout && (
                <CalloutBox type={section.callout.type} text={section.callout.text} config={config} />
            )}
            {(section.chart || section.diagram || section.comparisonTable || section.iconGrid) && (
                <VizRenderer
                    chart={section.chart}
                    diagram={section.diagram}
                    comparisonTable={section.comparisonTable}
                    iconGrid={section.iconGrid}
                    config={config}
                    sectionTitle={section.title}
                />
            )}
        </>
    );

    // ── Optional chapter divider ──────────────────────────────────────────
    const MaybeChapterDivider = section.chapterDivider ? (
        <ChapterDivider
            chapterNumber={section.chapterDivider.chapterNumber}
            title={section.chapterDivider.title}
            subtitle={section.chapterDivider.subtitle}
            config={config}
            imageUrl={images[0]?.url}
        />
    ) : null;

    const withDivider = (content: React.ReactNode) =>
        MaybeChapterDivider ? <>{MaybeChapterDivider}{content}</> : <>{content}</>;

    // ── Layout: TEXT ONLY ─────────────────────────────────────────────────
    if (layout === "text-only" || images.length === 0) {
        return withDivider(
            <div className="mb-12 px-10 py-8" style={{ backgroundColor: config.colors.background }}>
                {SectionHeading}
                {BodyText}
                {ExtraBlocks}
            </div>
        );
    }

    // ── Layout: IMAGE OVERLAY ─────────────────────────────────────────────
    if (layout === "image-overlay") {
        return (
            <div className="mb-12 relative overflow-hidden" style={{ minHeight: "420px" }}>
                <img
                    src={images[0].url}
                    alt={images[0].alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "brightness(0.35) saturate(1.2)" }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${config.colors.primary}99 0%, rgba(0,0,0,0.5) 100%)` }}
                />
                <div className="relative px-10 py-14">
                    <div className="flex items-center gap-3 mb-5">
                        {section.iconName && (
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: config.colors.accent + "40", backdropFilter: "blur(8px)" }}
                            >
                                <SectionIcon name={section.iconName} color={config.colors.accent} />
                            </div>
                        )}
                        <h2 className="text-3xl font-black leading-tight text-white">
                            {section.title}
                        </h2>
                    </div>
                    {section.pullQuote && (
                        <p
                            className="text-xl italic font-medium mb-6 leading-relaxed"
                            style={{ color: config.colors.accent }}
                        >
                            &ldquo;{section.pullQuote}&rdquo;
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-8 text-white/85 text-[15px] leading-relaxed">
                        {section.content.split("\n\n").map((para, i) => (
                            <p key={i}>{para.replace(/^###\s+/, "")}</p>
                        ))}
                    </div>
                    {section.stats && section.stats.length > 0 && (
                        <div className="flex gap-6 mt-8">
                            {section.stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-3xl font-black" style={{ color: config.colors.accent }}>{stat.value}</p>
                                    <p className="text-xs text-white/70 uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <p className="relative text-xs text-white/30 px-10 pb-3">{images[0].attribution}</p>
            </div>
        );
    }

    // ── Layout: IMAGE FULL ────────────────────────────────────────────────
    if (layout === "image-full") {
        return (
            <div className="mb-12" style={{ backgroundColor: config.colors.background }}>
                <div className="relative overflow-hidden" style={{ maxHeight: "320px" }}>
                    <SwappableImage
                        img={images[0]}
                        imgIdx={0}
                        className="w-full object-cover"
                        style={{ maxHeight: "320px" }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to bottom, transparent 50%, ${config.colors.background})` }}
                    />
                </div>
                <ImageAttrib text={images[0].attribution} />
                <div className="px-10 pt-2 pb-8">
                    {SectionHeading}
                    {BodyText}
                    {ExtraBlocks}
                </div>
            </div>
        );
    }

    // ── Layout: IMAGE GRID ────────────────────────────────────────────────
    if (layout === "image-grid") {
        const gridImages = images.slice(0, 3);
        const cols = gridImages.length === 1 ? 1 : gridImages.length === 2 ? 2 : 3;
        return (
            <div className="mb-12 px-10 py-8" style={{ backgroundColor: config.colors.background }}>
                {SectionHeading}
                {BodyText}
                {ExtraBlocks}
                <div
                    className="mt-6 gap-3"
                    style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                >
                    {gridImages.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden">
                            <SwappableImage
                                img={img}
                                imgIdx={i}
                                className="w-full h-48 object-cover"
                            />
                            <ImageAttrib text={img.attribution} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Layout: IMAGE RIGHT / IMAGE LEFT ──────────────────────────────────
    const imgSide = layout === "image-left" ? "left" : "right";
    const sideImage = images[0];

    return (
        <div className="mb-12 px-10 py-8" style={{ backgroundColor: config.colors.background }}>
            <div className={`flex gap-8 items-start ${imgSide === "left" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Text column */}
                <div className="flex-1 min-w-0">
                    {SectionHeading}
                    {BodyText}
                    {ExtraBlocks}
                </div>
                {/* Image column */}
                <div className="w-80 flex-shrink-0">
                    <div className="rounded-2xl overflow-hidden shadow-md">
                        <SwappableImage
                            img={sideImage}
                            imgIdx={0}
                            className="w-full object-cover"
                            style={{ maxHeight: "260px" }}
                        />
                    </div>
                    <ImageAttrib text={sideImage.attribution} />
                    {images[1] && (
                        <div className="mt-3 rounded-2xl overflow-hidden shadow-md">
                            <SwappableImage
                                img={images[1]}
                                imgIdx={1}
                                className="w-full object-cover"
                                style={{ maxHeight: "160px" }}
                            />
                            <ImageAttrib text={images[1].attribution} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
