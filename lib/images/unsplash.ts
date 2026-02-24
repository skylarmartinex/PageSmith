export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
}

export interface SearchImagesResult {
  images: UnsplashImage[];
  total: number;
}

export async function searchUnsplashImages(
  query: string,
  perPage: number = 3
): Promise<SearchImagesResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.warn("Unsplash API key not configured");
    return { images: [], total: 0 };
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      images: data.results || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    return { images: [], total: 0 };
  }
}

export function getAttributionText(image: UnsplashImage): string {
  return `Photo by ${image.user.name} on Unsplash`;
}

export function getAttributionLink(image: UnsplashImage): string {
  return `${image.links.html}?utm_source=pagesmith&utm_medium=referral`;
}
