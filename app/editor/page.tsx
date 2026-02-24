"use client";

import { useState, useEffect } from "react";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ElegantTemplate } from "@/components/templates/ElegantTemplate";
import { GradientTemplate } from "@/components/templates/GradientTemplate";
import { TechTemplate } from "@/components/templates/TechTemplate";
import { WarmTemplate } from "@/components/templates/WarmTemplate";
import { TemplateSelector } from "@/components/ui/TemplateSelector";
import { BrandingPanel } from "@/components/ui/BrandingPanel";
import { EditPanel } from "@/components/ui/EditPanel";
import { SocialPanel } from "@/components/social/SocialPanel";
import { TEMPLATES, BrandConfig, DEFAULT_BRAND, applyBrandToConfig } from "@/lib/templates/types";

const DRAFT_KEY = "pagesmith_draft";

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

interface Draft {
  topic: string;
  outline: string;
  selectedTemplate: string;
  brandConfig: BrandConfig;
  generatedContent: GeneratedContent;
  savedAt: number;
}

export default function EditorPage() {
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [exporting, setExporting] = useState(false);
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(DEFAULT_BRAND);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft: Draft = JSON.parse(raw);
        setHasDraft(true);
        setDraftSavedAt(draft.savedAt);
      }
    } catch { }
  }, []);

  // Auto-save draft whenever content is generated
  const saveDraft = (content: GeneratedContent) => {
    try {
      const draft: Draft = {
        topic,
        outline,
        selectedTemplate,
        brandConfig,
        generatedContent: content,
        savedAt: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setHasDraft(true);
      setDraftSavedAt(draft.savedAt);
    } catch { }
  };

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft: Draft = JSON.parse(raw);
      setTopic(draft.topic);
      setOutline(draft.outline);
      setSelectedTemplate(draft.selectedTemplate);
      setBrandConfig(draft.brandConfig);
      setGeneratedContent(draft.generatedContent);
    } catch { }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setDraftSavedAt(null);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedContent(null);
    setShowEdit(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          outline: outline.trim() || undefined,
          sections: 5,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate content");

      const data = await response.json();

      const sectionsWithImages = await Promise.all(
        data.sections.map(async (section: EbookSection) => {
          if (section.imageKeywords.length > 0) {
            try {
              const imageResponse = await fetch(
                `/api/images?query=${encodeURIComponent(section.imageKeywords[0])}&count=1`
              );
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                if (imageData.images?.[0]) {
                  return { ...section, image: imageData.images[0] };
                }
              }
            } catch { }
          }
          return section;
        })
      );

      const result = { ...data, sections: sectionsWithImages };
      setGeneratedContent(result);
      saveDraft(result);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (updated: GeneratedContent) => {
    setGeneratedContent(updated);
    saveDraft(updated);
  };

  const baseTemplateConfig = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
  const effectiveConfig = applyBrandToConfig(baseTemplateConfig, brandConfig);

  const handleExportPDF = async () => {
    if (!generatedContent) return;

    setExporting(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedContent,
          templateId: selectedTemplate,
          brandConfig,
        }),
      });

      if (!response.ok) throw new Error("Failed to export PDF");

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
      case "professional": return <ProfessionalTemplate content={generatedContent} config={effectiveConfig} />;
      case "modern": return <ModernTemplate content={generatedContent} config={effectiveConfig} />;
      case "bold": return <BoldTemplate content={generatedContent} config={effectiveConfig} />;
      case "elegant": return <ElegantTemplate content={generatedContent} config={effectiveConfig} />;
      case "gradient": return <GradientTemplate content={generatedContent} config={effectiveConfig} />;
      case "tech": return <TechTemplate content={generatedContent} config={effectiveConfig} />;
      case "warm": return <WarmTemplate content={generatedContent} config={effectiveConfig} />;
      default: return <MinimalTemplate content={generatedContent} config={effectiveConfig} />;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Your Ebook</h1>
            <p className="text-gray-500 mt-1">Enter your topic and let AI generate your content</p>
          </div>
          {/* Draft banner */}
          {hasDraft && !generatedContent && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm">
              <span className="text-amber-700">
                📂 Draft from {draftSavedAt ? new Date(draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "earlier"}
              </span>
              <button onClick={loadDraft} className="font-semibold text-blue-600 hover:text-blue-800">
                Load
              </button>
              <button onClick={clearDraft} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
          )}
          {generatedContent && draftSavedAt && (
            <p className="text-xs text-gray-400">
              💾 Saved {new Date(draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-900">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to Start a Blog in 2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-900">
                Outline <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="Enter your outline or main points..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white"
                disabled={loading}
              />
            </div>

            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />

            <BrandingPanel
              brand={brandConfig}
              onChange={setBrandConfig}
              topic={topic}
              selectedTemplate={selectedTemplate}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "✦ Generate with AI"}
            </button>

            {generatedContent && (
              <>
                {/* Edit toggle */}
                <button
                  onClick={() => setShowEdit((v) => !v)}
                  className="w-full py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"
                >
                  {showEdit ? "✕ Close Editor" : "✏️ Edit Content"}
                </button>

                {showEdit && (
                  <EditPanel content={generatedContent} onChange={handleContentChange} />
                )}

                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? "Exporting..." : "📄 Export as PDF"}
                </button>

                <SocialPanel
                  title={generatedContent.title}
                  sections={generatedContent.sections}
                  brand={brandConfig}
                />
              </>
            )}
          </div>

          {/* Preview Panel */}
          <div
            className="lg:col-span-2 border border-gray-300 rounded-lg bg-white overflow-auto"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {!generatedContent && !loading && (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg">✦</p>
                <p className="text-gray-500 mt-2">
                  Your ebook preview will appear here
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                <p className="text-gray-600">Generating your ebook...</p>
              </div>
            )}

            {generatedContent && (
              <div className="bg-gray-100">{renderTemplate()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
