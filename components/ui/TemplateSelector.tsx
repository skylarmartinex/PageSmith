"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/templates/types";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

// Mini layout sketch for each template style
function MiniPreview({ templateId, colors }: { templateId: string; colors: Record<string, string> }) {
  const { primary, secondary, accent, background, text } = colors;

  if (templateId === "bold") {
    return (
      <div className="w-full h-24 rounded overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="h-10 flex items-center px-2" style={{ backgroundColor: primary }}>
          <div className="w-16 h-2 rounded" style={{ backgroundColor: "#fff" }} />
        </div>
        <div className="p-2 space-y-1">
          <div className="flex gap-1 items-center">
            <div className="w-4 h-3 rounded-sm text-[5px] flex items-center justify-center" style={{ color: primary, opacity: 0.5 }}>01</div>
            <div className="h-1.5 w-12 rounded" style={{ backgroundColor: "#e8e8e8", opacity: 0.7 }} />
          </div>
          <div className="border-l-2 pl-1" style={{ borderColor: accent }}>
            <div className="h-1 w-14 rounded opacity-40" style={{ backgroundColor: "#e8e8e8" }} />
            <div className="h-1 w-10 rounded opacity-40 mt-0.5" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "tech") {
    return (
      <div className="w-full h-24 rounded overflow-hidden flex" style={{ backgroundColor: "#0f1117" }}>
        <div className="w-1" style={{ background: `linear-gradient(180deg, ${primary}, ${accent})` }} />
        <div className="flex-1 p-2">
          <div className="flex gap-0.5 mb-1.5">
            {["#ef4444", "#eab308", "#22c55e"].map((c, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="h-1 w-8 rounded mb-2" style={{ backgroundColor: accent, opacity: 0.6 }} />
          <div className="h-1.5 w-14 rounded mb-1" style={{ backgroundColor: "#e8e8e8", opacity: 0.7 }} />
          <div className="h-1 w-12 rounded" style={{ backgroundColor: "#9ca3af", opacity: 0.4 }} />
          <div className="h-1 w-10 rounded mt-0.5" style={{ backgroundColor: "#9ca3af", opacity: 0.4 }} />
        </div>
      </div>
    );
  }

  if (templateId === "elegant") {
    return (
      <div className="w-full h-24 rounded overflow-hidden p-3" style={{ backgroundColor: background }}>
        <div className="flex items-center gap-1 mb-2">
          <div className="h-px flex-1" style={{ backgroundColor: accent }} />
          <div className="text-[6px]" style={{ color: accent }}>✦</div>
          <div className="h-px flex-1" style={{ backgroundColor: accent }} />
        </div>
        <div className="h-2 w-16 rounded mx-auto mb-1" style={{ backgroundColor: primary, opacity: 0.8 }} />
        <div className="flex items-center gap-1 mt-2">
          <div className="h-px w-4" style={{ backgroundColor: accent }} />
          <div className="h-1 w-10 rounded" style={{ backgroundColor: secondary, opacity: 0.5 }} />
          <div className="h-px w-4" style={{ backgroundColor: accent }} />
        </div>
      </div>
    );
  }

  if (templateId === "gradient") {
    return (
      <div className="w-full h-24 rounded overflow-hidden">
        <div className="h-10 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
          <div className="h-2 w-16 rounded" style={{ backgroundColor: "rgba(255,255,255,0.8)" }} />
        </div>
        <div className="p-2" style={{ backgroundColor: background }}>
          <div className="inline-block px-1 rounded-full h-1.5 w-6 mb-1" style={{ backgroundColor: primary + "20" }} />
          <div className="h-1.5 w-14 rounded mb-1" style={{ backgroundColor: primary, opacity: 0.7 }} />
          <div className="h-1 w-12 rounded" style={{ backgroundColor: text, opacity: 0.3 }} />
        </div>
      </div>
    );
  }

  if (templateId === "warm") {
    return (
      <div className="w-full h-24 rounded overflow-hidden p-3" style={{ backgroundColor: background }}>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: accent + "50" }} />
          <div className="h-1.5 w-12 rounded" style={{ backgroundColor: primary, opacity: 0.7 }} />
        </div>
        <div className="rounded-xl p-2" style={{ backgroundColor: primary + "12" }}>
          <div className="h-1 w-14 rounded mb-1" style={{ backgroundColor: text, opacity: 0.4 }} />
          <div className="h-1 w-10 rounded" style={{ backgroundColor: text, opacity: 0.3 }} />
        </div>
      </div>
    );
  }

  if (templateId === "editorial") {
    return (
      <div className="w-full h-24 rounded overflow-hidden" style={{ backgroundColor: background }}>
        <div className="h-12 relative flex items-end px-2 pb-1.5" style={{ backgroundColor: "#111" }}>
          <div className="absolute top-1.5 left-2 w-6 h-0.5 rounded" style={{ backgroundColor: accent }} />
          <div className="h-2 w-16 rounded" style={{ backgroundColor: "rgba(255,255,255,0.85)" }} />
        </div>
        <div className="p-2 space-y-1">
          <div className="h-1 w-12 rounded" style={{ backgroundColor: text, opacity: 0.5 }} />
          <div className="h-1 w-14 rounded" style={{ backgroundColor: text, opacity: 0.3 }} />
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1 h-3 rounded" style={{ backgroundColor: accent }} />
            <div className="h-1 w-10 rounded" style={{ backgroundColor: text, opacity: 0.4 }} />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "luxury") {
    return (
      <div className="w-full h-24 rounded overflow-hidden p-3" style={{ backgroundColor: primary }}>
        <div className="h-px w-full mb-2" style={{ backgroundColor: accent }} />
        <div className="text-center">
          <div className="h-1 w-4 rounded mx-auto mb-1.5" style={{ backgroundColor: accent, opacity: 0.6 }} />
          <div className="h-2 w-16 rounded mx-auto mb-1.5" style={{ backgroundColor: "rgba(255,255,255,0.85)" }} />
          <div className="h-1 w-10 rounded mx-auto" style={{ backgroundColor: accent, opacity: 0.5 }} />
        </div>
        <div className="h-px w-full mt-2" style={{ backgroundColor: accent }} />
      </div>
    );
  }

  // Generic preview for minimal, professional, modern
  return (
    <div className="w-full h-24 rounded overflow-hidden" style={{ backgroundColor: background }}>
      <div className="h-10 flex items-end px-2 pb-1.5" style={{ backgroundColor: primary }}>
        <div className="h-2 w-16 rounded" style={{ backgroundColor: "rgba(255,255,255,0.85)" }} />
      </div>
      <div className="p-2 space-y-1">
        <div className="h-1.5 w-12 rounded" style={{ backgroundColor: primary, opacity: 0.7 }} />
        <div className="h-1 w-16 rounded" style={{ backgroundColor: text, opacity: 0.3 }} />
        <div className="h-1 w-14 rounded" style={{ backgroundColor: text, opacity: 0.25 }} />
        <div className="h-px w-full mt-1" style={{ backgroundColor: accent, opacity: 0.4 }} />
      </div>
    </div>
  );
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">Template</label>

      {/* Hover preview */}
      <div
        className="transition-all duration-200 overflow-hidden"
        style={{ maxHeight: hoveredId ? "120px" : "0px", opacity: hoveredId ? 1 : 0 }}
      >
        {hoveredId && (
          <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <MiniPreview
              templateId={hoveredId}
              colors={(TEMPLATES.find((t) => t.id === hoveredId)?.colors ?? {}) as unknown as Record<string, string>}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`text-left px-3 py-2.5 rounded-lg border-2 transition-all ${selectedTemplate === template.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-400 bg-white"
              }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">{template.name}</h3>
                <p className="text-xs text-gray-500 truncate">{template.description}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {Object.values(template.colors)
                  .slice(0, 3)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-sm border border-white/50 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
