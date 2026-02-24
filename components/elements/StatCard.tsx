import { TrendingUp, Target, Users, DollarSign } from "lucide-react";

type StatIcon = "trending" | "target" | "users" | "dollar";

interface StatCardProps {
  value: string;
  label: string;
  icon?: StatIcon;
  accentColor: string;
  backgroundColor: string;
}

const STAT_ICONS = {
  trending: TrendingUp,
  target: Target,
  users: Users,
  dollar: DollarSign,
};

export function StatCard({
  value,
  label,
  icon = "target",
  accentColor,
  backgroundColor,
}: StatCardProps) {
  const Icon = STAT_ICONS[icon];

  return (
    <div
      className="p-6 rounded-xl text-center"
      style={{
        backgroundColor,
        border: `2px solid ${accentColor}20`,
      }}
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <Icon size={24} style={{ color: accentColor }} />
      </div>
      <div className="text-4xl font-bold mb-2" style={{ color: accentColor }}>
        {value}
      </div>
      <div className="text-sm font-medium" style={{ color: accentColor + "cc" }}>
        {label}
      </div>
    </div>
  );
}
