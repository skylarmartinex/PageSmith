import { TemplateConfig } from "@/lib/templates/types";

export interface ComparisonRow {
    feature: string;
    values: string[];
}

export interface ComparisonTableData {
    title?: string;
    headers: string[];
    rows: ComparisonRow[];
    /** Index of the column to highlight as "winner" or recommended */
    highlightCol?: number;
}

interface ComparisonTableProps {
    table: ComparisonTableData;
    config: TemplateConfig;
}

const TICK = "✓";
const CROSS = "✗";

function CellValue({ value, highlight }: { value: string; highlight: boolean }) {
    const isCheck = value === TICK || value.toLowerCase() === "yes" || value.toLowerCase() === "true";
    const isCross = value === CROSS || value.toLowerCase() === "no" || value.toLowerCase() === "false";

    return (
        <span
            className={`text-sm font-medium ${isCheck
                    ? "text-green-600"
                    : isCross
                        ? "text-red-400"
                        : highlight
                            ? "font-bold"
                            : ""
                }`}
        >
            {isCheck ? "✓" : isCross ? "✗" : value}
        </span>
    );
}

export function ComparisonTable({ table, config }: ComparisonTableProps) {
    const highlight = table.highlightCol ?? -1;

    return (
        <div className="my-6 rounded-2xl border overflow-hidden" style={{ borderColor: config.colors.accent + "25" }}>
            {table.title && (
                <div className="px-5 pt-4 pb-2">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: config.colors.secondary }}>
                        {table.title}
                    </p>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            {/* Feature column header */}
                            <th
                                className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider border-b"
                                style={{
                                    backgroundColor: config.colors.primary + "08",
                                    borderColor: config.colors.accent + "20",
                                    color: config.colors.secondary,
                                }}
                            >
                                Feature
                            </th>
                            {table.headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider border-b"
                                    style={{
                                        backgroundColor:
                                            i === highlight ? config.colors.primary + "15" : config.colors.primary + "08",
                                        borderColor: config.colors.accent + "20",
                                        color: i === highlight ? config.colors.primary : config.colors.secondary,
                                        borderTop: i === highlight ? `3px solid ${config.colors.primary}` : "none",
                                    }}
                                >
                                    {i === highlight && (
                                        <span
                                            className="block text-[9px] mb-0.5 font-black uppercase"
                                            style={{ color: config.colors.accent }}
                                        >
                                            ★ Recommended
                                        </span>
                                    )}
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((row, ri) => (
                            <tr
                                key={ri}
                                style={{
                                    backgroundColor: ri % 2 === 0 ? "transparent" : config.colors.primary + "04",
                                }}
                            >
                                <td
                                    className="px-5 py-3 font-medium border-b text-sm"
                                    style={{
                                        borderColor: config.colors.accent + "12",
                                        color: config.colors.text,
                                    }}
                                >
                                    {row.feature}
                                </td>
                                {row.values.map((val, vi) => (
                                    <td
                                        key={vi}
                                        className="px-5 py-3 text-center border-b"
                                        style={{
                                            borderColor: config.colors.accent + "12",
                                            backgroundColor: vi === highlight ? config.colors.primary + "06" : "transparent",
                                        }}
                                    >
                                        <CellValue value={val} highlight={vi === highlight} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
