export interface GoogleFont {
    name: string;
    value: string;
    importUrl: string;
}

export const GOOGLE_FONTS: GoogleFont[] = [
    {
        name: "Inter (Modern Sans)",
        value: "Inter, system-ui, sans-serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap",
    },
    {
        name: "Roboto (Clean Sans)",
        value: "Roboto, system-ui, sans-serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
    },
    {
        name: "Poppins (Geometric Sans)",
        value: "Poppins, system-ui, sans-serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap",
    },
    {
        name: "Montserrat (Bold Sans)",
        value: "Montserrat, system-ui, sans-serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap",
    },
    {
        name: "Raleway (Elegant Sans)",
        value: "Raleway, system-ui, sans-serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    },
    {
        name: "Playfair Display (Serif)",
        value: "Playfair Display, Georgia, serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
    },
    {
        name: "Lora (Literary Serif)",
        value: "Lora, Georgia, serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
    },
    {
        name: "Merriweather (Book Serif)",
        value: "Merriweather, Georgia, serif",
        importUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
    },
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
