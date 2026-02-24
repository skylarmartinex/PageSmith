export interface GoogleFont {
    name: string;
    value: string;
    importUrl: string;
}

export const GOOGLE_FONTS = [
    { name: "Inter", value: "Inter, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" },
    { name: "Roboto", value: "Roboto, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
    { name: "Poppins", value: "Poppins, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" },
    { name: "Montserrat", value: "Montserrat, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap" },
    { name: "Raleway", value: "Raleway, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap" },
    { name: "DM Sans", value: "DM Sans, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" },
    { name: "Nunito", value: "Nunito, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" },
    { name: "Outfit", value: "Outfit, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" },
    { name: "Space Grotesk", value: "Space Grotesk, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" },
    { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" },
    { name: "Playfair Display", value: "Playfair Display, serif", importUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" },
    { name: "Lora", value: "Lora, serif", importUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" },
    { name: "Merriweather", value: "Merriweather, serif", importUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap" },
    { name: "EB Garamond", value: "EB Garamond, serif", importUrl: "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap" },
    { name: "Libre Baskerville", value: "Libre Baskerville, serif", importUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap" },
    { name: "Cormorant Garamond", value: "Cormorant Garamond, serif", importUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap" },
    { name: "Source Serif 4", value: "Source Serif 4, serif", importUrl: "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" },
    { name: "Josefin Sans", value: "Josefin Sans, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap" },
    { name: "Quicksand", value: "Quicksand, sans-serif", importUrl: "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" },
    { name: "Bebas Neue", value: "Bebas Neue, cursive", importUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" },
];

const loadedFonts = new Set<string>();

export function loadGoogleFont(importUrl: string): void {
    if (typeof document === "undefined") return; // SSR guard
    if (loadedFonts.has(importUrl)) return;
    loadedFonts.add(importUrl);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = importUrl;
    document.head.appendChild(link);
}
