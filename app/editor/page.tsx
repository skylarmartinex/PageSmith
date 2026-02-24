"use client";

import { useState } from "react";

export default function EditorPage() {
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  
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
              />
            </div>

            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Generate Content with AI
            </button>
          </div>

          {/* Preview Panel */}
          <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <p className="text-gray-500">
              Your generated content will appear here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
