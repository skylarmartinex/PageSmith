"use client";

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ChartData, TemplateConfig } from "@/lib/templates/types";

interface Props {
    chart: ChartData;
    config: TemplateConfig;
    donut?: boolean;
}

// Build a pleasing palette from the template's two main colors
function buildPalette(primary: string, accent: string, count: number): string[] {
    const base = [
        primary,
        accent,
        primary + "bb",
        accent + "bb",
        primary + "77",
        accent + "77",
        "#94a3b8",
        "#64748b",
    ];
    return Array.from({ length: count }, (_, i) => base[i % base.length]);
}

export function RechartsPie({ chart, config, donut = false }: Props) {
    const data = chart.data.map((d) => ({ name: d.label, value: d.value }));
    const colors = buildPalette(config.colors.primary, config.colors.accent, data.length);

    return (
        <div className="my-4">
            {chart.title && (
                <p
                    className="text-sm font-semibold mb-3 text-center"
                    style={{ color: config.colors.secondary }}
                >
                    {chart.title}
                </p>
            )}
            <ResponsiveContainer width="100%" height={240}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={donut ? 55 : 0}
                        outerRadius={90}
                        paddingAngle={donut ? 3 : 1}
                        dataKey="value"
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={colors[i]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: config.colors.background,
                            border: `1px solid ${config.colors.accent}40`,
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        formatter={(val) => [`${val}${chart.unit || ""}`, ""]}
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "11px", color: config.colors.secondary }}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}
