"use client";

import { useEffect, useRef, useState } from "react";
import { TemplateConfig } from "@/lib/templates/types";

interface Props {
    definition: string; // raw mermaid syntax
    config: TemplateConfig;
    title?: string;
}

let mermaidLoaded = false;

export function MermaidDiagram({ definition, config, title }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            try {
                const mermaid = (await import("mermaid")).default;

                if (!mermaidLoaded) {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: "base",
                        themeVariables: {
                            primaryColor: config.colors.primary,
                            primaryTextColor: config.colors.text,
                            primaryBorderColor: config.colors.accent,
                            lineColor: config.colors.secondary,
                            secondaryColor: config.colors.accent + "22",
                            tertiaryColor: config.colors.background,
                            fontSize: "13px",
                            fontFamily: config.fontFamily || "system-ui, sans-serif",
                        },
                        flowchart: { curve: "basis", rankSpacing: 50, nodeSpacing: 40 },
                        sequence: { actorFontSize: 13, messageFontSize: 12 },
                    });
                    mermaidLoaded = true;
                }

                const id = `mermaid-${Math.random().toString(36).slice(2)}`;
                const { svg: renderedSvg } = await mermaid.render(id, definition);
                if (!cancelled) setSvg(renderedSvg);
            } catch (e) {
                console.warn("Mermaid render error:", e);
                if (!cancelled) setError(true);
            }
        }

        render();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [definition]);

    if (error) {
        return (
            <div
                className="my-4 rounded-xl p-4 text-sm opacity-60 border"
                style={{ borderColor: config.colors.accent + "40", color: config.colors.secondary }}
            >
                Diagram could not be rendered.
            </div>
        );
    }

    return (
        <div className="my-4">
            {title && (
                <p
                    className="text-sm font-semibold mb-3 text-center"
                    style={{ color: config.colors.secondary }}
                >
                    {title}
                </p>
            )}
            {svg ? (
                <div
                    ref={containerRef}
                    className="w-full overflow-x-auto rounded-xl"
                    style={{ background: "transparent" }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            ) : (
                <div
                    className="h-24 rounded-xl animate-pulse"
                    style={{ background: config.colors.primary + "10" }}
                />
            )}
        </div>
    );
}
