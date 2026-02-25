"use client";

import { useState, useEffect, useRef } from "react";
import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { LeadCapturePage } from "@/components/sections/LeadCapturePage";

interface ShareViewProps {
    content: EbookContent;
    config: TemplateConfig;
}

// ─── Animation hooks ────────────────────────────────────────────────

/** Fires once when element enters the viewport */
function useInView(threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return { ref, inView };
}

/** Animates a numeric string from 0 → target when inView */
function useCountUp(target: string, inView: boolean, duration = 1400) {
    const [display, setDisplay] = useState("0");
    const hasRun = useRef(false);
    useEffect(() => {
        if (!inView || hasRun.current) return;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const prefix = target.match(/^[^0-9]*/)?.[0] ?? "";
        const suffix = target.replace(/^[^0-9]*/, "").replace(/[0-9.]/g, "");
        if (isNaN(num)) { setDisplay(target); return; }
        hasRun.current = true;
        const steps = 50;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            // Ease-out cubic
            const t = step / steps;
            const eased = 1 - Math.pow(1 - t, 3);
            const current = num * eased;
            if (step >= steps) {
                setDisplay(`${prefix}${num % 1 === 0 ? Math.round(num) : num.toFixed(1)}${suffix}`);
                clearInterval(timer);
            } else {
                setDisplay(`${prefix}${num % 1 === 0 ? Math.round(current) : current.toFixed(1)}${suffix}`);
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [inView, target, duration]);
    return display;
}

// ─── Animation variants ─────────────────────────────────────────────

type AnimVariant = "fadeUp" | "fadeLeft" | "fadeRight" | "scale" | "fadeIn";

const variants: Record<AnimVariant, { hidden: string; visible: string }> = {
    fadeUp: {
        hidden: "opacity: 0; transform: translateY(40px)",
        visible: "opacity: 1; transform: translateY(0)",
    },
    fadeLeft: {
        hidden: "opacity: 0; transform: translateX(-40px)",
        visible: "opacity: 1; transform: translateX(0)",
    },
    fadeRight: {
        hidden: "opacity: 0; transform: translateX(40px)",
        visible: "opacity: 1; transform: translateX(0)",
    },
    scale: {
        hidden: "opacity: 0; transform: scale(0.92)",
        visible: "opacity: 1; transform: scale(1)",
    },
    fadeIn: {
        hidden: "opacity: 0",
        visible: "opacity: 1",
    },
};

function Animate({
    children,
    variant = "fadeUp",
    delay = 0,
    duration = 600,
    className = "",
}: {
    children: React.ReactNode;
    variant?: AnimVariant;
    delay?: number;
    duration?: number;
    className?: string;
}) {
    const { ref, inView } = useInView();
    const v = variants[variant];
    return (
        <div
            ref={ref}
            className={className}
            style={{
                cssText: inView ? v.visible : v.hidden,
                transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
}

// ─── Animated stat card (counter) ──────────────────────────────────

function AnimatedStat({ value, label, color }: { value: string; label: string; color: string }) {
    const { ref, inView } = useInView(0.3);
    const display = useCountUp(value, inView);
    return (
        <div ref={ref} className="text-center">
            <p className="text-4xl font-black tabular-nums" style={{ color }}>{display}</p>
            <p className="text-xs uppercase tracking-wider mt-1 opacity-60">{label}</p>
        </div>
    );
}

// ─── Reading progress bar ───────────────────────────────────────────

function ProgressBar({ color }: { color: string }) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px]" style={{ backgroundColor: color + "25" }}>
            <div
                className="h-full"
                style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    transition: "width 80ms linear",
                    boxShadow: `0 0 8px ${color}80`,
                }}
            />
        </div>
    );
}

// ─── Sticky floating ToC ────────────────────────────────────────────

function FloatingToC({ content, config }: { content: EbookContent; config: TemplateConfig }) {
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("[data-section-index]");
            let current = 0;
            sections.forEach((el, i) => {
                if (el.getBoundingClientRect().top < window.innerHeight * 0.4) current = i;
            });
            setActiveIdx(current);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white text-lg font-bold lg:hidden"
                style={{ backgroundColor: config.colors.primary }}
                aria-label="Table of contents"
            >
                ☰
            </button>

            <div
                className={`fixed left-0 top-0 bottom-0 z-30 w-56 pt-16 pb-8 px-4 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
                style={{
                    backgroundColor: config.colors.background + "f2",
                    backdropFilter: "blur(16px)",
                    borderRight: `1px solid ${config.colors.accent}18`,
                }}
            >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40" style={{ color: config.colors.text }}>
                    Contents
                </p>
                <ol className="space-y-0.5">
                    {content.sections.map((section, i) => (
                        <li key={i}>
                            <button
                                onClick={() => {
                                    document.querySelector(`[data-section-index="${i}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    setOpen(false);
                                }}
                                className="w-full text-left text-xs py-1.5 px-2 rounded-lg transition-all"
                                style={{
                                    color: i === activeIdx ? config.colors.accent : config.colors.secondary,
                                    backgroundColor: i === activeIdx ? config.colors.accent + "15" : "transparent",
                                    fontWeight: i === activeIdx ? 700 : 400,
                                    borderLeft: i === activeIdx ? `2px solid ${config.colors.accent}` : "2px solid transparent",
                                }}
                            >
                                <span className="tabular-nums mr-1.5 opacity-40">{String(i + 1).padStart(2, "0")}</span>
                                {section.title}
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}

// ─── Cover hero with staggered children ────────────────────────────

function AnimatedCover({ content, config, bg }: { content: EbookContent; config: TemplateConfig; bg: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

    const springStyle = (delay: number): React.CSSProperties => ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(28px)",
        transition: `all 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    });

    if (content.coverImage) {
        return (
            <div className="relative overflow-hidden" style={{ minHeight: "520px" }}>
                {/* Parallax-ish image */}
                <img
                    src={content.coverImage.url}
                    alt={content.coverImage.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        filter: "brightness(0.38) saturate(1.1)",
                        transform: "scale(1.05)",
                        transition: "transform 20s ease",
                    }}
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${config.colors.primary}55 0%, ${bg}99 100%)` }} />
                {/* Dot pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                    }}
                />
                <div className="relative px-16 py-28 max-w-4xl mx-auto text-center">
                    {config.logoUrl && (
                        <div style={springStyle(0)} className="mb-8 flex justify-center">
                            <img src={config.logoUrl} alt="Logo" className="h-14 w-auto object-contain" />
                        </div>
                    )}
                    {/* Reading time badge */}
                    <div style={{ ...springStyle(100), display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", marginBottom: "24px", backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                        <span className="text-white/60 text-xs">
                            {content.sections.length} sections · {Math.ceil(content.sections.reduce((a, s) => a + s.content.split(" ").length, 0) / 200)} min read
                        </span>
                    </div>
                    <h1 style={springStyle(180)} className="text-6xl font-black text-white mb-4 drop-shadow-lg leading-tight">
                        {content.title}
                    </h1>
                    {content.subtitle && (
                        <p style={springStyle(280)} className="text-xl text-white/75 italic mb-4">{content.subtitle}</p>
                    )}
                    {content.author && (
                        <p style={springStyle(360)} className="text-sm uppercase tracking-widest text-white/50">by {content.author}</p>
                    )}
                    {/* Scroll indicator */}
                    <div style={springStyle(500)} className="mt-12 flex flex-col items-center gap-2">
                        <p className="text-white/30 text-xs uppercase tracking-widest">Scroll to read</p>
                        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
                            <div
                                className="w-1 h-2 rounded-full bg-white/40"
                                style={{ animation: "bounce 2s infinite" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No cover image fallback
    return (
        <div className="text-center py-24 px-12 max-w-3xl mx-auto">
            {config.logoUrl && (
                <div style={springStyle(0)} className="mb-8 flex justify-center">
                    <img src={config.logoUrl} alt="Logo" className="h-14 w-auto object-contain" />
                </div>
            )}
            <h1 style={{ ...springStyle(100), color: config.colors.primary }} className="text-5xl font-bold mb-4">
                {content.title}
            </h1>
            {content.subtitle && (
                <p style={{ ...springStyle(200), color: config.colors.secondary }} className="text-xl italic mb-4">
                    {content.subtitle}
                </p>
            )}
            {content.author && (
                <p style={{ ...springStyle(300), color: config.colors.secondary }} className="text-sm uppercase tracking-widest">
                    by {content.author}
                </p>
            )}
        </div>
    );
}

// ─── Section with smart animation variant ──────────────────────────

function AnimatedSectionBlock({
    section,
    index,
    config,
}: {
    section: EbookContent["sections"][0];
    index: number;
    config: TemplateConfig;
}) {
    // Determine variant based on section content type
    const hasPullQuote = !!section.pullQuote;
    const hasChart = !!(section.chart || section.diagram);
    const isOdd = index % 2 === 1;

    let variant: AnimVariant = "fadeUp";
    if (hasPullQuote) variant = isOdd ? "fadeRight" : "fadeLeft";
    else if (hasChart) variant = "scale";

    return (
        <Animate variant={variant} delay={Math.min(index * 30, 120)} duration={700}>
            <div data-section-index={index}>
                <SectionRenderer section={section} config={config} index={index} />
                {/* Animated stat row if section has stats */}
                {section.stats && section.stats.length > 0 && (
                    <Animate variant="fadeUp" delay={200} duration={600}>
                        <div
                            className="flex flex-wrap justify-center gap-10 py-8 mx-10 mb-4 rounded-2xl"
                            style={{ backgroundColor: config.colors.accent + "0a" }}
                        >
                            {section.stats.map((stat, i) => (
                                <AnimatedStat
                                    key={i}
                                    value={stat.value}
                                    label={stat.label}
                                    color={config.colors.accent}
                                />
                            ))}
                        </div>
                    </Animate>
                )}
            </div>
        </Animate>
    );
}

// ─── Main ShareView ─────────────────────────────────────────────────

export function ShareView({ content, config }: ShareViewProps) {
    const [darkMode, setDarkMode] = useState(false);
    const bg = darkMode ? "#0f1117" : config.colors.background;
    const textColor = darkMode ? "#e8e8e8" : config.colors.text;

    return (
        <div style={{ backgroundColor: bg, color: textColor, fontFamily: config.fontFamily, minHeight: "100vh" }}>
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                    50% { transform: translateY(6px); opacity: 0.8; }
                }
            `}</style>

            <ProgressBar color={config.colors.accent} />
            <FloatingToC content={content} config={config} />

            {/* Top-right controls */}
            <div className="fixed top-3 right-4 z-40 flex items-center gap-2">
                <button
                    onClick={() => setDarkMode((d) => !d)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all hover:scale-105"
                    style={{ borderColor: config.colors.accent + "40", color: config.colors.secondary, backgroundColor: bg }}
                >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
                <a
                    href="/"
                    className="text-xs px-3 py-1.5 rounded-full font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: config.colors.primary }}
                >
                    Made with PageSmith
                </a>
            </div>

            {/* Main content */}
            <div className="lg:ml-56">
                {/* Cover */}
                <AnimatedCover content={content} config={config} bg={bg} />

                {/* ToC */}
                <Animate variant="fadeUp" delay={150}>
                    <div className="max-w-3xl mx-auto">
                        <TableOfContents content={content} config={config} />
                    </div>
                </Animate>

                {/* Sections */}
                <div className="max-w-4xl mx-auto">
                    {content.sections.map((section, index) => (
                        <AnimatedSectionBlock
                            key={index}
                            section={section}
                            index={index}
                            config={config}
                        />
                    ))}
                </div>

                {/* Lead capture */}
                <Animate variant="scale" delay={0} duration={800}>
                    <div className="max-w-4xl mx-auto">
                        <LeadCapturePage content={content} config={config} />
                    </div>
                </Animate>

                {/* Footer */}
                <Animate variant="fadeIn" delay={0}>
                    <div className="text-center py-16 px-8 border-t mt-8" style={{ borderColor: config.colors.accent + "20" }}>
                        <p className="text-sm mb-4" style={{ color: config.colors.secondary }}>
                            Created with{" "}
                            <a href="/" className="font-bold" style={{ color: config.colors.accent }}>PageSmith</a>
                            {" "}· Link expires in 30 days
                        </p>
                        <a
                            href="/"
                            className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                            style={{ backgroundColor: config.colors.primary }}
                        >
                            Create your own ebook →
                        </a>
                    </div>
                </Animate>
            </div>
        </div>
    );
}
