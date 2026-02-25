import { NextRequest, NextResponse } from "next/server";
import { getProject, saveProject, deleteProject } from "@/lib/storage/redis";

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProject(params.id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error getting project:", error);
    return NextResponse.json(
      { error: "Failed to get project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await getProject(params.id);

    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, content, template, brand } = body;

    const updated = {
      ...existing,
      name: name ?? existing.name,
      content: content ?? existing.content,
      template: template ?? existing.template,
      brand: brand ?? existing.brand,
      updatedAt: new Date().toISOString(),
    };

    await saveProject(updated);

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteProject(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
