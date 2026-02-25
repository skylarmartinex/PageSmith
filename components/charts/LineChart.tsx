import { ChartData, TemplateConfig } from "@/lib/templates/types";

interface LineChartProps {
    chart: ChartData;
    config: TemplateConfig;
}

export function LineChart({ chart, config }: LineChartProps) {
    const W = 520;
    const H = 200;
    const padL = 40;
    const padB = 28;
    const padT = 12;
    const padR = 16;
    const chartW = W - padL - padR;
    const chartH = H - padB - padT;

    const values = chart.data.map((d) => d.value);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal || 1;

    const toX = (i: number) => padL + (i / (chart.data.length - 1)) * chartW;
    const toY = (v: number) => padT + chartH - ((v - minVal) / range) * chartH;

    const points = chart.data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(" ");
    const areaPoints = [
        `${padL},${padT + chartH}`,
        ...chart.data.map((d, i) => `${toX(i)},${toY(d.value)}`),
        `${padL + chartW},${padT + chartH}`,
    ].join(" ");

    return (
        <div className="my-6 rounded-2xl border p-5" style={{ borderColor: config.colors.accent + "25", backgroundColor: config.colors.primary + "05" }}>
            {chart.title && (
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: config.colors.secondary }}>
                    {chart.title}
                </p>
            )}
            <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                    const y = padT + frac * chartH;
                    const val = maxVal - frac * range;
                    return (
                        <g key={frac}>
                            <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke={config.colors.accent + "20"} strokeWidth={1} />
                            <text x={padL - 4} y={y + 4} fontSize={9} fill={config.colors.secondary} textAnchor="end">
                                {Math.round(val)}{chart.unit ? chart.unit : ""}
                            </text>
                        </g>
                    );
                })}
                {/* Area fill */}
                <polygon points={areaPoints} fill={config.colors.primary + "15"} />
                {/* Line */}
                <polyline points={points} fill="none" stroke={config.colors.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                {/* Dots + labels */}
                {chart.data.map((d, i) => (
                    <g key={i}>
                        <circle cx={toX(i)} cy={toY(d.value)} r={4} fill={config.colors.primary} stroke="#fff" strokeWidth={1.5} />
                        <text x={toX(i)} y={padT + chartH + 16} fontSize={9} fill={config.colors.secondary} textAnchor="middle">
                            {d.label.length > 8 ? d.label.slice(0, 7) + "…" : d.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
