"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ElegantTemplate } from "@/components/templates/ElegantTemplate";
import { GradientTemplate } from "@/components/templates/GradientTemplate";
import { TechTemplate } from "@/components/templates/TechTemplate";
import { WarmTemplate } from "@/components/templates/WarmTemplate";
import { EditorialTemplate } from "@/components/templates/EditorialTemplate";
import { LuxuryTemplate } from "@/components/templates/LuxuryTemplate";
import { TemplateGalleryButton } from "@/components/ui/TemplateGallery";
import { BrandingPanel } from "@/components/ui/BrandingPanel";
import { EditPanel } from "@/components/ui/EditPanel";
import { SocialPanel } from "@/components/social/SocialPanel";
import { TEMPLATES, BrandConfig, DEFAULT_BRAND, applyBrandToConfig } from "@/lib/templates/types";
import { exportToPPTX } from "@/lib/export/pptx";
import { ShareModal } from "@/components/ui/ShareModal";
import { SaveProjectModal } from "@/components/ui/SaveProjectModal";
import { SectionManager } from "@/components/ui/SectionManager";
import { ImagePicker } from "@/components/ui/ImagePicker";
import { ImageSwapContext } from "@/lib/context/ImageSwapContext";
import { EbookSection, EbookContent } from "@/lib/templates/types";
import { useMultiStepGenerator, GenerationProgressBar } from "@/lib/ai/multiStepGenerator";
import { useAutoSave, AutoSaveIndicator } from "@/lib/hooks/useAutoSave";
import { ComponentLibrary } from "@/components/editor/ComponentLibrary";
import { AIAssistPanel } from "@/components/editor/AIAssistPanel";
import { CanvasEditor } from "@/components/editor/CanvasEditor";
import { ExportHub } from "@/components/ui/ExportHub";
import { FormatSelector } from "@/components/ui/FormatSelector";

const DRAFT_KEY = "pagesmith_draft";

// GeneratedContent extends EbookContent with the raw AI field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratedContent = EbookContent & { coverImageKeyword?: string; sections: any[] };

interface Draft {
  topic: string;
  outline: string;
  selectedTemplate: string;
  brandConfig: BrandConfig;
  generatedContent: GeneratedContent;
  savedAt: number;
}

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");

  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { progress, generate: multiGenerate, reset: resetGenerator } = useMultiStepGenerator();
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [exporting, setExporting] = useState(false);
  const [exportingPPTX, setExportingPPTX] = useState(false);
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(DEFAULT_BRAND);
  const [author, setAuthor] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [imagePicker, setImagePicker] = useState<{ sectionIdx: number; imageIdx: number; keyword: string; sectionTitle?: string; sectionContent?: string } | null>(null);
  const [previewDark, setPreviewDark] = useState(false);
  // Phase 5 state
  const [sidebarTab, setSidebarTab] = useState<"edit" | "ai" | "components">("edit");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  // Phase 6: Format preset
  const [formatPreset, setFormatPreset] = useState<string>("ebook");

  // Auto-save
  const { status: autoSaveStatus, lastSaved: autoSaveLastSaved } = useAutoSave({
    key: "pagesmith_autosave",
    value: generatedContent,
    enabled: !!generatedContent,
    debounceMs: 5000,
  });

  // Project save/load
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>("");
  const [showSaveModal, setShowSaveModal] = useState(false);

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

  // Load project from URL if present
  useEffect(() => {
    if (!projectIdFromUrl) return;

    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectIdFromUrl}`);
        if (!response.ok) throw new Error("Project not found");

        const { project } = await response.json();

        setCurrentProjectId(project.id);
        setCurrentProjectName(project.name);
        setSelectedTemplate(project.template || "minimal");
        setBrandConfig(project.brand || DEFAULT_BRAND);
        setGeneratedContent(project.content);
        setTopic(project.content.title || "");
      } catch (err) {
        setError("Failed to load project");
        console.error(err);
      }
    };

    loadProject();
  }, [projectIdFromUrl]);

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
    resetGenerator();

    try {
      const result = await multiGenerate({
        topic: topic.trim(),
        outline: outline.trim() || undefined,
        sections: 6,
        brandVoice: brandConfig.brandVoice?.trim() || undefined,
        targetPersona: brandConfig.targetPersona?.trim() || undefined,
        author: author.trim() || undefined,
        subtitle: subtitle.trim() || undefined,
      });

      // Merge author/subtitle into result
      const finalContent = {
        ...result,
        author: author.trim() || undefined,
        subtitle: subtitle.trim() || result.subtitle,
      } as GeneratedContent;

      setGeneratedContent(finalContent);
      saveDraft(finalContent);
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

  const handleExportPPTX = async () => {
    if (!generatedContent) return;
    setExportingPPTX(true);
    try {
      await exportToPPTX(
        generatedContent,
        effectiveConfig.colors,
        effectiveConfig.fontFamily,
        brandConfig.logoUrl || undefined
      );
    } catch (err) {
      console.error("PPTX export failed:", err);
    } finally {
      setExportingPPTX(false);
    }
  };

  const handleImageSwap = (sectionIdx: number, imageIdx: number, newImg: { url: string; thumb: string; alt: string; attribution: string }) => {
    if (!generatedContent) return;
    const sections = generatedContent.sections.map((section, si) => {
      if (si !== sectionIdx) return section;
      const images = [...(section.images || (section.image ? [section.image] : []))];
      images[imageIdx] = newImg;
      return { ...section, images, image: imageIdx === 0 ? newImg : section.image };
    });
    const updated = { ...generatedContent, sections };
    handleContentChange(updated);
  };

  const handleSaveProject = async (name: string) => {
    if (!generatedContent) return;

    try {
      if (currentProjectId) {
        // Update existing project
        const response = await fetch(`/api/projects/${currentProjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            content: generatedContent,
            template: selectedTemplate,
            brand: brandConfig,
          }),
        });

        if (!response.ok) throw new Error("Failed to update project");

        setCurrentProjectName(name);
        alert("Project updated successfully!");
      } else {
        // Create new project
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            content: generatedContent,
            template: selectedTemplate,
            brand: brandConfig,
          }),
        });

        if (!response.ok) throw new Error("Failed to save project");

        const { project } = await response.json();
        setCurrentProjectId(project.id);
        setCurrentProjectName(name);
        alert("Project saved successfully!");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleShare = async () => {
    if (!generatedContent) return;
    setSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedContent,
          templateId: selectedTemplate,
          brandConfig,
        }),
      });
      if (!res.ok) throw new Error("Share failed");
      const { url } = await res.json();
      setShareUrl(url);
    } catch (err) {
      console.error("Share error:", err);
      alert("Failed to generate share link. Make sure UPSTASH env vars are configured.");
    } finally {
      setSharing(false);
    }
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
      case "editorial": return <EditorialTemplate content={generatedContent} config={effectiveConfig} />;
      case "luxury": return <LuxuryTemplate content={generatedContent} config={effectiveConfig} />;
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-900">Topic</label>
                <FormatSelector
                  value={formatPreset}
                  onChange={(id, preset) => {
                    setFormatPreset(id);
                  }}
                />
              </div>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Subtitle <span className="text-gray-400">(optional)</span></label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Tagline or subtitle"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Author <span className="text-gray-400">(optional)</span></label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            <TemplateGalleryButton
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
                {/* ── Phase 5 tabbed sidebar ─────────────────────── */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-100">
                    {([
                      { id: "edit", label: "✏️ Edit", title: "Edit content & sections" },
                      { id: "ai", label: "✦ AI", title: "AI Assist" },
                      { id: "components", label: "⊞ Library", title: "Component Library" },
                    ] as const).map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSidebarTab(tab.id)}
                        title={tab.title}
                        className="flex-1 py-2.5 text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: sidebarTab === tab.id ? effectiveConfig.colors.accent + "15" : "white",
                          color: sidebarTab === tab.id ? effectiveConfig.colors.accent : "#6b7280",
                          borderBottom: sidebarTab === tab.id ? `2px solid ${effectiveConfig.colors.accent}` : "2px solid transparent",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Edit tab */}
                  {sidebarTab === "edit" && (
                    <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
                      <EditPanel content={generatedContent} onChange={handleContentChange} />
                      <SectionManager
                        sections={generatedContent.sections as never[]}
                        onChange={(newSections) =>
                          handleContentChange({ ...generatedContent, sections: newSections as never })
                        }
                        config={effectiveConfig}
                      />
                    </div>
                  )}

                  {/* AI Assist tab */}
                  {sidebarTab === "ai" && generatedContent.sections.length > 0 && (
                    <div className="p-3 space-y-3">
                      {/* Section picker */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Target Section</label>
                        <select
                          value={activeSectionIndex}
                          onChange={e => setActiveSectionIndex(Number(e.target.value))}
                          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2"
                        >
                          {generatedContent.sections.map((s: EbookSection, i: number) => (
                            <option key={i} value={i}>{i + 1}. {s.title}</option>
                          ))}
                        </select>
                      </div>
                      <AIAssistPanel
                        section={generatedContent.sections[activeSectionIndex] as EbookSection}
                        sectionIndex={activeSectionIndex}
                        allSections={generatedContent.sections as EbookSection[]}
                        config={effectiveConfig}
                        ebookTitle={generatedContent.title}
                        onUpdateSection={(idx, updated) => {
                          const newSections = generatedContent.sections.map((s: EbookSection, i: number) => i === idx ? updated : s);
                          handleContentChange({ ...generatedContent, sections: newSections });
                        }}
                        onUpdateAllSections={(sections) => {
                          handleContentChange({ ...generatedContent, sections });
                        }}
                      />
                    </div>
                  )}

                  {/* Component Library tab */}
                  {sidebarTab === "components" && (
                    <div className="p-3">
                      <ComponentLibrary
                        config={effectiveConfig}
                        onInsertSection={(newSection) => {
                          const updated = [...generatedContent.sections, { ...newSection, title: newSection.title || "New Section" }];
                          handleContentChange({ ...generatedContent, sections: updated });
                          setSidebarTab("edit");
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Export Hub — replaces individual export buttons */}
                <ExportHub
                  content={generatedContent}
                  config={effectiveConfig}
                  selectedTemplate={selectedTemplate}
                  brandConfig={brandConfig}
                  onExportPPTX={handleExportPPTX}
                  exportingPPTX={exportingPPTX}
                />

                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="w-full px-6 py-3 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: sharing ? "#9ca3af" : "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                >
                  {sharing ? "Creating link..." : "🔗 Share Ebook"}
                </button>

                <button
                  onClick={() => setShowSaveModal(true)}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  💾 {currentProjectId ? "Update" : "Save"} Project
                </button>

                <SocialPanel
                  title={generatedContent.title}
                  sections={generatedContent.sections}
                  brand={brandConfig}
                />
              </>
            )}
          </div>

          {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}

          {showSaveModal && (
            <SaveProjectModal
              currentName={currentProjectName || generatedContent?.title}
              onSave={handleSaveProject}
              onClose={() => setShowSaveModal(false)}
            />
          )}

          {imagePicker && (
            <ImagePicker
              initialQuery={imagePicker.keyword}
              sectionTitle={imagePicker.sectionTitle}
              sectionSummary={imagePicker.sectionContent?.slice(0, 200)}
              onSelect={(img) => {
                handleImageSwap(imagePicker.sectionIdx, imagePicker.imageIdx, img);
                setImagePicker(null);
              }}
              onClose={() => setImagePicker(null)}
            />
          )}
          {/* Preview Panel — wrapped in CanvasEditor */}
          <div
            className="lg:col-span-2 border border-gray-300 rounded-lg bg-white overflow-auto"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {generatedContent ? (
              <CanvasEditor config={effectiveConfig}>
                {/* Original preview toolbar inside canvas */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 bg-white/80 backdrop-blur border-b border-gray-100">
                  <AutoSaveIndicator status={autoSaveStatus} lastSaved={autoSaveLastSaved} />
                  <button
                    onClick={() => setPreviewDark((d) => !d)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                    style={{ borderColor: previewDark ? "#6d28d9" : "#e5e7eb", color: previewDark ? "#7c3aed" : "#6b7280", backgroundColor: previewDark ? "#7c3aed15" : "transparent" }}
                  >
                    {previewDark ? "☀️ Light mode" : "🌙 Dark preview"}
                  </button>
                </div>
                {!generatedContent && !loading && (
                  <div className="p-12 text-center">
                    <p className="text-gray-400 text-lg">✦</p>
                    <p className="text-gray-500 mt-2">
                      Your ebook preview will appear here
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 px-8">
                    <div className="w-full max-w-sm space-y-5">
                      <div className="text-center">
                        <div className="text-3xl mb-2">✦</div>
                        <p className="font-semibold text-gray-700">Generating your ebook</p>
                        <p className="text-sm text-gray-400 mt-1">Using multi-step AI generation</p>
                      </div>
                      <GenerationProgressBar progress={progress} />
                    </div>
                  </div>
                )}

                <ImageSwapContext.Provider value={{
                  onImageClick: (si, ii, kw) => {
                    const section = generatedContent?.sections[si];
                    setImagePicker({ sectionIdx: si, imageIdx: ii, keyword: kw, sectionTitle: section?.title, sectionContent: section?.content });
                  },
                }}>
                  <div className="bg-gray-100" style={previewDark ? { filter: "invert(1) hue-rotate(180deg)" } : {}}>{renderTemplate()}</div>
                </ImageSwapContext.Provider>
              </CanvasEditor>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg">✦</p>
                <p className="text-gray-500 mt-2">Your ebook preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
