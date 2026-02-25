"use client";

import { useState } from "react";
import { EbookSection, TemplateConfig } from "@/lib/templates/types";

interface ComponentLibraryProps {
    config: TemplateConfig;
    onInsertSection: (section: Partial<EbookSection>) => void;
}

interface ComponentDef {
    type: string;
    icon: string;
    label: string;
    description: string;
    preview: (config: TemplateConfig) => React.ReactNode;
    factory: (config: TemplateConfig) => Partial<EbookSection>;
}

const COMPONENTS: ComponentDef[] = [
    {
        type: "stat-block",
        icon: "📊",
        label: "Stat Cards",
        description: "3 key metrics with values",
        preview: (config) => (
            <div className="flex gap-1.5 p-1.5">
                {["87%", "3.2x", "$24K"].map((v, i) => (
                    <div key={i} className="flex-1 rounded-lg p-1.5 text-center" style={{ backgroundColor: config.colors.primary + "15" }}>
                        <div className="text-sm font-black" style={{ color: config.colors.primary }}>{v}</div>
                        <div className="text-[9px] opacity-50" style={{ color: config.colors.text }}>Metric</div>
                    </div>
                ))}
            </div>
        ),
        factory: (config) => ({
            title: "Key Metrics",
            content: "These numbers tell the story at a glance.",
            layoutType: "text-only",
            stats: [
                { label: "Success Rate", value: "87%" },
                { label: "ROI Multiplier", value: "3.2x" },
                { label: "Average Value", value: "$24K" },
            ],
            pullQuote: "The numbers don't lie — results speak for themselves.",
        }),
    },
    {
        type: "pull-quote",
        icon: "💬",
        label: "Pull Quote",
        description: "Bold standout quote",
        preview: (config) => (
            <div className="p-2 border-l-2 mx-2" style={{ borderColor: config.colors.accent }}>
                <div className="text-[10px] italic" style={{ color: config.colors.primary }}>"The most impactful insight of the entire guide."</div>
            </div>
        ),
        factory: () => ({
            title: "Key Takeaway",
            content: "This section highlights the most important insight.",
            layoutType: "text-only",
            pullQuote: "The most impactful insight of the entire guide.",
        }),
    },
    {
        type: "callout-tip",
        icon: "💡",
        label: "Tip Callout",
        description: "Highlighted actionable tip",
        preview: (config) => (
            <div className="m-1.5 rounded-lg p-2" style={{ backgroundColor: config.colors.accent + "15", borderLeft: `2px solid ${config.colors.accent}` }}>
                <div className="text-[9px] font-bold uppercase" style={{ color: config.colors.accent }}>💡 Tip</div>
                <div className="text-[9px] mt-0.5 opacity-70" style={{ color: config.colors.text }}>Start with your highest-impact action first.</div>
            </div>
        ),
        factory: () => ({
            title: "Pro Tip",
            content: "Practical advice to put this section into action.",
            layoutType: "text-only",
            pullQuote: "Small consistent actions compound into transformative results.",
            callout: { type: "tip", text: "Start with your highest-impact action first and build momentum from there." },
        }),
    },
    {
        type: "bar-chart",
        icon: "📈",
        label: "Bar Chart",
        description: "Comparative data visualization",
        preview: (config) => (
            <div className="p-2 flex items-end gap-1 h-12">
                {[60, 85, 45, 70, 90].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: config.colors.primary, opacity: 0.6 + i * 0.08 }} />
                ))}
            </div>
        ),
        factory: () => ({
            title: "Performance Breakdown",
            content: "The data reveals clear patterns in performance across key categories.",
            layoutType: "text-only",
            pullQuote: "Data-driven decisions consistently outperform gut instinct by 3x.",
            chart: {
                type: "bar" as const,
                title: "Category Performance",
                unit: "%",
                data: [
                    { label: "Q1", value: 62 },
                    { label: "Q2", value: 78 },
                    { label: "Q3", value: 71 },
                    { label: "Q4", value: 89 },
                ],
            },
        }),
    },
    {
        type: "process-flow",
        icon: "🔄",
        label: "Process Flow",
        description: "Step-by-step workflow",
        preview: (config) => (
            <div className="p-2 flex items-center gap-1 overflow-hidden">
                {["Step 1", "Step 2", "Step 3"].map((s, i) => (
                    <div key={i} className="flex items-center gap-1 flex-shrink-0">
                        <div className="rounded px-1.5 py-0.5 text-[8px] font-bold text-white" style={{ backgroundColor: config.colors.primary }}>{s}</div>
                        {i < 2 && <div className="text-[10px]" style={{ color: config.colors.accent }}>→</div>}
                    </div>
                ))}
            </div>
        ),
        factory: () => ({
            title: "Step-by-Step Process",
            content: "Follow this proven process to achieve consistent results.",
            layoutType: "text-only",
            pullQuote: "A clear process is the difference between hoping and knowing.",
            diagram: {
                type: "process" as const,
                title: "The Process",
                steps: [
                    { title: "Assess", description: "Evaluate your current state and identify gaps" },
                    { title: "Plan", description: "Design a strategy with clear milestones" },
                    { title: "Execute", description: "Implement with focus and discipline" },
                    { title: "Review", description: "Measure results and iterate" },
                ],
            },
        }),
    },
    {
        type: "comparison-table",
        icon: "📋",
        label: "Comparison Table",
        description: "Side-by-side feature comparison",
        preview: (config) => (
            <div className="p-1.5 overflow-hidden">
                <div className="text-[9px] grid grid-cols-3 gap-0.5">
                    {["Feature", "Option A", "Option B"].map((h, i) => (
                        <div key={i} className="px-1 py-0.5 rounded text-center font-bold" style={{ backgroundColor: config.colors.primary + "20", color: config.colors.primary, fontSize: 7 }}>{h}</div>
                    ))}
                    {["Speed", "✓", "✓", "Cost", "$$", "$$$", "Ease", "Easy", "Hard"].map((v, i) => (
                        <div key={i} className="px-1 py-0.5 text-center" style={{ color: config.colors.text, fontSize: 7, opacity: 0.7 }}>{v}</div>
                    ))}
                </div>
            </div>
        ),
        factory: () => ({
            title: "Option Comparison",
            content: "Use this comparison to quickly identify the right choice for your situation.",
            layoutType: "text-only",
            pullQuote: "The best tool is the one that fits your specific constraints.",
            comparisonTable: {
                title: "Feature Comparison",
                headers: ["Feature", "Option A", "Option B", "Option C"],
                rows: [
                    { feature: "Setup Time", values: ["1 hour", "1 day", "3 hours"] },
                    { feature: "Monthly Cost", values: ["$29", "$99", "$49"] },
                    { feature: "Ease of Use", values: ["Easy", "Complex", "Moderate"] },
                    { feature: "Scalability", values: ["High", "Very High", "Medium"] },
                ],
                highlightCol: 0,
            },
        }),
    },
    {
        type: "icon-grid",
        icon: "⊞",
        label: "Icon Grid",
        description: "4–6 feature cards with icons",
        preview: (config) => (
            <div className="p-1.5 grid grid-cols-3 gap-1">
                {["🚀", "✨", "🎯", "⚡", "🔑", "💡"].map((icon, i) => (
                    <div key={i} className="rounded-lg p-1.5 flex flex-col items-center gap-0.5" style={{ backgroundColor: config.colors.primary + "10" }}>
                        <span className="text-[12px]">{icon}</span>
                        <div className="h-1 w-6 rounded opacity-40" style={{ backgroundColor: config.colors.primary }} />
                    </div>
                ))}
            </div>
        ),
        factory: () => ({
            title: "Key Features",
            content: "These six principles form the foundation of lasting success.",
            layoutType: "text-only",
            pullQuote: "Excellence is built from simple principles consistently applied.",
            iconGrid: {
                title: "Core Principles",
                columns: 3,
                items: [
                    { icon: "Rocket", title: "Speed to Market", description: "Launch fast, iterate faster based on real feedback." },
                    { icon: "Target", title: "Clear Focus", description: "Do fewer things with exceptional quality." },
                    { icon: "Shield", title: "Reliability", description: "Build trust through consistent, dependable delivery." },
                    { icon: "TrendingUp", title: "Growth Mindset", description: "Treat every setback as a learning opportunity." },
                    { icon: "Users", title: "Team Alignment", description: "Keep everyone moving toward the same north star." },
                    { icon: "Zap", title: "Agility", description: "Adapt quickly when circumstances change." },
                ],
            },
        }),
    },
    {
        type: "timeline",
        icon: "⏱",
        label: "Timeline",
        description: "Chronological milestones",
        preview: (config) => (
            <div className="p-2 relative">
                <div className="absolute left-3 top-2 bottom-2 w-0.5" style={{ backgroundColor: config.colors.accent + "40" }} />
                {[2022, 2023, 2024].map((yr, i) => (
                    <div key={i} className="flex gap-2 items-center mb-1.5 pl-1">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: i === 2 ? config.colors.accent : config.colors.primary }} />
                        <div className="text-[8px] font-bold" style={{ color: config.colors.text }}>{yr}: Milestone</div>
                    </div>
                ))}
            </div>
        ),
        factory: () => ({
            title: "Journey & Milestones",
            content: "Tracing the path that led to where we are today.",
            layoutType: "text-only",
            pullQuote: "Every milestone is proof that the strategy is working.",
            diagram: {
                type: "timeline" as const,
                title: "Key Milestones",
                steps: [
                    { date: "2022", title: "The Beginning", description: "First steps toward building the vision" },
                    { date: "2023", title: "First Traction", description: "Early adopters validate the approach" },
                    { date: "2024", title: "Rapid Growth", description: "Scaling with proven systems" },
                    { date: "2025", title: "Market Leadership", description: "Recognized as the go-to solution" },
                ],
            },
        }),
    },
];

export function ComponentLibrary({ config, onInsertSection }: ComponentLibraryProps) {
    const [search, setSearch] = useState("");
    const [dragComp, setDragComp] = useState<string | null>(null);

    const filtered = COMPONENTS.filter(c =>
        c.label.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: config.colors.accent + "25" }}>
            {/* Header */}
            <div className="px-4 py-3 border-b" style={{ backgroundColor: config.colors.primary + "08", borderColor: config.colors.accent + "20" }}>
                <p className="text-sm font-bold" style={{ color: config.colors.primary }}>⊞ Component Library</p>
                <p className="text-xs mt-0.5" style={{ color: config.colors.secondary }}>Click to add a section</p>
            </div>

            {/* Search */}
            <div className="px-3 pt-3 pb-1">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search components..."
                    className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2"
                    style={{ borderColor: config.colors.accent + "40" }}
                />
            </div>

            {/* Component grid */}
            <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                {filtered.map(comp => (
                    <div
                        key={comp.type}
                        draggable
                        onDragStart={() => setDragComp(comp.type)}
                        onDragEnd={() => setDragComp(null)}
                        className="rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-md group"
                        style={{
                            borderColor: dragComp === comp.type ? config.colors.accent : config.colors.accent + "20",
                            backgroundColor: dragComp === comp.type ? config.colors.accent + "08" : "white",
                            transform: dragComp === comp.type ? "scale(0.97)" : "scale(1)",
                        }}
                        onClick={() => onInsertSection(comp.factory(config))}
                    >
                        {/* Mini preview */}
                        <div className="overflow-hidden" style={{ backgroundColor: config.colors.background }}>
                            {comp.preview(config)}
                        </div>
                        {/* Label */}
                        <div className="px-3 py-2 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold" style={{ color: config.colors.primary }}>
                                    {comp.icon} {comp.label}
                                </p>
                                <p className="text-[10px] opacity-60" style={{ color: config.colors.text }}>{comp.description}</p>
                            </div>
                            <span
                                className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg"
                                style={{ backgroundColor: config.colors.accent, color: "white" }}
                            >
                                + Add
                            </span>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p className="text-center text-xs py-6 opacity-40" style={{ color: config.colors.text }}>
                        No components match "{search}"
                    </p>
                )}
            </div>
        </div>
    );
}
