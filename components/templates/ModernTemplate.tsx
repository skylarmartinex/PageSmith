import { EbookContent, TemplateConfig } from "@/lib/templates/types";

interface ModernTemplateProps {
  content: EbookContent;
  config: TemplateConfig;
}

export function ModernTemplate({ content, config }: ModernTemplateProps) {
  return (
    <div
      className="max-w-5xl mx-auto min-h-screen"
      style={{
        backgroundColor: config.colors.background,
        fontFamily: config.fontFamily,
      }}
    >
      {/* Modern cover with geometric elements */}
      <div className="relative p-12 overflow-hidden">
        {/* Geometric background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full"
            style={{ backgroundColor: config.colors.primary }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full"
            style={{ backgroundColor: config.colors.accent }}
          />
        </div>

        <div className="relative text-center py-20">
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
            <div
              className="w-16 h-2 rounded-full"
              style={{ backgroundColor: config.colors.primary }}
            />
            <div
              className="w-16 h-2 rounded-full"
              style={{ backgroundColor: config.colors.accent }}
            />
            <div
              className="w-16 h-2 rounded-full"
              style={{ backgroundColor: config.colors.secondary }}
            />
          </div>
        </div>
      </div>

      {/* Content with alternating layouts */}
      <div className="p-12">
        {content.sections.map((section, index) => (
          <div
            key={index}
            className={`mb-16 ${index % 2 === 0 ? "" : "ml-auto"}`}
            style={{ maxWidth: "90%" }}
          >
            {/* Title with accent bar */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-2 h-16 rounded-full"
                style={{ backgroundColor: config.colors.accent }}
              />
              <h2
                className="text-4xl font-bold"
                style={{ color: config.colors.primary }}
              >
                {section.title}
              </h2>
            </div>

            {/* Content card */}
            <div
              className="p-8 rounded-2xl"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: `0 8px 32px ${config.colors.primary}20`,
              }}
            >
              <div
                className="space-y-4 text-lg leading-relaxed"
                style={{ color: config.colors.text }}
              >
                {section.content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Image placeholder with gradient border */}
              {section.imageKeywords.length > 0 && (
                <div className="mt-6 p-1 rounded-xl bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.accent})`,
                  }}
                >
                  <div
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: config.colors.background }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: config.colors.primary }}
                    >
                      🖼️ {section.imageKeywords.join(" • ")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
