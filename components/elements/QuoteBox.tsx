import { Quote } from "lucide-react";

interface QuoteBoxProps {
  text: string;
  author?: string;
  accentColor: string;
  backgroundColor: string;
}

export function QuoteBox({
  text,
  author,
  accentColor,
  backgroundColor,
}: QuoteBoxProps) {
  return (
    <div
      className="relative p-8 rounded-xl my-8"
      style={{
        backgroundColor,
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <Quote
        className="absolute top-4 left-4 opacity-20"
        size={48}
        style={{ color: accentColor }}
      />
      <p className="text-xl italic leading-relaxed pl-12" style={{ color: accentColor }}>
        "{text}"
      </p>
      {author && (
        <p className="mt-4 text-sm font-semibold pl-12" style={{ color: accentColor }}>
          — {author}
        </p>
      )}
    </div>
  );
}
