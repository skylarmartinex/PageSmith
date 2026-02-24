import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface ProfessionalTemplateProps {
  content: EbookContent;
  config: TemplateConfig;
}

export function ProfessionalTemplate({ content, config }: ProfessionalTemplateProps) {
  return (
    <div
      className="max-w-4xl mx-auto min-h-screen"
      style={{ backgroundColor: config.colors.background, fontFamily: config.fontFamily }}
    >
      {/* Cover with header bar */}
      <div
        className="p-12"
        style={{ background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)` }}
      >
        <div className="text-center py-16">
          {config.logoUrl && (
            <div className="mb-6 flex justify-center">
              <img src={config.logoUrl} alt="Brand logo" className="h-14 w-auto object-contain opacity-90" />
            </div>
          )}
          <div
            className="inline-block px-6 py-2 rounded-full mb-6"
            style={{ backgroundColor: config.colors.accent, color: "#ffffff" }}
          >
            Professional Guide
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{content.title}</h1>
          {content.subtitle && (
            <p className="text-xl text-white/80 italic mb-2">{content.subtitle}</p>
          )}
          {content.author && (
            <p className="text-sm text-white/70 tracking-widest uppercase mt-4">by {content.author}</p>
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
