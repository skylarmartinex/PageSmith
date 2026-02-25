import { NextRequest, NextResponse } from "next/server";
import { listProjects, saveProject, SavedProject } from "@/lib/storage/redis";
import { nanoid } from "nanoid";

// GET /api/projects - List all projects
export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error listing projects:", error);
    return NextResponse.json(
      { error: "Failed to list projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Save a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, content, template, brand } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const project: SavedProject = {
      id: nanoid(),
      name,
      content,
      template,
      brand,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveProject(project);

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}
