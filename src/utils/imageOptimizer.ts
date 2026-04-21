import { ImageMagick, MagickFormat, MagickGeometry } from '@imagemagick/magick-wasm';
import { initMagickEngine } from './magickEngine';
import { OptimizationPreset } from '../types/optimizer';

export interface OptimizationResult {
  file: File;
  url: string;
  originalSize: number;
  newSize: number;
  reductionPercentage: number;
}

/**
 * Optimiza una imagen usando ImageMagick WASM.
 */
export async function rawOptimizeImage(
  originalFile: File,
  preset: OptimizationPreset,
  preserveResolution: boolean,
  useWebP: boolean
): Promise<OptimizationResult> {
  await initMagickEngine();
  const buffer = new Uint8Array(await originalFile.arrayBuffer());

  return new Promise((resolve, reject) => {
    try {
      ImageMagick.read(buffer, (img) => {
        // Redimensionado si no es preserveResolution
        if (!preserveResolution) {
          // El signo > asegura que solo reduzca la imagen si excede las dimensiones, 
          // manteniendo la relación de aspecto y nunca ampliando.
          const geom = new MagickGeometry(`${preset.maxWidthOrHeight}x${preset.maxWidthOrHeight}>`);
          img.resize(geom);
        }
        
        // Strip EXIF y perfiles incrustados para bajar el peso al máximo
        img.strip();

        // Seleccionar formato de salida
        const targetFormat = useWebP ? MagickFormat.WebP : img.format;

        // Configurar la compresión
        if (preset.id === 'lossless') {
          if (useWebP) {
            // WebP Lossless
            img.settings.setDefine(MagickFormat.WebP, 'lossless', 'true');
            img.quality = 100;
          } else {
            // Para JPG/PNG, mantener la calidad original para evitar inflar el archivo.
            // Si la calidad original no está disponible, usamos un tope inteligente (92).
            img.quality = img.quality && img.quality > 0 ? img.quality : 92;
          }
        } else {
          img.quality = Math.round(preset.quality * 100);
          if (useWebP) {
             img.settings.setDefine(MagickFormat.WebP, 'lossless', 'false');
          }
        }
        
        img.write(targetFormat, (outBuffer) => {
          const mimeType = useWebP ? 'image/webp' : originalFile.type;
          const newFileName = useWebP 
            ? originalFile.name.replace(/\.[^/.]+$/, "") + ".webp"
            : originalFile.name;
            
          const compressedFile = new File([new Uint8Array(outBuffer)], newFileName, {
            type: mimeType,
          });

          const originalSize = originalFile.size;
          const newSize = compressedFile.size;
          
          let finalFile = compressedFile;
          let finalSize = newSize;

          // Mecanismo de Defensa: Si el peso empeoró, y no pidieron cambio de formato (WebP) 
          // ni redimensionado, es mejor devolver el original intacto para no perjudicar al usuario.
          if (newSize > originalSize && !useWebP && preserveResolution) {
            finalFile = originalFile;
            finalSize = originalSize;
          }

          // Calculamos reducción
          const reductionPercentage = Math.max(0, ((originalSize - finalSize) / originalSize) * 100);

          resolve({
            file: finalFile,
            url: URL.createObjectURL(finalFile),
            originalSize,
            newSize: finalSize,
            reductionPercentage,
          });
        });
      });
    } catch (error) {
      console.error("Error optimizando imagen:", error);
      reject(new Error('Fallo al comprimir la imagen con ImageMagick.'));
    }
  });
}

/**
 * Convierte bytes a formato humano (ej: 2.4 MB)
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Lee la imagen del usuario para recuperar su archivo original si solo tenemos URL
 */
export const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
};
