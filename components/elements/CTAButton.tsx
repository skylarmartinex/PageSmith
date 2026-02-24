import { ArrowRight, Download, ExternalLink, Mail } from "lucide-react";

type CTAIcon = "arrow" | "download" | "external" | "mail";
type CTAStyle = "solid" | "outline" | "ghost";

interface CTAButtonProps {
  text: string;
  icon?: CTAIcon;
  style?: CTAStyle;
  accentColor: string;
  size?: "sm" | "md" | "lg";
}

const CTA_ICONS = {
  arrow: ArrowRight,
  download: Download,
  external: ExternalLink,
  mail: Mail,
};

export function CTAButton({
  text,
  icon = "arrow",
  style = "solid",
  accentColor,
  size = "md",
}: CTAButtonProps) {
  const Icon = CTA_ICONS[icon];

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const getButtonStyle = () => {
    switch (style) {
      case "outline":
        return {
          backgroundColor: "transparent",
          color: accentColor,
          border: `2px solid ${accentColor}`,
        };
      case "ghost":
        return {
          backgroundColor: `${accentColor}10`,
          color: accentColor,
          border: "none",
        };
      default:
        return {
          backgroundColor: accentColor,
          color: "#ffffff",
          border: "none",
        };
    }
  };

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all hover:opacity-90 hover:scale-105 ${sizeClasses[size]}`}
      style={getButtonStyle()}
    >
      {text}
      <Icon size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
    </button>
  );
}
