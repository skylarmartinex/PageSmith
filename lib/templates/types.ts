export interface EbookSection {
  title: string;
  content: string;
  imageKeywords: string[];
}

export interface EbookContent {
  title: string;
  sections: EbookSection[];
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  colors: TemplateColors;
  fontFamily: string;
  thumbnail?: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design with plenty of white space",
    colors: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      background: "#ffffff",
      text: "#333333",
    },
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Business-focused design with structured layout",
    colors: {
      primary: "#1e3a8a",
      secondary: "#3b82f6",
      accent: "#f59e0b",
      background: "#f8fafc",
      text: "#1e293b",
    },
    fontFamily: "Georgia, serif",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold and contemporary with vibrant colors",
    colors: {
      primary: "#7c3aed",
      secondary: "#a78bfa",
      accent: "#ec4899",
      background: "#faf5ff",
      text: "#1f2937",
    },
    fontFamily: "Inter, system-ui, sans-serif",
  },
];
