import { EbookContent, TemplateConfig } from "@/lib/templates/types";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

interface MinimalTemplateProps {
  content: EbookContent;
  config: TemplateConfig;
}

export function MinimalTemplate({ content, config }: MinimalTemplateProps) {
  return (
    <div
      className="max-w-3xl mx-auto min-h-screen"
      style={{
        backgroundColor: config.colors.background,
        color: config.colors.text,
        fontFamily: config.fontFamily,
      }}
    >
      {/* Cover */}
      {content.coverImage ? (
        <div className="relative overflow-hidden" style={{ minHeight: "420px" }}>
          <img
            src={content.coverImage.url}
            alt={content.coverImage.alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.45)" }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${config.colors.background})` }} />
          <div className="relative px-12 py-20 text-center">
            {config.logoUrl && (
              <div className="mb-6 flex justify-center">
                <img src={config.logoUrl} alt="Brand logo" className="h-12 w-auto object-contain" />
              </div>
            )}
            <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">{content.title}</h1>
            {content.subtitle && <p className="text-xl italic text-white/80 mb-4">{content.subtitle}</p>}
            <div className="w-24 h-1 mx-auto" style={{ backgroundColor: config.colors.accent }} />
            {content.author && <p className="mt-4 text-sm tracking-widest uppercase text-white/70">by {content.author}</p>}
          </div>
        </div>
      ) : (
        <div className="mb-0 text-center py-20 px-12">
          {config.logoUrl && (
            <div className="mb-8 flex justify-center">
              <img src={config.logoUrl} alt="Brand logo" className="h-16 w-auto object-contain" />
            </div>
          )}
          <h1 className="text-5xl font-bold mb-4" style={{ color: config.colors.primary }}>{content.title}</h1>
          {content.subtitle && <p className="text-xl mb-4 italic" style={{ color: config.colors.secondary }}>{content.subtitle}</p>}
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: config.colors.accent }} />
          {content.author && <p className="mt-4 text-sm tracking-widest uppercase" style={{ color: config.colors.secondary }}>by {content.author}</p>}
        </div>
      )}

      <TableOfContents content={content} config={config} />

      {content.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} config={config} index={index} />
      ))}
    </div>
  );
}
