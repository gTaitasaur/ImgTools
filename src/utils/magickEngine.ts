import { initializeImageMagick } from '@imagemagick/magick-wasm';
// @ts-ignore: Vite ?url import
import magickWasmUrl from '@imagemagick/magick-wasm/magick.wasm?url';

let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Lanza la inicialización de ImageMagick o devuelve la promesa si ya se está cargando.
 * Garantiza que el WASM solo se pida una vez y permite hacer 'await' desde cualquier herramienta.
 */
export const initMagickEngine = async (): Promise<void> => {
  if (isInitialized) return Promise.resolve();
  
  if (!initPromise) {
    const wasmUrl = new URL(magickWasmUrl, window.location.origin);
    initPromise = initializeImageMagick(wasmUrl)
      .then(() => {
        isInitialized = true;
      })
      .catch((err) => {
        console.error("Error crítico al cargar ImageMagick WASM:", err);
        throw err;
      });
  }
  
  return initPromise;
};
