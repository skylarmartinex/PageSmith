import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface ProfessionalTemplateProps {
  content: EbookContent;
  config: TemplateConfig;
}

export function ProfessionalTemplate({
  content,
  config,
}: ProfessionalTemplateProps) {
  return (
    <div
      className="max-w-4xl mx-auto min-h-screen"
      style={{
        backgroundColor: config.colors.background,
        fontFamily: config.fontFamily,
      }}
    >
      {/* Cover with header bar */}
      <div
        className="p-12"
        style={{
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
        }}
      >
        <div className="text-center py-16">
          {config.logoUrl && (
            <div className="mb-6 flex justify-center">
              <img src={config.logoUrl} alt="Brand logo" className="h-14 w-auto object-contain opacity-90" />
            </div>
          )}
          <div
            className="inline-block px-6 py-2 rounded-full mb-6"
            style={{
              backgroundColor: config.colors.accent,
              color: "#ffffff",
            }}
          >
            Professional Guide
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {content.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-12">
        {content.sections.map((section, index) => (
          <div key={index} className="mb-12">
            {/* Section number badge */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: config.colors.primary }}
              >
                {index + 1}
              </div>
              <h2
                className="text-3xl font-bold flex-1 pt-2"
                style={{ color: config.colors.primary }}
              >
                {section.title}
              </h2>
            </div>

            <div
              className="ml-16 space-y-4"
              style={{ color: config.colors.text }}
            >
              {section.content.split("\n").map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Image */}
            {section.image ? (
              <div className="ml-16 mt-6">
                <div
                  className="rounded-lg border-l-4 overflow-hidden"
                  style={{
                    borderLeftColor: config.colors.accent,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={section.image.url}
                    alt={section.image.alt}
                    className="w-full"
                  />
                </div>
                <p className="text-xs mt-2 ml-2" style={{ color: config.colors.secondary }}>
                  {section.image.attribution}
                </p>
              </div>
            ) : section.imageKeywords.length > 0 && (
              <div
                className="ml-16 mt-6 p-8 rounded-lg border-l-4"
                style={{
                  backgroundColor: config.colors.background,
                  borderLeftColor: config.colors.accent,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ color: config.colors.secondary }}>
                  📷 {section.imageKeywords.join(", ")}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
