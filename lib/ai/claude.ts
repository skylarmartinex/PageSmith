import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateContentRequest {
  topic: string;
  outline?: string;
  sections?: number;
}

export interface EbookSection {
  title: string;
  content: string;
  imageKeywords: string[];
}

export interface GenerateContentResponse {
  title: string;
  sections: EbookSection[];
}

export async function generateEbookContent(
  request: GenerateContentRequest
): Promise<GenerateContentResponse> {
  const { topic, outline, sections = 5 } = request;

  const prompt = outline
    ? `Create a professional ebook about "${topic}" using this outline:

${outline}

Generate ${sections} sections with:
1. A compelling section title
2. Well-written, informative content (200-300 words per section)
3. 2-3 relevant image keywords for each section

Format as JSON:
{
  "title": "Main ebook title",
  "sections": [
    {
      "title": "Section 1 Title",
      "content": "Section content here...",
      "imageKeywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`
    : `Create a professional ebook about "${topic}".

Generate ${sections} sections covering the most important aspects of this topic.

For each section, provide:
1. A compelling section title
2. Well-written, informative content (200-300 words per section)
3. 2-3 relevant image keywords that would illustrate the content

Format as JSON:
{
  "title": "Main ebook title",
  "sections": [
    {
      "title": "Section 1 Title",
      "content": "Section content here...",
      "imageKeywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON from response (Claude might wrap it in markdown code blocks)
  const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                    responseText.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error("Failed to parse Claude response");
  }

  const jsonText = jsonMatch[1] || jsonMatch[0];
  const result = JSON.parse(jsonText);

  return result;
}
