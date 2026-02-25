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

// Animated counter hook
function useCountUp(target: string, inView: boolean) {
    const [display, setDisplay] = useState("0");
    const hasRun = useRef(false);

    useEffect(() => {
        if (!inView || hasRun.current) return;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const suffix = target.replace(/[0-9.]/g, "");
        if (isNaN(num)) { setDisplay(target); return; }
        hasRun.current = true;
        const duration = 1200;
        const steps = 40;
        const increment = num / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                setDisplay(`${num % 1 === 0 ? Math.round(num) : num.toFixed(1)}${suffix}`);
                clearInterval(timer);
            } else {
                setDisplay(`${Math.round(current)}${suffix}`);
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [inView, target]);

    return display;
}

// Intersection observer hook
function useInView(threshold = 0.15) {
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

// Animated section wrapper
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, inView } = useInView();
    return (
        <div
            ref={ref}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

// Reading progress bar
function ProgressBar({ color }: { color: string }) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ backgroundColor: color + "30" }}>
            <div className="h-full transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: color }} />
        </div>
    );
}

// Sticky floating ToC
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
            {/* Mobile toggle */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white text-lg font-bold lg:hidden"
                style={{ backgroundColor: config.colors.primary }}
                aria-label="Table of contents"
            >
                ☰
            </button>

            {/* Sidebar — desktop always visible, mobile toggled */}
            <div
                className={`fixed left-0 top-0 bottom-0 z-30 w-56 pt-16 pb-8 px-4 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
                style={{ backgroundColor: config.colors.background + "f5", backdropFilter: "blur(12px)", borderRight: `1px solid ${config.colors.accent}20` }}
            >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50" style={{ color: config.colors.text }}>
                    Contents
                </p>
                <ol className="space-y-1">
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
                                    fontWeight: i === activeIdx ? 600 : 400,
                                }}
                            >
                                <span className="tabular-nums mr-1.5 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                                {section.title}
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}

export function ShareView({ content, config }: ShareViewProps) {
    const [darkMode, setDarkMode] = useState(false);

    const bg = darkMode ? "#0f1117" : config.colors.background;
    const textColor = darkMode ? "#e8e8e8" : config.colors.text;

    return (
        <div style={{ backgroundColor: bg, color: textColor, fontFamily: config.fontFamily, minHeight: "100vh" }}>
            <ProgressBar color={config.colors.accent} />
            <FloatingToC content={content} config={config} />

            {/* Dark mode toggle + Made with badge — top right */}
            <div className="fixed top-3 right-4 z-40 flex items-center gap-2">
                <button
                    onClick={() => setDarkMode((d) => !d)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                    style={{ borderColor: config.colors.accent + "40", color: config.colors.secondary, backgroundColor: bg }}
                >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
                <a
                    href="/"
                    className="text-xs px-3 py-1.5 rounded-full font-bold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: config.colors.primary }}
                >
                    Made with PageSmith
                </a>
            </div>

            {/* Main content — offset for sidebar on desktop */}
            <div className="lg:ml-56">
                {/* Cover hero */}
                <AnimatedSection>
                    {content.coverImage ? (
                        <div className="relative overflow-hidden" style={{ minHeight: "520px" }}>
                            <img
                                src={content.coverImage.url}
                                alt={content.coverImage.alt}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ filter: "brightness(0.4)" }}
                            />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${config.colors.primary}66 0%, ${bg} 100%)` }} />
                            <div className="relative px-16 py-28 max-w-4xl mx-auto text-center">
                                {config.logoUrl && <div className="mb-8 flex justify-center"><img src={config.logoUrl} alt="Logo" className="h-14 w-auto object-contain" /></div>}
                                <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg leading-tight">{content.title}</h1>
                                {content.subtitle && <p className="text-xl text-white/80 italic mb-4">{content.subtitle}</p>}
                                {content.author && <p className="text-sm uppercase tracking-widest text-white/60">by {content.author}</p>}
                                <div className="mt-8 flex justify-center gap-3 text-white/50 text-sm">
                                    <span>{content.sections.length} sections</span>
                                    <span>·</span>
                                    <span>{Math.ceil(content.sections.reduce((a, s) => a + s.content.split(" ").length, 0) / 200)} min read</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-24 px-12 max-w-3xl mx-auto">
                            {config.logoUrl && <div className="mb-8 flex justify-center"><img src={config.logoUrl} alt="Logo" className="h-14 w-auto object-contain" /></div>}
                            <h1 className="text-5xl font-bold mb-4" style={{ color: config.colors.primary }}>{content.title}</h1>
                            {content.subtitle && <p className="text-xl italic mb-4" style={{ color: config.colors.secondary }}>{content.subtitle}</p>}
                            {content.author && <p className="text-sm uppercase tracking-widest" style={{ color: config.colors.secondary }}>by {content.author}</p>}
                        </div>
                    )}
                </AnimatedSection>

                {/* ToC */}
                <AnimatedSection delay={100}>
                    <div className="max-w-3xl mx-auto">
                        <TableOfContents content={content} config={config} />
                    </div>
                </AnimatedSection>

                {/* Sections */}
                <div className="max-w-4xl mx-auto">
                    {content.sections.map((section, index) => (
                        <div key={index} data-section-index={index}>
                            <AnimatedSection delay={index * 50}>
                                <SectionRenderer section={section} config={config} index={index} />
                            </AnimatedSection>
                        </div>
                    ))}
                </div>

                {/* Lead capture CTA */}
                <div className="max-w-4xl mx-auto">
                    <LeadCapturePage content={content} config={config} />
                </div>

                {/* Footer */}
                <div className="text-center py-16 px-8 border-t mt-8" style={{ borderColor: config.colors.accent + "20" }}>
                    <p className="text-sm mb-4" style={{ color: config.colors.secondary }}>
                        Created with{" "}
                        <a href="/" className="font-bold" style={{ color: config.colors.accent }}>PageSmith</a>
                        {" "}· Link expires in 30 days
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: config.colors.primary }}
                    >
                        Create your own ebook →
                    </a>
                </div>
            </div>
        </div>
    );
}
