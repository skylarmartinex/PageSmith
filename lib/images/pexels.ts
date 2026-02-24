export interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface SearchImagesResult {
  images: PexelsImage[];
  total: number;
}

export async function searchPexelsImages(
  query: string,
  perPage: number = 3
): Promise<SearchImagesResult> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    console.warn("Pexels API key not configured");
    return { images: [], total: 0 };
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      images: data.photos || [],
      total: data.total_results || 0,
    };
  } catch (error) {
    console.error("Error fetching Pexels images:", error);
    return { images: [], total: 0 };
  }
}

export function getAttributionText(image: PexelsImage): string {
  return `Photo by ${image.photographer} from Pexels`;
}

export function getAttributionLink(image: PexelsImage): string {
  return image.photographer_url;
}
