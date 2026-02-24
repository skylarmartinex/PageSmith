import { TemplateConfig, TEMPLATES } from "@/lib/templates/types";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">Template</label>
      <div className="grid grid-cols-1 gap-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600">
                  {template.description}
                </p>
              </div>
              <div className="flex gap-1">
                {Object.values(template.colors)
                  .slice(0, 3)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
