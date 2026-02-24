"use client";

import { useState } from "react";

interface EbookSection {
  title: string;
  content: string;
  imageKeywords: string[];
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
      setGeneratedContent(data);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Create Your Ebook</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your topic or outline below and let AI generate your content
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to Start a Blog in 2026"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Outline (Optional)
              </label>
              <textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="Enter your outline or main points..."
                rows={12}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>

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
          </div>

          {/* Preview Panel */}
          <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900 overflow-auto max-h-[600px]">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            
            {!generatedContent && !loading && (
              <p className="text-gray-500">
                Your generated content will appear here...
              </p>
            )}

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {generatedContent && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">{generatedContent.title}</h3>
                
                {generatedContent.sections.map((section, index) => (
                  <div key={index} className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {section.content}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {section.imageKeywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
                        >
                          🖼️ {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
