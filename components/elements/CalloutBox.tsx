import { AlertCircle, Info, Lightbulb, CheckCircle } from "lucide-react";

type CalloutType = "info" | "tip" | "warning" | "success";

interface CalloutBoxProps {
  type: CalloutType;
  title?: string;
  content: string;
  accentColor: string;
}

const CALLOUT_ICONS = {
  info: Info,
  tip: Lightbulb,
  warning: AlertCircle,
  success: CheckCircle,
};

const CALLOUT_STYLES = {
  info: { bg: "#eff6ff", border: "#3b82f6" },
  tip: { bg: "#fefce8", border: "#eab308" },
  warning: { bg: "#fef2f2", border: "#ef4444" },
  success: { bg: "#f0fdf4", border: "#22c55e" },
};

export function CalloutBox({ type, title, content, accentColor }: CalloutBoxProps) {
  const Icon = CALLOUT_ICONS[type];
  const style = CALLOUT_STYLES[type];

  return (
    <div
      className="flex gap-4 p-6 rounded-lg my-6"
      style={{
        backgroundColor: style.bg,
        border: `2px solid ${style.border}`,
      }}
    >
      <Icon className="flex-shrink-0 mt-1" size={24} style={{ color: style.border }} />
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-2" style={{ color: style.border }}>
            {title}
          </h4>
        )}
        <p className="leading-relaxed" style={{ color: "#374151" }}>
          {content}
        </p>
      </div>
    </div>
  );
}
