"use client";

import React, { createContext, useContext } from "react";

interface ImageSwapContextValue {
    onImageClick: ((sectionIndex: number, imageIndex: number, keyword: string) => void) | null;
}

export const ImageSwapContext = createContext<ImageSwapContextValue>({ onImageClick: null });

export function useImageSwap() {
    return useContext(ImageSwapContext);
}
