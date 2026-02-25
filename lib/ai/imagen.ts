import { GoogleGenAI } from "@google/genai";
import { ChartData, DiagramData } from "@/lib/templates/types";

function getClient() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set");
    return new GoogleGenAI({ apiKey });
}

export type ImagenType = "cover" | "section" | "infographic";

/** Main entry point — generate an image and return a base64 data URL */
export async function generateImage(prompt: string): Promise<string> {
    const ai = getClient();
    const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
            aspectRatio: "16:9",
        },
    });

    const img = response.generatedImages?.[0]?.image;
    if (!img?.imageBytes) throw new Error("No image returned from Imagen 3");

    // imageBytes is base64 string
    return `data:image/jpeg;base64,${img.imageBytes}`;
}

// ── Prompt builders ────────────────────────────────────────────────

export function buildCoverPrompt(topic: string, keyword?: string): string {
    return `Professional ebook cover hero image for a book about "${topic}". 
${keyword ? `Visual theme: ${keyword}.` : ""}
Style: photorealistic, cinematic lighting, premium editorial aesthetic, wide landscape format. 
No text, no typography. Clean composition that works as a background. High detail, vibrant but professional colors.`;
}

export function buildSectionPrompt(title: string, summary?: string): string {
    return `Editorial photograph for an ebook section titled "${title}".
${summary ? `Context: ${summary.slice(0, 200)}` : ""}
Style: professional stock photo quality, clean and modern, natural lighting. 
No text overlays. Wide format. Relevant to the subject matter.`;
}

export function buildInfographicPrompt(
    title: string,
    data: ChartData | DiagramData
): string {
    const isChart = "type" in data && ["bar", "line", "pie", "donut", "progress"].includes((data as ChartData).type);
    const isDiagram = "steps" in data;

    if (isChart) {
        const chart = data as ChartData;
        const dataDesc = chart.data?.slice(0, 5).map(d => `${d.label}: ${d.value}`).join(", ") ?? "";
        return `A beautifully designed infographic about "${title}".
Data to visualize: ${dataDesc}.
Style: modern flat design, vivid gradient colors (purple to teal or brand blue), illustrated icons, bold typography for numbers,
clean layout with clear sections. Include decorative geometric shapes and a header. 
Professional agency-quality infographic. No lorem ipsum — use the real data values provided.`;
    }

    if (isDiagram) {
        const diagram = data as DiagramData;
        const steps = diagram.steps?.slice(0, 5).map((s, i) => `Step ${i + 1}: ${s.title}`).join(" → ") ?? "";
        return `A visually stunning process diagram infographic for "${title}".
Steps: ${steps}.
Style: modern flat design, connected flow with numbered circles, icons for each step, vibrant colors,
arrows connecting steps, clean professional layout. Agency-quality infographic design.`;
    }

    return `A premium infographic illustration about "${title}". Modern flat design, vibrant colors, clean typography.`;
}
