import { DiagramData, TemplateConfig } from "@/lib/templates/types";

interface ProcessFlowProps {
    diagram: DiagramData;
    config: TemplateConfig;
}

export function ProcessFlow({ diagram, config }: ProcessFlowProps) {
    return (
        <div className="my-6 rounded-2xl border p-5" style={{ borderColor: config.colors.accent + "25", backgroundColor: config.colors.primary + "05" }}>
            {diagram.title && (
                <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: config.colors.secondary }}>
                    {diagram.title}
                </p>
            )}
            <div className="flex flex-wrap gap-0 items-start">
                {diagram.steps.map((step, i) => (
                    <div key={i} className="flex items-start">
                        {/* Step card */}
                        <div className="w-36 flex-shrink-0">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white mb-2"
                                style={{ backgroundColor: config.colors.primary }}
                            >
                                {i + 1}
                            </div>
                            <p className="text-sm font-bold leading-snug mb-1" style={{ color: config.colors.primary }}>
                                {step.title}
                            </p>
                            {step.description && (
                                <p className="text-xs leading-relaxed" style={{ color: config.colors.secondary }}>
                                    {step.description}
                                </p>
                            )}
                        </div>
                        {/* Arrow connector */}
                        {i < diagram.steps.length - 1 && (
                            <div className="flex items-start mt-3 mx-1 flex-shrink-0">
                                <svg width={28} height={20} viewBox="0 0 28 20">
                                    <line x1={2} y1={10} x2={22} y2={10} stroke={config.colors.accent} strokeWidth={2} />
                                    <polygon points="18,5 28,10 18,15" fill={config.colors.accent} />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
