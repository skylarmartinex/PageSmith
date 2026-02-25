"use client";

import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ChartData, TemplateConfig } from "@/lib/templates/types";

interface Props {
    chart: ChartData;
    config: TemplateConfig;
}

export function RechartsLine({ chart, config }: Props) {
    const data = chart.data.map((d) => ({ name: d.label, value: d.value }));

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
            <ResponsiveContainer width="100%" height={220}>
                <RechartsLineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={config.colors.text + "15"} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: config.colors.secondary }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: config.colors.secondary }}
                        axisLine={false}
                        tickLine={false}
                        unit={chart.unit ? ` ${chart.unit}` : ""}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: config.colors.background,
                            border: `1px solid ${config.colors.accent}40`,
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        formatter={(val) => [`${val}${chart.unit || ""}`, chart.title || "Value"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={config.colors.primary}
                        strokeWidth={2.5}
                        dot={{ fill: config.colors.accent, r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: config.colors.accent }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
