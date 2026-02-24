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
      {/* Cover */}
      <div
        className="relative overflow-hidden"
        style={{
          background: content.coverImage
            ? undefined
            : `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
          minHeight: "400px",
        }}
      >
        {content.coverImage && (
          <>
            <img src={content.coverImage.url} alt={content.coverImage.alt} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.35)" }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${config.colors.primary}cc 0%, ${config.colors.secondary}99 100%)` }} />
          </>
        )}
        <div className="relative text-center py-16 px-12">
          {config.logoUrl && (
            <div className="mb-6 flex justify-center">
              <img src={config.logoUrl} alt="Brand logo" className="h-14 w-auto object-contain opacity-90" />
            </div>
          )}
          <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ backgroundColor: config.colors.accent, color: "#ffffff" }}>
            Professional Guide
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{content.title}</h1>
          {content.subtitle && <p className="text-xl text-white/80 italic mb-2">{content.subtitle}</p>}
          {content.author && <p className="text-sm text-white/70 tracking-widest uppercase mt-4">by {content.author}</p>}
        </div>
      </div>

      <TableOfContents content={content} config={config} />

      {content.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} config={config} index={index} />
      ))}
    </div>
  );
}
