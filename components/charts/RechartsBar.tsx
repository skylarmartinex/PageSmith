"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartData, TemplateConfig } from "@/lib/templates/types";

interface Props {
  chart: ChartData;
  config: TemplateConfig;
}

export function RechartsBar({ chart, config }: Props) {
  const data = chart.data.map((d) => ({ name: d.label, value: d.value }));

  return (
    <div className="my-4">
      {chart.title && (
        <p
          className="text-sm font-semibold mb-3 text-center"
          style={{ color: config.colors.secondary }}
        >
          {chart.title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <RechartsBarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={config.colors.text + "15"} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: config.colors.secondary }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: config.colors.secondary }}
            axisLine={false}
            tickLine={false}
            unit={chart.unit ? ` ${chart.unit}` : ""}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: config.colors.background,
              border: `1px solid ${config.colors.accent}40`,
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(val) => [`${val}${chart.unit ? chart.unit : ""}`, chart.title || "Value"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i % 2 === 0 ? config.colors.primary : config.colors.accent}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
