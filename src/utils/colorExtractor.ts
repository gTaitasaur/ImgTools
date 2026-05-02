import { RGB, HSL, ExtractedColor, ColorPalettes } from '../types/color';

// ── UTILIDADES DE CONVERSIÓN DE ESPACIO DE COLOR ──

export const rgbToHex = ({ r, g, b }: RGB): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
};

export const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// Aproximación simple de sRGB a OKLCH para UI
export const rgbToOklchString = ({ r, g, b }: RGB): string => {
  // Convertimos a sRGB lineal
  let rL = r / 255; let gL = g / 255; let bL = b / 255;
  rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
  gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
  bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

  // sRGB a LMS
  const l_ = 0.4122214708 * rL + 0.5363325363 * gL + 0.0514459929 * bL;
  const m_ = 0.2119034982 * rL + 0.6806995451 * gL + 0.1073969566 * bL;
  const s_ = 0.0883024619 * rL + 0.2817188376 * gL + 0.6299787005 * bL;

  // LMS no lineal
  const l_nl = Math.cbrt(l_);
  const m_nl = Math.cbrt(m_);
  const s_nl = Math.cbrt(s_);

  // Oklab
  const l = 0.2104542553 * l_nl + 0.7936177850 * m_nl - 0.0040720468 * s_nl;
  const a = 1.9779984951 * l_nl - 2.4285922050 * m_nl + 0.4505937099 * s_nl;
  const b_lab = 0.0259040371 * l_nl + 0.7827717662 * m_nl - 0.8086757660 * s_nl;

  // Oklch
  const c = Math.sqrt(a * a + b_lab * b_lab);
  let h = Math.atan2(b_lab, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
};

// ── MOTOR DE EXTRACCIÓN Y FILTRADO ──

const colorDistance = (c1: ExtractedColor, c2: ExtractedColor): number => {
  const dr = c1.rgb.r - c2.rgb.r;
  const dg = c1.rgb.g - c2.rgb.g;
  const db = c1.rgb.b - c2.rgb.b;
  return Math.sqrt(dr*dr + dg*dg + db*db);
};

const getDistinctColors = (colors: ExtractedColor[], minDistance: number = 35): ExtractedColor[] => {
  const distinct: ExtractedColor[] = [];
  for (const c of colors) {
    let isDistinct = true;
    for (const d of distinct) {
      if (colorDistance(c, d) < minDistance) {
        isDistinct = false;
        break;
      }
    }
    if (isDistinct) {
      distinct.push(c);
    }
  }
  return distinct;
};

/**
 * Reduce la profundidad de color para agrupar colores similares.
 * step=24 significa que divide el espacio RGB de 256 en bloques de 24.
 */
const BIN_STEP = 24; 

interface ColorBin {
  rSum: number;
  gSum: number;
  bSum: number;
  count: number;
}

/**
 * Procesa la imagen mediante un canvas escalado para extraer paletas de forma asíncrona.
 */
export const extractColorsFromImage = async (file: File): Promise<ColorPalettes> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Escalamos la imagen a máx 200px para que el procesamiento sea casi instantáneo
      const MAX_DIMENSION = 200;
      let width = img.width;
      let height = img.height;
      if (width > height && width > MAX_DIMENSION) {
        height = Math.round(height * (MAX_DIMENSION / width));
        width = MAX_DIMENSION;
      } else if (height > MAX_DIMENSION) {
        width = Math.round(width * (MAX_DIMENSION / height));
        height = MAX_DIMENSION;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return reject(new Error('No se pudo inicializar Canvas 2D'));

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const bins = new Map<string, ColorBin>();

      // Binning: agrupamos colores similares
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue; // Ignorar píxeles transparentes

        // Redondear a la "caja" más cercana (bin)
        const rBin = Math.round(r / BIN_STEP) * BIN_STEP;
        const gBin = Math.round(g / BIN_STEP) * BIN_STEP;
        const bBin = Math.round(b / BIN_STEP) * BIN_STEP;
        
        const key = `${rBin},${gBin},${bBin}`;
        
        const bin = bins.get(key) || { rSum: 0, gSum: 0, bSum: 0, count: 0 };
        bin.rSum += r;
        bin.gSum += g;
        bin.bSum += b;
        bin.count++;
        bins.set(key, bin);
      }

      // Calcular color promedio exacto de cada bin y convertir a objetos ExtractedColor
      let allColors: ExtractedColor[] = [];
      bins.forEach((bin) => {
        // Ignorar colores con muy pocos píxeles (ruido)
        if (bin.count < 5) return;

        const rgb: RGB = {
          r: Math.round(bin.rSum / bin.count),
          g: Math.round(bin.gSum / bin.count),
          b: Math.round(bin.bSum / bin.count)
        };
        
        allColors.push({
          rgb,
          hsl: rgbToHsl(rgb),
          hex: rgbToHex(rgb),
          oklch: rgbToOklchString(rgb),
          count: bin.count
        });
      });

      // ── FILTRADOS PARA CADA TIPO DE PALETA ──
      
      // Orden base por recuento
      const sortedByCount = [...allColors].sort((a, b) => b.count - a.count);

      // ── PALETA GENERAL: Algoritmo Maximin Diversity ──
      // En vez de simplemente tomar los más frecuentes, este algoritmo
      // selecciona colores que maximizan la diversidad visual.
      // 
      // Funciona así:
      // 1. Empieza con el color más frecuente.
      // 2. Para cada slot siguiente, elige el color cuya MÍNIMA distancia
      //    a todos los ya seleccionados sea la MAYOR (el que es más "diferente"
      //    a todo lo que ya tenemos), ponderado por un factor logarítmico de
      //    frecuencia para no seleccionar ruido/artefactos.
      //
      // Esto garantiza que con 3 colores obtienes los 3 más representativos
      // (ej: oscuro, claro, rojo), y con 10 obtienes 10 que cubren todo el
      // espectro. El orden es estable: los primeros N siempre son los mismos
      // sin importar si pides N o 10.
      const maxCount = sortedByCount.length > 0 ? sortedByCount[0].count : 1;
      const generalOrdered: ExtractedColor[] = [];
      if (sortedByCount.length > 0) {
        // Semilla: el color más frecuente
        generalOrdered.push(sortedByCount[0]);
        const remaining = sortedByCount.slice(1);

        while (generalOrdered.length < 10 && remaining.length > 0) {
          let bestIdx = 0;
          let bestScore = -1;

          for (let i = 0; i < remaining.length; i++) {
            // Distancia mínima a cualquier color ya seleccionado
            let minDist = Infinity;
            for (const selected of generalOrdered) {
              const dist = colorDistance(remaining[i], selected);
              if (dist < minDist) minDist = dist;
            }
            // Factor de frecuencia logarítmico (evita ruido sin aplastar diversidad)
            const freqFactor = Math.log2(1 + remaining[i].count) / Math.log2(1 + maxCount);
            // Score final: distancia × (0.3 frecuencia + 0.7 diversidad pura)
            const score = minDist * (0.3 * freqFactor + 0.7);

            if (score > bestScore) {
              bestScore = score;
              bestIdx = i;
            }
          }

          generalOrdered.push(remaining[bestIdx]);
          remaining.splice(bestIdx, 1);
        }
      }
      const general = generalOrdered;

      // Dominante: Los colores más frecuentes (con un filtro ligero para evitar casi clones)
      const dominant = getDistinctColors(sortedByCount, 20);

      // Vibrante: Saturación > 45%, Luminosidad media (ni muy oscuro ni muy blanco)
      // Ordenamos por un "score" que mezcla saturación y frecuencia
      const vibrantRaw = [...allColors]
        .filter(c => c.hsl.s > 45 && c.hsl.l > 15 && c.hsl.l < 85)
        .sort((a, b) => {
          const scoreA = (a.hsl.s * 0.7) + ((a.count / data.length) * 100 * 0.3);
          const scoreB = (b.hsl.s * 0.7) + ((b.count / data.length) * 100 * 0.3);
          return scoreB - scoreA;
        });
      const vibrant = getDistinctColors(vibrantRaw, 30);

      // Tenue (Muted): Baja saturación (< 35%)
      const mutedRaw = [...allColors]
        .filter(c => c.hsl.s <= 35 && c.hsl.l > 10 && c.hsl.l < 90)
        .sort((a, b) => b.count - a.count);
      const muted = getDistinctColors(mutedRaw, 25);

      // Si por alguna razón la imagen no tiene colores vibrantes o tenues, 
      // hacemos un fallback a los generales más cercanos a esas características.
      if (vibrant.length < 3) {
        vibrant.push(...general.filter(c => !vibrant.includes(c)).slice(0, 10));
      }
      if (muted.length < 3) {
        muted.push(...general.filter(c => !muted.includes(c)).slice(0, 10));
      }

      resolve({ general, dominant, vibrant, muted });
    };

    img.onerror = () => reject(new Error('Error al leer la imagen'));
    img.src = url;
  });
};
