import { notFound } from "next/navigation";
import { loadEbook } from "@/lib/share/redis";
import { ShareView } from "@/components/share/ShareView";
import { TEMPLATES, BrandConfig, DEFAULT_BRAND, applyBrandToConfig } from "@/lib/templates/types";

interface SharePageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: SharePageProps) {
    const data = await loadEbook(params.id) as Record<string, unknown> | null;
    if (!data) return { title: "Ebook Not Found — PageSmith" };
    const content = data.content as Record<string, unknown>;
    return {
        title: `${content?.title || "Ebook"} — PageSmith`,
        description: content?.subtitle as string || "Created with PageSmith",
        openGraph: {
            title: `${content?.title} — PageSmith`,
            description: content?.subtitle as string || "Created with PageSmith",
            images: content?.coverImage ? [(content.coverImage as Record<string, string>).url] : [],
        },
    };
}

export default async function SharePage({ params }: SharePageProps) {
    const data = await loadEbook(params.id) as Record<string, unknown> | null;
    if (!data) notFound();

    const { content, templateId, brandConfig } = data as {
        content: Record<string, unknown>;
        templateId: string;
        brandConfig: BrandConfig;
    };

    const baseTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    const effectiveConfig = applyBrandToConfig(baseTemplate, brandConfig || DEFAULT_BRAND);

    return <ShareView content={content as never} config={effectiveConfig} />;
}
