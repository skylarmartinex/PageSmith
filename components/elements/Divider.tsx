type DividerStyle = "line" | "dots" | "wave" | "stars";

interface DividerProps {
  style?: DividerStyle;
  accentColor: string;
  spacing?: "sm" | "md" | "lg";
}

export function Divider({ style = "line", accentColor, spacing = "md" }: DividerProps) {
  const spacingClasses = {
    sm: "my-4",
    md: "my-8",
    lg: "my-12",
  };

  const renderDivider = () => {
    switch (style) {
      case "dots":
        return (
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            ))}
          </div>
        );
      
      case "wave":
        return (
          <svg
            className="w-full h-3"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0,5 Q25,0 50,5 T100,5"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
            />
          </svg>
        );
      
      case "stars":
        return (
          <div className="flex justify-center gap-4 text-2xl" style={{ color: accentColor }}>
            ✦ ✦ ✦
          </div>
        );
      
      default:
        return (
          <div
            className="w-full h-px"
            style={{ backgroundColor: accentColor + "40" }}
          />
        );
    }
  };

  return <div className={spacingClasses[spacing]}>{renderDivider()}</div>;
}
