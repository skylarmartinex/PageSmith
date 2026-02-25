export type SectionLayout = "text-only" | "image-right" | "image-left" | "image-full" | "image-grid" | "image-overlay";

export interface ImageAsset {
  url: string;
  thumb: string;
  alt: string;
  attribution: string;
}

export interface SectionCallout {
  type: "tip" | "warning" | "insight";
  text: string;
}

export interface SectionStat {
  label: string;
  value: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartData {
  type: "bar" | "line" | "pie" | "donut" | "progress";
  title?: string;
  unit?: string;
  data: ChartDataPoint[];
}

export interface DiagramStep {
  title: string;
  description?: string;
  date?: string;
}

export interface DiagramData {
  type: "process" | "timeline";
  title?: string;
  steps: DiagramStep[];
}

export interface EbookSection {
  title: string;
  content: string;
  imageKeywords: string[];
  layoutType?: SectionLayout;
  pullQuote?: string;
  callout?: SectionCallout;
  stats?: SectionStat[];
  iconName?: string;
  chart?: ChartData;
  diagram?: DiagramData;
  /** Legacy single image (kept for backward compat) */
  image?: ImageAsset;
  /** Multiple images (new) */
  images?: ImageAsset[];
}

export interface EbookContent {
  title: string;
  subtitle?: string;
  author?: string;
  coverImage?: ImageAsset;
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
  logoUrl?: string;
}

export interface BrandConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  logoUrl: string;
  /** 2-5 sentences in the brand's voice — Claude will match the style */
  brandVoice?: string;
  /** Target reader persona — Claude writes for this audience */
  targetPersona?: string;
}

export interface BrandPreset {
  name: string;
  config: BrandConfig;
}

export const DEFAULT_BRAND: BrandConfig = {
  primaryColor: "",
  secondaryColor: "",
  accentColor: "",
  backgroundColor: "",
  textColor: "",
  fontFamily: "",
  logoUrl: "",
};

/** Merges brand overrides onto a template config. Only non-empty brand fields override. */
export function applyBrandToConfig(
  base: TemplateConfig,
  brand: BrandConfig | null
): TemplateConfig {
  if (!brand) return base;
  return {
    ...base,
    colors: {
      primary: brand.primaryColor || base.colors.primary,
      secondary: brand.secondaryColor || base.colors.secondary,
      accent: brand.accentColor || base.colors.accent,
      background: brand.backgroundColor || base.colors.background,
      text: brand.textColor || base.colors.text,
    },
    fontFamily: brand.fontFamily || base.fontFamily,
    logoUrl: brand.logoUrl || base.logoUrl,
  };
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
  {
    id: "bold",
    name: "Bold",
    description: "Dark editorial style with oversized type and strong contrast",
    colors: {
      primary: "#e63946",
      secondary: "#ff6b6b",
      accent: "#ffd166",
      background: "#0a0a0a",
      text: "#e8e8e8",
    },
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Luxury serif with decorative chapter dividers",
    colors: {
      primary: "#2d3a2e",
      secondary: "#6b7f6c",
      accent: "#c9a96e",
      background: "#faf8f4",
      text: "#2d3a2e",
    },
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Full-bleed gradient covers, modern SaaS look",
    colors: {
      primary: "#0ea5e9",
      secondary: "#38bdf8",
      accent: "#818cf8",
      background: "#f8fafc",
      text: "#0f172a",
    },
    fontFamily: "Inter, system-ui, sans-serif",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Dark terminal-style with monospace type and sidebar accent",
    colors: {
      primary: "#22c55e",
      secondary: "#4ade80",
      accent: "#86efac",
      background: "#0f1117",
      text: "#e8e8e8",
    },
    fontFamily: "JetBrains Mono, Fira Code, monospace",
  },
  {
    id: "warm",
    name: "Warm",
    description: "Earthy tones, rounded corners, cozy lifestyle aesthetic",
    colors: {
      primary: "#9b6b47",
      secondary: "#c49a77",
      accent: "#e8a87c",
      background: "#fdf8f4",
      text: "#4a3728",
    },
    fontFamily: "Georgia, serif",
  },
];

