import JSZip from 'jszip';
import { TargetFormat, FallbackColor } from '../types/converter';
import { ImageMagick, MagickFormat, MagickColor, AlphaAction } from '@imagemagick/magick-wasm';
import { initMagickEngine } from './magickEngine';

const mimeToMagickFormat = (mime: TargetFormat): MagickFormat => {
  switch(mime) {
    case 'image/jpeg': return MagickFormat.Jpeg;
    case 'image/png': return MagickFormat.Png;
    case 'image/webp': return MagickFormat.WebP;
    case 'image/avif': return MagickFormat.Avif;
    case 'image/bmp': return MagickFormat.Bmp;
    case 'image/tiff': return MagickFormat.Tiff;
    case 'image/vnd.adobe.photoshop': return MagickFormat.Psd;
    case 'application/postscript': return MagickFormat.Eps;
    case 'image/x-icon': return MagickFormat.Ico;
    case 'image/gif': return MagickFormat.Gif;
    default: return MagickFormat.Png;
  }
};

/**
 * Escanea la imagen usando ImageMagick para determinar si
 * existe canal Alpha.
 */
export const detectTransparency = async (imageUrl: string): Promise<boolean> => {
  try {
    await initMagickEngine();
    
    const response = await fetch(imageUrl);
    const buffer = new Uint8Array(await response.arrayBuffer());
    
    return new Promise((resolve) => {
      try {
        ImageMagick.read(buffer, (img) => {
          resolve(img.hasAlpha);
        });
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
};

/**
 * Convierte un File a un Blob del formato destino usando el potente motor de ImageMagick.
 * Si se solicita un fallbackColor y hay transparencia, hace compositing nativo de alta calidad.
 */
export const convertImage = async (
  file: File, 
  targetFormat: TargetFormat, 
  fallbackColor: FallbackColor
): Promise<Blob> => {
  await initMagickEngine();
  const buffer = new Uint8Array(await file.arrayBuffer());
  
  return new Promise((resolve, reject) => {
    try {
      ImageMagick.read(buffer, (img) => {
        // Si tiene transparencia y se definió un color para rellenarla
        if (img.hasAlpha && fallbackColor !== 'transparent') {
          img.backgroundColor = new MagickColor(fallbackColor);
          img.alpha(AlphaAction.Remove); // Elimina el canal Alpha y hace compositing sobre el fondo
        }

        // Heredar calidad original o tope seguro de 92% para evitar inflar el peso de manera artificial.
        img.quality = img.quality && img.quality > 0 ? img.quality : 92;
        
        const outFormat = mimeToMagickFormat(targetFormat);
        
        img.write(outFormat, (outBuffer) => {
          // El buffer resultante lo convertimos en Blob con su tipo MIME correcto
          resolve(new Blob([new Uint8Array(outBuffer)], { type: targetFormat }));
        });
      });
    } catch (e) {
      reject(e instanceof Error ? e : new Error("Fallo en la conversión con ImageMagick"));
    }
  });
};

/**
 * Recibe una lista de blobs procesados con sus nombres de archivo
 * y los empaqueta en un ZIP listo para descarga.
 */
export const packageZip = async (files: { blob: Blob, filename: string }[]): Promise<Blob> => {
  const zip = new JSZip();
  
  files.forEach(({ blob, filename }) => {
    zip.file(filename, blob);
  });

  return zip.generateAsync({ type: 'blob' });
};
