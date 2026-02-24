import { EbookContent } from "@/lib/templates/types";
import { TemplateConfig } from "@/lib/templates/types";

interface EbookSection {
  title: string;
  content: string;
  imageKeywords: string[];
  image?: {
    url: string;
    thumb: string;
    alt: string;
    attribution: string;
  };
}

export function renderMinimalToHTML(
  content: EbookContent & { sections: EbookSection[] },
  config: TemplateConfig
): string {
  const sectionsHTML = content.sections
    .map(
      (section) => `
    <div style="margin-bottom: 48px;">
      <h2 style="font-size: 32px; font-weight: 600; margin-bottom: 24px; color: ${config.colors.primary};">
        ${section.title}
      </h2>
      ${section.content
        .split("\n")
        .map((p) => `<p style="margin-bottom: 16px; line-height: 1.75; color: ${config.colors.text};">${p}</p>`)
        .join("")}
      ${
        section.image
          ? `
        <div style="margin-top: 24px;">
          <img src="${section.image.url}" alt="${section.image.alt}" style="width: 100%; border-radius: 8px;" />
          <p style="font-size: 12px; margin-top: 8px; text-align: center; color: ${config.colors.secondary};">
            ${section.image.attribution}
          </p>
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: ${config.fontFamily};
            background-color: ${config.colors.background};
            color: ${config.colors.text};
            padding: 48px;
            max-width: 800px;
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; padding: 80px 0 64px;">
          <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 16px; color: ${config.colors.primary};">
            ${content.title}
          </h1>
          <div style="width: 96px; height: 4px; background-color: ${config.colors.accent}; margin: 0 auto;"></div>
        </div>
        ${sectionsHTML}
      </body>
    </html>
  `;
}

export function renderProfessionalToHTML(
  content: EbookContent & { sections: EbookSection[] },
  config: TemplateConfig
): string {
  const sectionsHTML = content.sections
    .map(
      (section, index) => `
    <div style="margin-bottom: 48px;">
      <div style="display: flex; gap: 16px; margin-bottom: 16px;">
        <div style="flex-shrink: 0; width: 48px; height: 48px; border-radius: 8px; background: ${config.colors.primary}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px;">
          ${index + 1}
        </div>
        <h2 style="font-size: 32px; font-weight: bold; padding-top: 8px; color: ${config.colors.primary};">
          ${section.title}
        </h2>
      </div>
      <div style="margin-left: 64px;">
        ${section.content
          .split("\n")
          .map((p) => `<p style="margin-bottom: 16px; line-height: 1.75; font-size: 18px; color: ${config.colors.text};">${p}</p>`)
          .join("")}
        ${
          section.image
            ? `
          <div style="margin-top: 24px; border-left: 4px solid ${config.colors.accent}; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <img src="${section.image.url}" alt="${section.image.alt}" style="width: 100%;" />
            <p style="font-size: 12px; margin: 8px; color: ${config.colors.secondary};">
              ${section.image.attribution}
            </p>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: ${config.fontFamily};
            background-color: ${config.colors.background};
          }
        </style>
      </head>
      <body>
        <div style="background: linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%); padding: 48px; text-align: center; padding: 64px 48px;">
          <div style="display: inline-block; padding: 8px 24px; border-radius: 999px; background: ${config.colors.accent}; color: white; margin-bottom: 24px;">
            Professional Guide
          </div>
          <h1 style="font-size: 48px; font-weight: bold; color: white; margin-bottom: 16px;">
            ${content.title}
          </h1>
        </div>
        <div style="padding: 48px; max-width: 900px; margin: 0 auto;">
          ${sectionsHTML}
        </div>
      </body>
    </html>
  `;
}

export function renderModernToHTML(
  content: EbookContent & { sections: EbookSection[] },
  config: TemplateConfig
): string {
  const sectionsHTML = content.sections
    .map(
      (section, index) => `
    <div style="margin-bottom: 64px; max-width: 90%; ${index % 2 === 0 ? "" : "margin-left: auto;"}">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
        <div style="width: 8px; height: 64px; border-radius: 999px; background: ${config.colors.accent};"></div>
        <h2 style="font-size: 36px; font-weight: bold; color: ${config.colors.primary};">
          ${section.title}
        </h2>
      </div>
      <div style="padding: 32px; border-radius: 16px; background: white; box-shadow: 0 8px 32px ${config.colors.primary}33;">
        ${section.content
          .split("\n")
          .map((p) => `<p style="margin-bottom: 16px; line-height: 1.75; font-size: 18px; color: ${config.colors.text};">${p}</p>`)
          .join("")}
        ${
          section.image
            ? `
          <div style="margin-top: 24px; padding: 4px; border-radius: 12px; background: linear-gradient(135deg, ${config.colors.primary}, ${config.colors.accent});">
            <img src="${section.image.url}" alt="${section.image.alt}" style="width: 100%; border-radius: 8px;" />
            <p style="font-size: 12px; margin-top: 8px; text-align: center; color: ${config.colors.primary}; padding: 8px;">
              ${section.image.attribution}
            </p>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: ${config.fontFamily};
            background-color: ${config.colors.background};
          }
        </style>
      </head>
      <body>
        <div style="position: relative; padding: 48px; overflow: hidden;">
          <div style="position: absolute; top: 0; right: 0; width: 256px; height: 256px; border-radius: 50%; background: ${config.colors.primary}; opacity: 0.1;"></div>
          <div style="position: absolute; bottom: 0; left: 0; width: 192px; height: 192px; border-radius: 50%; background: ${config.colors.accent}; opacity: 0.1;"></div>
          <div style="position: relative; text-align: center; padding: 80px 0;">
            <h1 style="font-size: 60px; font-weight: 900; margin-bottom: 24px; background: linear-gradient(135deg, ${config.colors.primary}, ${config.colors.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              ${content.title}
            </h1>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <div style="width: 64px; height: 8px; border-radius: 999px; background: ${config.colors.primary};"></div>
              <div style="width: 64px; height: 8px; border-radius: 999px; background: ${config.colors.accent};"></div>
              <div style="width: 64px; height: 8px; border-radius: 999px; background: ${config.colors.secondary};"></div>
            </div>
          </div>
        </div>
        <div style="padding: 48px; max-width: 1000px; margin: 0 auto;">
          ${sectionsHTML}
        </div>
      </body>
    </html>
  `;
}

export function renderToHTML(
  content: EbookContent & { sections: EbookSection[] },
  config: TemplateConfig,
  templateId: string
): string {
  switch (templateId) {
    case "professional":
      return renderProfessionalToHTML(content, config);
    case "modern":
      return renderModernToHTML(content, config);
    default:
      return renderMinimalToHTML(content, config);
  }
}
