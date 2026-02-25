"use client";

import { useState, useCallback } from "react";
import { EbookSection } from "@/lib/templates/types";
import { applySmartLayoutPipeline } from "@/lib/templates/smartLayout";

interface OutlineSection {
    title: string;
    description: string;
    contentType: string;
    estimatedWordCount?: number;
}

interface Outline {
    title: string;
    subtitle: string;
    coverImageKeyword: string;
    format: string;
    sections: OutlineSection[];
}

interface GenerationProgress {
    phase: "idle" | "outline" | "sections" | "images" | "complete" | "error";
    outlineDone: boolean;
    sectionsTotal: number;
    sectionsDone: number;
    currentSectionTitle?: string;
    error?: string;
}

interface GeneratedResult {
    title: string;
    subtitle?: string;
    coverImageKeyword?: string;
    sections: EbookSection[];
}

interface UseMultiStepGeneratorOptions {
    topic: string;
    outline?: string;
    sections?: number;
    brandVoice?: string;
    targetPersona?: string;
    author?: string;
    subtitle?: string;
}

export function useMultiStepGenerator() {
    const [progress, setProgress] = useState<GenerationProgress>({
        phase: "idle",
        outlineDone: false,
        sectionsTotal: 0,
        sectionsDone: 0,
    });

    const [result, setResult] = useState<GeneratedResult | null>(null);

    const reset = useCallback(() => {
        setProgress({ phase: "idle", outlineDone: false, sectionsTotal: 0, sectionsDone: 0 });
        setResult(null);
    }, []);

    const generate = useCallback(async (opts: UseMultiStepGeneratorOptions) => {
        const { topic, outline: userOutline, sections = 6, brandVoice, targetPersona, author, subtitle } = opts;

        try {
            // ── Phase 1: Generate outline ────────────────────────────────────────
            setProgress({ phase: "outline", outlineDone: false, sectionsTotal: 0, sectionsDone: 0 });

            let generatedOutline: Outline;

            if (userOutline && userOutline.trim()) {
                // User provided an outline — parse it into sections
                const lines = userOutline.trim().split("\n").filter(l => l.trim());
                generatedOutline = {
                    title: topic,
                    subtitle: subtitle || "",
                    coverImageKeyword: topic.split(" ")[0].toLowerCase(),
                    format: "ebook",
                    sections: lines.map((line, i) => ({
                        title: line.replace(/^[\d#.\-*]+\s*/, "").trim(),
                        description: `Cover key aspects of ${line.trim()}`,
                        contentType: i === 0 ? "intro" : i === lines.length - 1 ? "conclusion" : "concept",
                    })),
                };
            } else {
                const outlineRes = await fetch("/api/generate/outline", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic, format: "ebook", sections, brandVoice, targetPersona }),
                });
                if (!outlineRes.ok) throw new Error("Failed to generate outline");
                generatedOutline = await outlineRes.json();
            }

            setProgress({
                phase: "sections",
                outlineDone: true,
                sectionsTotal: generatedOutline.sections.length,
                sectionsDone: 0,
            });

            // ── Phase 2: Generate each section ──────────────────────────────────
            const rawSections: EbookSection[] = [];

            for (let i = 0; i < generatedOutline.sections.length; i++) {
                const sec = generatedOutline.sections[i];

                setProgress(prev => ({
                    ...prev,
                    sectionsDone: i,
                    currentSectionTitle: sec.title,
                }));

                const sectionRes = await fetch("/api/generate/section", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sectionTitle: sec.title,
                        sectionDescription: sec.description,
                        contentType: sec.contentType,
                        ebookTitle: generatedOutline.title,
                        brandVoice,
                        targetPersona,
                        index: i,
                        totalSections: generatedOutline.sections.length,
                    }),
                });

                if (!sectionRes.ok) {
                    // Don't fail the whole generation — use a placeholder
                    rawSections.push({
                        title: sec.title,
                        content: sec.description || "Content coming soon.",
                        imageKeywords: [topic],
                        layoutType: "text-only",
                    });
                    continue;
                }

                const sectionData = await sectionRes.json();
                rawSections.push(sectionData);
            }

            setProgress(prev => ({
                ...prev,
                sectionsDone: generatedOutline.sections.length,
                currentSectionTitle: undefined,
                phase: "images",
            }));

            // ── Phase 3: Apply Smart Layout ──────────────────────────────────────
            const smartSections = applySmartLayoutPipeline(rawSections);

            // ── Phase 4: Fetch images ────────────────────────────────────────────
            const sectionsWithImages = await Promise.all(
                smartSections.map(async (section) => {
                    if (!section.imageKeywords?.length) return section;

                    const keywordsToFetch = section.imageKeywords.slice(0, 3);
                    const imageResults = await Promise.all(
                        keywordsToFetch.map(async (kw: string) => {
                            try {
                                const res = await fetch(`/api/images?query=${encodeURIComponent(kw)}&count=1`);
                                if (!res.ok) return null;
                                const data = await res.json();
                                return data.images?.[0] ?? null;
                            } catch { return null; }
                        })
                    );

                    const fetchedImages = imageResults.filter(Boolean);
                    return {
                        ...section,
                        images: fetchedImages,
                        image: fetchedImages[0] ?? undefined,
                    };
                })
            );

            // ── Phase 5: Fetch cover image ────────────────────────────────────────
            let coverImage = undefined;
            try {
                const coverKeyword = generatedOutline.coverImageKeyword || topic;
                const coverRes = await fetch(`/api/images?query=${encodeURIComponent(coverKeyword)}&count=1`);
                if (coverRes.ok) {
                    const coverData = await coverRes.json();
                    coverImage = coverData.images?.[0] ?? undefined;
                }
            } catch { /* non-fatal */ }

            const finalResult: GeneratedResult = {
                title: generatedOutline.title,
                subtitle: subtitle || generatedOutline.subtitle,
                coverImageKeyword: generatedOutline.coverImageKeyword,
                sections: sectionsWithImages as EbookSection[],
            };

            if (author) (finalResult as GeneratedResult & { author?: string }).author = author;
            if (coverImage) (finalResult as GeneratedResult & { coverImage?: unknown }).coverImage = coverImage;

            setResult(finalResult as GeneratedResult);
            setProgress({
                phase: "complete",
                outlineDone: true,
                sectionsTotal: sectionsWithImages.length,
                sectionsDone: sectionsWithImages.length,
            });

            return finalResult;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setProgress(prev => ({ ...prev, phase: "error", error: message }));
            throw err;
        }
    }, []);

    return { progress, result, generate, reset };
}

// ─── Progress UI component ─────────────────────────────────────────────────
export function GenerationProgressBar({ progress }: { progress: GenerationProgress }) {
    if (progress.phase === "idle") return null;

    const pct =
        progress.phase === "outline" ? 8 :
            progress.phase === "sections" && progress.sectionsTotal > 0
                ? 8 + (progress.sectionsDone / progress.sectionsTotal) * 72
                : progress.phase === "images" ? 80 :
                    progress.phase === "complete" ? 100 : 0;

    const labels: Record<GenerationProgress["phase"], string> = {
        idle: "",
        outline: "Building outline...",
        sections: progress.currentSectionTitle
            ? `Writing: "${progress.currentSectionTitle}" (${progress.sectionsDone + 1}/${progress.sectionsTotal})`
            : "Writing sections...",
        images: "Fetching images...",
        complete: "Done!",
        error: progress.error || "Error",
    };

    return (
        <div className= "space-y-2" >
        <div className="flex items-center justify-between text-xs" >
            <span className="font-medium text-gray-700" > { labels[progress.phase]} </span>
                < span className = "text-gray-400" > { Math.round(pct) } % </span>
                    </div>
                    < div className = "w-full h-2 bg-gray-100 rounded-full overflow-hidden" >
                        <div
          className="h-full rounded-full transition-all duration-500"
    style = {{
        width: `${pct}%`,
            background: progress.phase === "error"
                ? "#ef4444"
                : progress.phase === "complete"
                    ? "#16a34a"
                    : "linear-gradient(90deg, #2563eb, #7c3aed)",
          }
}
        />
    </div>
{
    progress.phase === "sections" && progress.sectionsTotal > 0 && (
        <div className="flex gap-1 flex-wrap" >
            {
                Array.from({ length: progress.sectionsTotal }, (_, i) => (
                    <div
              key= { i }
              className = "h-1.5 flex-1 rounded-full transition-all duration-300"
              style = {{
                    backgroundColor:
                        i < progress.sectionsDone
                            ? "#2563eb"
                            : i === progress.sectionsDone
                                ? "#93c5fd"
                                : "#e5e7eb",
                }}
            />
          ))
}
</div>
      )}
</div>
  );
}
