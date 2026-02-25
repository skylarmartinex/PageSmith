import { TemplateConfig } from "@/lib/templates/types";

export interface IconGridItem {
    icon: string;   // Lucide icon name
    title: string;
    description: string;
}

export interface IconGridData {
    title?: string;
    columns?: 2 | 3 | 4;
    items: IconGridItem[];
}

import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

function GridIcon({ name, color }: { name: string; color: string }) {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;
    const Icon = icons[name];
    if (!Icon) return <span style={{ color, fontSize: 24 }}>✦</span>;
    return <Icon size={24} color={color} strokeWidth={1.75} />;
}

interface IconGridProps {
    grid: IconGridData;
    config: TemplateConfig;
}

export function IconGrid({ grid, config }: IconGridProps) {
    const cols = grid.columns || Math.min(grid.items.length, 3);
    const colClass =
        cols === 2 ? "grid-cols-2"
            : cols === 4 ? "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3";

    return (
        <div className="my-6">
            {grid.title && (
                <p
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color: config.colors.secondary }}
                >
                    {grid.title}
                </p>
            )}
            <div className={`grid ${colClass} gap-4`}>
                {grid.items.map((item, i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-2 rounded-2xl p-4 transition-all"
                        style={{ backgroundColor: config.colors.accent + "0d", border: `1px solid ${config.colors.accent}20` }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: config.colors.accent + "20" }}
                        >
                            <GridIcon name={item.icon} color={config.colors.accent} />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight mb-0.5" style={{ color: config.colors.primary }}>
                                {item.title}
                            </p>
                            <p className="text-xs leading-relaxed opacity-75" style={{ color: config.colors.text }}>
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
