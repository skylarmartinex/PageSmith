import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface TableOfContentsProps {
    content: EbookContent;
    config: TemplateConfig;
}

export function TableOfContents({ content, config }: TableOfContentsProps) {
    return (
        <div
            className="px-12 py-10 border-b"
            style={{
                backgroundColor: config.colors.background,
                borderColor: config.colors.accent + "30",
                fontFamily: config.fontFamily,
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: config.colors.accent }} />
                <h2
                    className="text-xs font-bold uppercase tracking-[0.25em]"
                    style={{ color: config.colors.secondary }}
                >
                    Contents
                </h2>
            </div>

            {/* Entries */}
            <ol className="space-y-2">
                {content.sections.map((section, i) => (
                    <li key={i} className="flex items-baseline gap-3">
                        <span
                            className="text-xs font-bold w-5 flex-shrink-0 tabular-nums"
                            style={{ color: config.colors.accent }}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 flex items-baseline gap-2 min-w-0">
                            <span
                                className="text-sm font-medium truncate"
                                style={{ color: config.colors.text }}
                            >
                                {section.title}
                            </span>
                            <div
                                className="flex-1 border-b border-dotted min-w-[20px]"
                                style={{ borderColor: config.colors.accent + "30" }}
                            />
                            <span
                                className="text-xs flex-shrink-0"
                                style={{ color: config.colors.secondary }}
                            >
                                {i + 1}
                            </span>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
