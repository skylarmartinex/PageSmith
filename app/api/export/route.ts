import { NextRequest, NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf/generator";
import { renderToHTML } from "@/lib/pdf/renderToHTML";
import { TEMPLATES } from "@/lib/templates/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, templateId } = body;

    if (!content || !content.title || !content.sections) {
      return NextResponse.json(
        { error: "Invalid content structure" },
        { status: 400 }
      );
    }

    // Get template config
    const templateConfig =
      TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

    // Render to HTML
    const html = renderToHTML(content, templateConfig, templateId || "minimal");

    // Generate PDF
    const pdfBuffer = await generatePDF({ html });

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${content.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error exporting PDF:", error);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
