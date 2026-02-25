"use client";

import { useState } from "react";
import { ChartData, DiagramData, ComparisonTableData, IconGridData, TemplateConfig } from "@/lib/templates/types";
import { RechartsBar } from "./RechartsBar";
import { RechartsLine } from "./RechartsLine";
import { RechartsPie } from "./RechartsPie";
import { RechartsArea } from "./RechartsArea";
import { ProgressChart } from "./ProgressChart";
import { ProcessFlow } from "@/components/diagrams/ProcessFlow";
import { Timeline } from "@/components/diagrams/Timeline";
import { ComparisonTable } from "./ComparisonTable";
import { IconGrid } from "./IconGrid";

interface VizRendererProps {
    chart?: ChartData;
    diagram?: DiagramData;
    comparisonTable?: ComparisonTableData;
    iconGrid?: IconGridData;
    config: TemplateConfig;
    sectionTitle?: string;
}

function AIInfographicToggle({
    chart,
    diagram,
    sectionTitle,
    children,
}: {
    chart?: ChartData;
    diagram?: DiagramData;
    sectionTitle?: string;
    children: React.ReactNode;
}) {
    const [useAI, setUseAI] = useState(false);
    const [aiUrl, setAiUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/imagen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "infographic",
                    title: sectionTitle,
                    chartData: chart || diagram,
                }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error);
            setAiUrl(data.url);
            setUseAI(true);
        } catch {
            // fall back silently
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Toggle button */}
            <div className="flex justify-end mb-2">
                <div className="flex rounded-full overflow-hidden border text-[10px] font-bold" style={{ borderColor: "#e5e7eb" }}>
                    <button
                        onClick={() => setUseAI(false)}
                        className="px-3 py-1 transition-all"
                        style={{ backgroundColor: !useAI ? "#1e40af" : "transparent", color: !useAI ? "white" : "#6b7280" }}
                    >
                        Chart
                    </button>
                    <button
                        onClick={() => { if (!aiUrl) generate(); else setUseAI(true); }}
                        disabled={loading}
                        className="px-3 py-1 transition-all"
                        style={{ backgroundColor: useAI ? "#7c3aed" : "transparent", color: useAI ? "white" : "#9333ea" }}
                    >
                        {loading ? "Generating..." : "✨ AI Infographic"}
                    </button>
                </div>
            </div>

            {/* Content */}
            {useAI && aiUrl ? (
                <img
                    src={aiUrl}
                    alt={sectionTitle || "AI-generated infographic"}
                    className="w-full rounded-2xl shadow-md object-cover"
                    style={{ maxHeight: "400px" }}
                />
            ) : (
                children
            )}
        </div>
    );
}

export function VizRenderer({ chart, diagram, comparisonTable, iconGrid, config, sectionTitle }: VizRendererProps) {
    if (comparisonTable) {
        return <ComparisonTable table={comparisonTable} config={config} />;
    }
    if (iconGrid) {
        return <IconGrid grid={iconGrid} config={config} />;
    }
    if (chart) {
        const renderChart = () => {
            switch (chart.type) {
                case "bar": return <RechartsBar chart={chart} config={config} />;
                case "line": return <RechartsLine chart={chart} config={config} />;
                case "area": return <RechartsArea chart={chart} config={config} />;
                case "pie": return <RechartsPie chart={chart} config={config} />;
                case "donut": return <RechartsPie chart={chart} config={config} donut />;
                case "progress": return <ProgressChart chart={chart} config={config} />;
                default: return null;
            }
        };
        const chartEl = renderChart();
        if (!chartEl) return null;
        return (
            <AIInfographicToggle chart={chart} sectionTitle={sectionTitle}>
                {chartEl}
            </AIInfographicToggle>
        );
    }

    if (diagram) {
        const diagramEl = (() => {
            switch (diagram.type) {
                case "process": return <ProcessFlow diagram={diagram} config={config} />;
                case "timeline": return <Timeline diagram={diagram} config={config} />;
                default: return null;
            }
        })();
        if (!diagramEl) return null;
        return (
            <AIInfographicToggle diagram={diagram} sectionTitle={sectionTitle}>
                {diagramEl}
            </AIInfographicToggle>
        );
    }

    return null;
}
