"use client";

import { useState } from "react";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { TemplateSelector } from "@/components/ui/TemplateSelector";
import { TEMPLATES } from "@/lib/templates/types";

interface EbookSection {
  title: string;
  content: string;
  imageKeywords: string[];
  image?: {
    url: string;
    thumb: string;
    alt: string;
    attribution: string;
  };
}

interface GeneratedContent {
  title: string;
  sections: EbookSection[];
}

export default function EditorPage() {
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [exporting, setExporting] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedContent(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          outline: outline.trim() || undefined,
          sections: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      
      // Fetch images for each section
      const sectionsWithImages = await Promise.all(
        data.sections.map(async (section: EbookSection) => {
          if (section.imageKeywords.length > 0) {
            try {
              const imageResponse = await fetch(
                `/api/images?query=${encodeURIComponent(section.imageKeywords[0])}&count=1`
              );
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                if (imageData.images && imageData.images.length > 0) {
                  return {
                    ...section,
                    image: imageData.images[0],
                  };
                }
              }
            } catch (imgErr) {
              console.error("Failed to fetch image:", imgErr);
            }
          }
          return section;
        })
      );

      setGeneratedContent({ ...data, sections: sectionsWithImages });
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const templateConfig = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  const handleExportPDF = async () => {
    if (!generatedContent) return;

    setExporting(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: generatedContent,
          templateId: selectedTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to export PDF");
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedContent.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to export PDF. Please try again.");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const renderTemplate = () => {
    if (!generatedContent) return null;

    switch (selectedTemplate) {
      case "professional":
        return <ProfessionalTemplate content={generatedContent} config={templateConfig} />;
      case "modern":
        return <ModernTemplate content={generatedContent} config={templateConfig} />;
      default:
        return <MinimalTemplate content={generatedContent} config={templateConfig} />;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Create Your Ebook</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your topic or outline below and let AI generate your content
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to Start a Blog in 2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Outline (Optional)
              </label>
              <textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="Enter your outline or main points..."
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                disabled={loading}
              />
            </div>

            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Content with AI"}
            </button>

            {generatedContent && (
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? "Exporting..." : "📄 Export as PDF"}
              </button>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 border rounded-lg bg-white dark:bg-gray-900 overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
            {!generatedContent && !loading && (
              <div className="p-12 text-center">
                <p className="text-gray-500">
                  Your generated ebook will appear here with the selected template...
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Generating your ebook...</p>
              </div>
            )}

            {generatedContent && (
              <div className="bg-gray-100 dark:bg-gray-800">
                {renderTemplate()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
