
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: AspectRatio;
  model: string;
}

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  isPro: boolean;
  imageSize: ImageSize;
}

// Fix: Define AIStudio interface to resolve subsequent property declaration type mismatch.
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // Fix: Add 'readonly' modifier and use the specific 'AIStudio' type to match the existing declaration in the environment.
    readonly aistudio: AIStudio;
  }
}
