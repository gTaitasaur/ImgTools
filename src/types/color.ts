/**
 * Tipos para la herramienta de Extracción de Paleta de Colores
 */

export type ColorFormat = 'HEX' | 'RGB' | 'HSL' | 'OKLCH';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/** Representa un color agrupado en la paleta */
export interface ExtractedColor {
  rgb: RGB;
  hsl: HSL;
  hex: string;
  oklch: string;
  /** Cantidad de píxeles representados por este color (peso) */
  count: number;
}

export interface ColorPalettes {
  general: ExtractedColor[];
  dominant: ExtractedColor[];
  vibrant: ExtractedColor[];
  muted: ExtractedColor[];
}
