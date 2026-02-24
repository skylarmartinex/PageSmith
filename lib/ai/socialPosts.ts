import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface SocialPost {
    platform: "instagram" | "linkedin" | "twitter";
    headline: string;
    body: string;
    cta: string;
    hashtags: string[];
    imageKeyword: string;
    image?: {
        url: string;
        thumb: string;
        alt: string;
        attribution: string;
    };
}

export interface GenerateSocialPostsResponse {
    posts: SocialPost[];
}

export async function generateSocialPosts(
    title: string,
    sections: { title: string; content: string }[]
): Promise<GenerateSocialPostsResponse> {
    const summary = sections
        .map((s, i) => `${i + 1}. ${s.title}: ${s.content.slice(0, 150)}...`)
        .join("\n");

    const prompt = `You are a social media copywriter. Based on this ebook content, create social media posts optimized for each platform.

Ebook: "${title}"
Key sections:
${summary}

Create 2 posts for each platform (instagram, linkedin, twitter).

Instagram posts: Visual, emoji-rich, 150-200 chars body, strong visual hook headline, 5-8 hashtags
LinkedIn posts: Professional, insight-driven, 200-300 chars body, no emojis in headline, 3-5 hashtags  
Twitter posts: Punchy, 100-140 chars body, conversational, 2-3 hashtags

Format as JSON:
{
  "posts": [
    {
      "platform": "instagram",
      "headline": "Short visual hook",
      "body": "Post body text",
      "cta": "Brief call to action",
      "hashtags": ["tag1", "tag2"],
      "imageKeyword": "single search keyword for stock photo"
    }
  ]
}`;

    const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
    });

    const responseText =
        message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch =
        responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
        responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("Failed to parse Claude response");

    const jsonText = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonText);
}
