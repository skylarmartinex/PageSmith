import { NextRequest, NextResponse } from "next/server";
import {
  searchUnsplashImages,
  getAttributionText as getUnsplashAttribution,
} from "@/lib/images/unsplash";
import {
  searchPexelsImages,
  getAttributionText as getPexelsAttribution,
} from "@/lib/images/pexels";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const count = parseInt(searchParams.get("count") || "3", 10);

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Try Unsplash first
    const unsplashResult = await searchUnsplashImages(query, count);

    if (unsplashResult.images.length > 0) {
      const images = unsplashResult.images.map((img) => ({
        id: img.id,
        url: img.urls.regular,
        thumb: img.urls.thumb,
        alt: img.alt_description || query,
        attribution: getUnsplashAttribution(img),
        link: img.links.html,
        source: "unsplash",
      }));

      return NextResponse.json({ images, source: "unsplash" });
    }

    // Fallback to Pexels
    const pexelsResult = await searchPexelsImages(query, count);

    if (pexelsResult.images.length > 0) {
      const images = pexelsResult.images.map((img) => ({
        id: img.id.toString(),
        url: img.src.large,
        thumb: img.src.medium,
        alt: img.alt || query,
        attribution: getPexelsAttribution(img),
        link: img.photographer_url,
        source: "pexels",
      }));

      return NextResponse.json({ images, source: "pexels" });
    }

    // No images found from either source
    return NextResponse.json({ images: [], source: "none" });
  } catch (error) {
    console.error("Error searching images:", error);
    return NextResponse.json(
      { error: "Failed to search images" },
      { status: 500 }
    );
  }
}
