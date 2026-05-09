export type ColorFormat = 'HEX' | 'RGB' | 'HSL' | 'OKLCH';

/** Representa un swatch extraído de la imagen con todos sus formatos */
export interface ExtractedSwatch {
  name: string; // 'Vibrant', 'DarkVibrant', etc.
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
  textColor: string; // '#fff' o '#333' dependiendo de la luminancia para buena lectura
}
