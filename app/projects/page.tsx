"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, FileText, Calendar } from "lucide-react";

interface Project {
  id: string;
  name: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to load projects");
      
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete project");
      console.error(err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-2">
              All your saved ebooks and lead magnets
            </p>
          </div>
          <Link
            href="/editor"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + New Project
          </Link>
        </header>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No projects yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first ebook to get started
            </p>
            <Link
              href="/editor"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Project
            </Link>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {project.template} template
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                    title="Delete project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={14} className="mr-1" />
                  Updated {formatDate(project.updatedAt)}
                </div>

                <Link
                  href={`/editor?project=${project.id}`}
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Open Project
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
