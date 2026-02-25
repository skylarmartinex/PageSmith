import { DiagramData, TemplateConfig } from "@/lib/templates/types";

interface TimelineProps {
    diagram: DiagramData;
    config: TemplateConfig;
}

export function Timeline({ diagram, config }: TimelineProps) {
    return (
        <div className="my-6 rounded-2xl border p-5" style={{ borderColor: config.colors.accent + "25", backgroundColor: config.colors.primary + "05" }}>
            {diagram.title && (
                <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: config.colors.secondary }}>
                    {diagram.title}
                </p>
            )}
            <div className="relative">
                {/* Vertical line */}
                <div
                    className="absolute left-4 top-2 bottom-2 w-0.5"
                    style={{ backgroundColor: config.colors.accent + "40" }}
                />
                <div className="space-y-6">
                    {diagram.steps.map((step, i) => {
                        const isLast = i === diagram.steps.length - 1;
                        return (
                            <div key={i} className="flex gap-4 items-start">
                                {/* Dot */}
                                <div
                                    className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                                    style={{
                                        backgroundColor: isLast ? config.colors.accent : config.colors.primary,
                                        boxShadow: `0 0 0 3px ${(isLast ? config.colors.accent : config.colors.primary) + "25"}`,
                                    }}
                                >
                                    {i + 1}
                                </div>
                                {/* Content */}
                                <div className="flex-1 pb-1">
                                    {step.date && (
                                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: config.colors.accent }}>
                                            {step.date}
                                        </p>
                                    )}
                                    <p className="text-sm font-bold" style={{ color: config.colors.primary }}>{step.title}</p>
                                    {step.description && (
                                        <p className="text-xs mt-1 leading-relaxed" style={{ color: config.colors.secondary }}>
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
