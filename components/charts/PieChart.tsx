import { ChartData, TemplateConfig } from "@/lib/templates/types";

interface PieChartProps {
    chart: ChartData;
    config: TemplateConfig;
    donut?: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const s = polarToCartesian(cx, cy, r, startAngle);
    const e = polarToCartesian(cx, cy, r, endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function PieChart({ chart, config, donut = false }: PieChartProps) {
    const total = chart.data.reduce((s, d) => s + d.value, 0) || 1;
    const colors = [config.colors.primary, config.colors.accent, config.colors.secondary, "#8b5cf6", "#f59e0b", "#10b981"];
    const cx = 110;
    const cy = 110;
    const r = 90;
    const innerR = donut ? 50 : 0;

    let currentAngle = 0;

    return (
        <div className="my-6 rounded-2xl border p-5 flex gap-6 items-center" style={{ borderColor: config.colors.accent + "25", backgroundColor: config.colors.primary + "05" }}>
            <div className="flex-shrink-0">
                {chart.title && (
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: config.colors.secondary }}>
                        {chart.title}
                    </p>
                )}
                <svg width={220} height={220} viewBox="0 0 220 220">
                    {chart.data.map((d, i) => {
                        const pct = (d.value / total) * 360;
                        const start = currentAngle;
                        const end = currentAngle + pct - 0.5;
                        currentAngle += pct;
                        const color = d.color || colors[i % colors.length];
                        const path = arcPath(cx, cy, r, start, end);

                        if (donut) {
                            const inner = arcPath(cx, cy, innerR, end, start);
                            return (
                                <path
                                    key={i}
                                    d={`${path} L ${polarToCartesian(cx, cy, innerR, end).x} ${polarToCartesian(cx, cy, innerR, end).y} ${inner} Z`}
                                    fill={color}
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            );
                        }
                        return (
                            <path
                                key={i}
                                d={`${path} L ${cx} ${cy} Z`}
                                fill={color}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                        );
                    })}
                    {donut && (
                        <circle cx={cx} cy={cy} r={innerR - 2} fill="white" />
                    )}
                </svg>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
                {chart.data.map((d, i) => {
                    const color = d.color || colors[i % colors.length];
                    const pct = Math.round((d.value / total) * 100);
                    return (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-xs flex-1" style={{ color: config.colors.text }}>{d.label}</span>
                            <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
