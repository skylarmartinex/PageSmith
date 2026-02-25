import { ChartData, TemplateConfig } from "@/lib/templates/types";

interface BarChartProps {
    chart: ChartData;
    config: TemplateConfig;
}

export function BarChart({ chart, config }: BarChartProps) {
    const maxVal = Math.max(...chart.data.map((d) => d.value), 1);
    const colors = [config.colors.primary, config.colors.accent, config.colors.secondary];
    const barH = 32;
    const gap = 12;
    const labelW = 120;
    const svgW = 520;
    const chartW = svgW - labelW - 16;
    const svgH = chart.data.length * (barH + gap) + 24;

    return (
        <div className="my-6 rounded-2xl border p-5" style={{ borderColor: config.colors.accent + "25", backgroundColor: config.colors.primary + "05" }}>
            {chart.title && (
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: config.colors.secondary }}>
                    {chart.title}
                </p>
            )}
            <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible">
                {chart.data.map((d, i) => {
                    const y = i * (barH + gap) + 8;
                    const barW = (d.value / maxVal) * chartW;
                    const color = d.color || colors[i % colors.length];
                    return (
                        <g key={i}>
                            {/* Label */}
                            <text x={0} y={y + barH / 2 + 4} fontSize={11} fill={config.colors.secondary} textAnchor="start">
                                {d.label.length > 14 ? d.label.slice(0, 13) + "…" : d.label}
                            </text>
                            {/* Bar background */}
                            <rect x={labelW} y={y} width={chartW} height={barH} rx={6} fill={color + "18"} />
                            {/* Bar fill */}
                            <rect x={labelW} y={y} width={barW} height={barH} rx={6} fill={color} />
                            {/* Value label */}
                            <text x={labelW + barW + 6} y={y + barH / 2 + 4} fontSize={11} fontWeight={700} fill={color}>
                                {d.value}{chart.unit ? ` ${chart.unit}` : ""}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
