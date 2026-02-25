import { ChartData, TemplateConfig } from "@/lib/templates/types";

interface ProgressChartProps {
    chart: ChartData;
    config: TemplateConfig;
}

export function ProgressChart({ chart, config }: ProgressChartProps) {
    const colors = [config.colors.primary, config.colors.accent, config.colors.secondary, "#8b5cf6", "#f59e0b"];

    return (
        <div className="my-6 rounded-2xl border p-5 space-y-4" style={{ borderColor: config.colors.accent + "25", backgroundColor: config.colors.primary + "05" }}>
            {chart.title && (
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: config.colors.secondary }}>
                    {chart.title}
                </p>
            )}
            {chart.data.map((d, i) => {
                const color = d.color || colors[i % colors.length];
                const pct = Math.min(d.value, 100);
                return (
                    <div key={i}>
                        <div className="flex justify-between items-baseline mb-1.5">
                            <span className="text-sm font-medium" style={{ color: config.colors.text }}>{d.label}</span>
                            <span className="text-sm font-bold tabular-nums" style={{ color }}>{d.value}{chart.unit || "%"}</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full" style={{ backgroundColor: color + "20" }}>
                            <div
                                className="h-2.5 rounded-full transition-all"
                                style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
