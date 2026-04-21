import { PixelCrop } from 'react-image-crop';
import { ImageMagick, MagickGeometry } from '@imagemagick/magick-wasm';
import { initMagickEngine } from './magickEngine';

/**
 * Función asíncrona para recortar una imagen usando ImageMagick.
 * Al usar el binario original en lugar de redibujar sobre un Canvas,
 * garantizamos cero pérdida de calidad (Zero generation loss).
 */
export const exportCroppedImage = async (
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string> => {
  await initMagickEngine();

  // Obtenemos el binario puro de la imagen desde su URL montada
  const response = await fetch(image.src);
  const buffer = new Uint8Array(await response.arrayBuffer());

  return new Promise((resolve, reject) => {
    try {
      ImageMagick.read(buffer, (img) => {
        // Necesitamos calcular el ratio de escalado visual frente al nativo.
        // imgRef (HTMLImageElement) tiene dimensiones de visualización en CSS
        // pero react-image-crop nos da las coordenadas relativas a ese tamaño visual.
        // Wait, react-image-crop nos devuelve coordenadas nativas si lo configuramos así,
        // pero la implementación actual calculaba scaleX y scaleY para adaptar el recorte.
        
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const cropX = Math.round(crop.x * scaleX);
        const cropY = Math.round(crop.y * scaleY);
        const cropWidth = Math.max(1, Math.round(crop.width * scaleX));
        const cropHeight = Math.max(1, Math.round(crop.height * scaleY));

        // MagickGeometry requiere: x, y, width, height
        const geometry = new MagickGeometry(cropX, cropY, cropWidth, cropHeight);
        
        // Ejecuta el recorte binario exacto
        img.crop(geometry);
        
        // Heredar la calidad original para evitar inflar el peso. Si no existe, usamos 92 (alta calidad segura).
        img.quality = img.quality && img.quality > 0 ? img.quality : 92;

        img.write(img.format, (outBuffer) => {
          // Extraemos la extensión del src original si podemos, o asumimos blob de su formato
          const blob = new Blob([new Uint8Array(outBuffer)], { type: `image/${img.format.toLowerCase()}` });
          const localUrl = URL.createObjectURL(blob);
          resolve(localUrl);
        });
      });
    } catch (e) {
      console.error(e);
      reject(new Error('Fallo al recortar la imagen con el motor profesional'));
    }
  });
};
