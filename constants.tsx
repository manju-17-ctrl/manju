
import React from 'react';

export const ASPECT_RATIOS: { label: string; value: any; icon: React.ReactNode }[] = [
  { label: 'Square (1:1)', value: '1:1', icon: <div className="w-4 h-4 border-2 border-current" /> },
  { label: 'Portrait (3:4)', value: '3:4', icon: <div className="w-3 h-4 border-2 border-current" /> },
  { label: 'Landscape (4:3)', value: '4:3', icon: <div className="w-4 h-3 border-2 border-current" /> },
  { label: 'Story (9:16)', value: '9:16', icon: <div className="w-2.5 h-4 border-2 border-current" /> },
  { label: 'Cinematic (16:9)', value: '16:9', icon: <div className="w-4 h-2.5 border-2 border-current" /> },
];

export const MODELS = {
  FLASH: 'gemini-2.5-flash-image',
  PRO: 'gemini-3-pro-image-preview',
};
