import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface MinimalTemplateProps {
  content: EbookContent;
  config: TemplateConfig;
}

export function MinimalTemplate({ content, config }: MinimalTemplateProps) {
  return (
    <div
      className="max-w-3xl mx-auto p-12 min-h-screen"
      style={{
        backgroundColor: config.colors.background,
        color: config.colors.text,
        fontFamily: config.fontFamily,
      }}
    >
      {/* Cover */}
      <div className="mb-16 text-center py-20">
        <h1
          className="text-5xl font-bold mb-4"
          style={{ color: config.colors.primary }}
        >
          {content.title}
        </h1>
        <div
          className="w-24 h-1 mx-auto"
          style={{ backgroundColor: config.colors.accent }}
        />
      </div>

      {/* Sections */}
      {content.sections.map((section, index) => (
        <div key={index} className="mb-12">
          <h2
            className="text-3xl font-semibold mb-6"
            style={{ color: config.colors.primary }}
          >
            {section.title}
          </h2>
          <div
            className="prose prose-lg max-w-none leading-relaxed"
            style={{ color: config.colors.text }}
          >
            {section.content.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image */}
          {section.image ? (
            <div className="mt-6">
              <img
                src={section.image.url}
                alt={section.image.alt}
                className="w-full rounded-lg"
              />
              <p className="text-xs mt-2 text-center" style={{ color: config.colors.secondary }}>
                {section.image.attribution}
              </p>
            </div>
          ) : section.imageKeywords.length > 0 && (
            <div
              className="mt-6 p-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: config.colors.secondary + "20",
                border: `2px dashed ${config.colors.secondary}`,
              }}
            >
              <span style={{ color: config.colors.secondary }}>
                📷 Image: {section.imageKeywords[0]}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
