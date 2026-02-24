import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface ModernTemplateProps {
  content: EbookContent;
  config: TemplateConfig;
}

export function ModernTemplate({ content, config }: ModernTemplateProps) {
  return (
    <div
      className="max-w-4xl mx-auto min-h-screen"
      style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily }}
    >
      {/* Cover */}
      <div
        className="p-12 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${config.colors.background} 0%, ${config.colors.primary}15 100%)` }}
      >
        <div className="relative text-center py-20">
          {config.logoUrl && (
            <div className="mb-8 flex justify-center">
              <img src={config.logoUrl} alt="Brand logo" className="h-14 w-auto object-contain" />
            </div>
          )}
          <h1
            className="text-6xl font-black mb-6 tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {content.title}
          </h1>
          <div className="flex justify-center gap-2">
            <div className="w-16 h-2 rounded-full" style={{ backgroundColor: config.colors.primary }} />
            <div className="w-16 h-2 rounded-full" style={{ backgroundColor: config.colors.accent }} />
            <div className="w-16 h-2 rounded-full" style={{ backgroundColor: config.colors.secondary }} />
          </div>
          {content.subtitle && (
            <p className="text-lg mt-4 italic" style={{ color: config.colors.secondary }}>{content.subtitle}</p>
          )}
          {content.author && (
            <p className="text-sm mt-3 tracking-widest uppercase" style={{ color: config.colors.secondary }}>by {content.author}</p>
          )}
        </div>
      </div>

      <TableOfContents content={content} config={config} />

      {content.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} config={config} index={index} />
      ))}
    </div>
  );
}
