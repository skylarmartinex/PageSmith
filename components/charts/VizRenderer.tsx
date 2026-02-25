import { ChartData, DiagramData, ComparisonTableData, IconGridData, TemplateConfig } from "@/lib/templates/types";
import { BarChart } from "./BarChart";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { ProgressChart } from "./ProgressChart";
import { ProcessFlow } from "@/components/diagrams/ProcessFlow";
import { Timeline } from "@/components/diagrams/Timeline";
import { ComparisonTable } from "./ComparisonTable";
import { IconGrid } from "./IconGrid";

interface VizRendererProps {
    chart?: ChartData;
    diagram?: DiagramData;
    comparisonTable?: ComparisonTableData;
    iconGrid?: IconGridData;
    config: TemplateConfig;
}

export function VizRenderer({ chart, diagram, comparisonTable, iconGrid, config }: VizRendererProps) {
    if (comparisonTable) {
        return <ComparisonTable table={comparisonTable} config={config} />;
    }
    if (iconGrid) {
        return <IconGrid grid={iconGrid} config={config} />;
    }
    if (chart) {
        switch (chart.type) {
            case "bar":
                return <BarChart chart={chart} config={config} />;
            case "line":
                return <LineChart chart={chart} config={config} />;
            case "pie":
                return <PieChart chart={chart} config={config} />;
            case "donut":
                return <PieChart chart={chart} config={config} donut />;
            case "progress":
                return <ProgressChart chart={chart} config={config} />;
            default:
                return null;
        }
    }

    if (diagram) {
        switch (diagram.type) {
            case "process":
                return <ProcessFlow diagram={diagram} config={config} />;
            case "timeline":
                return <Timeline diagram={diagram} config={config} />;
            default:
                return null;
        }
    }

    return null;
}
