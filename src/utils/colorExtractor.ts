import { ExtractedSwatch } from '../types/color';

const SWATCH_NAMES: Record<string, string> = {
  Vibrant: 'Vibrante',
  DarkVibrant: 'Vibrante Oscuro',
  LightVibrant: 'Vibrante Claro',
  Muted: 'Tenue',
  DarkMuted: 'Tenue Oscuro',
  LightMuted: 'Tenue Claro',
};

/**
 * Extrae la paleta de colores de una imagen usando node-vibrant y culori.
 * Ambas librerías se cargan dinámicamente (lazy loading) para no impactar
 * el peso inicial de la aplicación.
 */
export const extractColorsFromImage = async (imageUrl: string): Promise<ExtractedSwatch[]> => {
  // Lazy loading
  const { Vibrant } = await import('node-vibrant/browser');
  const culori: any = await import('culori');

  // Extraer paleta
  const palette = await Vibrant.from(imageUrl).getPalette();
  const swatches: ExtractedSwatch[] = [];

  // Los 6 slots estándar de node-vibrant
  const keys = ['Vibrant', 'LightVibrant', 'DarkVibrant', 'Muted', 'LightMuted', 'DarkMuted'];

  for (const key of keys) {
    const swatch = palette[key];
    if (!swatch) continue; // Si node-vibrant no encontró un color para este slot, lo omitimos silenciosamente

    const [r, g, b] = swatch.rgb;
    
    // Crear objeto color de culori (rango 0-1)
    const baseColor = { mode: 'rgb' as const, r: r / 255, g: g / 255, b: b / 255 };

    // Conversiones usando culori
    const hex = culori.formatHex(baseColor) || '#000000';
    const rgbStr = culori.formatRgb(baseColor) || `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    const hslStr = culori.formatHsl(baseColor) || '';
    
    // Oklch string manual basado en culori object
    const oklchObj = culori.converter('oklch')(baseColor);
    let oklchStr = '';
    if (oklchObj) {
      const l = Math.round((oklchObj.l || 0) * 100);
      const c = (oklchObj.c || 0).toFixed(3);
      const h = Math.round(oklchObj.h || 0);
      oklchStr = `oklch(${l}% ${c} ${h})`;
    }

    // Luminancia para decidir el color del texto
    const luminance = 0.299 * baseColor.r + 0.587 * baseColor.g + 0.114 * baseColor.b;
    const textColor = luminance > 0.65 ? '#1f2937' : '#ffffff'; // Texto oscuro si es muy claro

    swatches.push({
      name: SWATCH_NAMES[key] || key,
      hex: hex.toUpperCase(),
      rgb: rgbStr,
      hsl: hslStr,
      oklch: oklchStr,
      textColor
    });
  }

  return swatches;
};
