import React, { useState, useEffect } from 'react';
import { ConverterFile, TargetFormat, FallbackColor, FORMAT_LABELS } from '../../types/converter';
import { MultiDragAndDrop } from '../DragAndDrop/MultiDragAndDrop';
import { detectTransparency, convertImage, packageZip } from '../../utils/formatConverter';
import './ConverterModule.css';

interface ConverterModuleProps {
  files: File[];
  onAddFiles: (files: File[]) => void;
  onClearAll: () => void;
  maxFiles?: number;
}

export const ConverterModule: React.FC<ConverterModuleProps> = ({ files, onAddFiles, onClearAll, maxFiles = 5 }) => {
  const [conversionList, setConversionList] = useState<ConverterFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sincronizar el prop "files" externo con nuestro estado interno complejo
  useEffect(() => {
    const addNewFiles = async () => {
      // Identificar archivos nuevos
      const newFiles = files.filter(f => !conversionList.find(cf => cf.file === f));
      
      if (newFiles.length === 0) return;

      // Creamos entradas preliminares
      const newEntries: ConverterFile[] = newFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        hasTransparency: false, // calcularemos esto asíncronamente
        targetFormat: 'image/jpeg', // Default para que el usuario elija
        fallbackColor: '#FFFFFF', // Default blanco
        status: 'idle'
      }));

      // Las añadimos al estado visual primero para no bloquear la UI
      setConversionList(prev => {
        const merged = [...prev, ...newEntries];
        return merged.slice(0, maxFiles); // Aseguramos tope de 5
      });

      // Calculamos transparencia asíncronamente en background
      for (const entry of newEntries) {
        const hasTransp = await detectTransparency(entry.previewUrl);
        setConversionList(prev => 
          prev.map(item => item.id === entry.id ? { ...item, hasTransparency: hasTransp } : item)
        );
      }
    };

    addNewFiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]); 

  // Limpieza de URLs si un archivo es borrado o se limpia todo
  const handleRemoveItem = (id: string) => {
    setConversionList(prev => {
      const filtered = prev.filter(i => i.id !== id);
      const removed = prev.find(i => i.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const handleUpdateFormat = (id: string, format: TargetFormat) => {
    setConversionList(prev => prev.map(item => item.id === id ? { ...item, targetFormat: format } : item));
  };

  const handleUpdateColor = (id: string, color: FallbackColor) => {
    setConversionList(prev => prev.map(item => item.id === id ? { ...item, fallbackColor: color } : item));
  };

  const handleProcessBatch = async () => {
    setIsProcessing(true);
    
    // Convertir todos
    const processedList = [...conversionList];
    const zipPayload: { blob: Blob, filename: string }[] = [];

    for (let i = 0; i < processedList.length; i++) {
      const item = processedList[i];
      setConversionList(prev => prev.map(p => p.id === item.id ? { ...p, status: 'processing' } : p));
      
      try {
        const resultBlob = await convertImage(item.file, item.targetFormat, item.fallbackColor);
        
        // Construir nuevo nombre
        const ext = FORMAT_LABELS[item.targetFormat].toLowerCase();
        const baseName = item.file.name.replace(/\.[^/.]+$/, "");
        const newName = `${baseName}_converted.${ext}`;

        zipPayload.push({ blob: resultBlob, filename: newName });
        
        processedList[i] = { ...item, status: 'done', resultBlob };
      } catch (err) {
        console.error(err);
        processedList[i] = { ...item, status: 'error' };
      }
      
      // Actualizar estado para feedback visual paso a paso
      setConversionList([...processedList]);
    }

    // Si hubo éxito, empaquetar en ZIP y descargar
    if (zipPayload.length > 0) {
      if (zipPayload.length === 1) {
        // Descarga individual si es uno solo
        const a = document.createElement('a');
        a.href = URL.createObjectURL(zipPayload[0].blob);
        a.download = zipPayload[0].filename;
        a.click();
      } else {
        // Descarga empaquetada si son varios
        const zipBlob = await packageZip(zipPayload);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(zipBlob);
        a.download = `PixelTools_Conversiones_${Date.now()}.zip`;
        a.click();
      }
    }

    setIsProcessing(false);
  };

  // Si no hay archivos, inyectamos el MultiDragAndDrop al 100%
  if (conversionList.length === 0) {
    return (
      <div className="converter-stage" style={{ backgroundColor: 'transparent', padding: 0, border: 'none', boxShadow: 'none' }}>
        <MultiDragAndDrop onFilesSelected={onAddFiles} maxFiles={maxFiles} />
      </div>
    );
  }

  // Si el usuario alcanzó el máximo pero quiere vaciar
  const handleClearInternal = () => {
    conversionList.forEach(c => URL.revokeObjectURL(c.previewUrl));
    setConversionList([]);
    onClearAll(); // avisa al parent
  };

  return (
    <div className="converter-stage">
      <div className="converter-hero">
        <div className="converter-header-actions">
          <button className="btn-clear-all" onClick={handleClearInternal} disabled={isProcessing}>
            Borrar Todo
          </button>
        </div>

        <div className="converter-file-list">
          {conversionList.map(item => {
            // Un formato destino no soporta transparencia si es JPEG
            const targetBreaksTransparency = item.targetFormat === 'image/jpeg';
            const showTransparencyWarning = item.hasTransparency && targetBreaksTransparency;

            return (
              <div key={item.id} className="converter-file-row">
                <div className="converter-row-top">
                  <img src={item.previewUrl} className="file-preview-thumb" alt="thumb" />
                  
                  <div className="file-info">
                    <span className="file-name" title={item.file.name}>{item.file.name}</span>
                    <span className="file-meta">
                      Original: {item.file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="conversion-controls">
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginRight: '4px' }}>→</span>
                    <select 
                      className="format-select"
                      value={item.targetFormat}
                      onChange={(e) => handleUpdateFormat(item.id, e.target.value as TargetFormat)}
                      disabled={isProcessing}
                    >
                      <option value="image/jpeg">JPG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WebP</option>
                      <option value="image/avif">AVIF</option>
                      <option value="image/gif">GIF</option>
                      <option value="image/bmp">BMP</option>
                      <option value="image/tiff">TIFF</option>
                      <option value="image/x-icon">ICO</option>
                      <option value="image/vnd.adobe.photoshop">PSD</option>
                      <option value="application/postscript">EPS</option>
                    </select>

                    {item.status === 'idle' ? (
                      <button className="btn-remove-row" onClick={() => handleRemoveItem(item.id)} disabled={isProcessing}>
                        <svg className="remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ) : (
                      <span className={`row-status-badge status-${item.status}`}>
                        {item.status === 'processing' ? 'Procesando' : item.status === 'done' ? 'Listo' : 'Error'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Zona Condicional de Transparencia */}
                {showTransparencyWarning && (
                  <div className="transparency-options">
                    <strong>⚠️ Transparencia detectada:</strong>
                    <span>Rellenar fondo con:</span>
                    <div className="color-radio-group">
                      <label className="color-radio">
                        <input 
                          type="radio" 
                          name={`color-${item.id}`} 
                          checked={item.fallbackColor === '#FFFFFF'}
                          onChange={() => handleUpdateColor(item.id, '#FFFFFF')}
                          disabled={isProcessing}
                        />
                        Blanco
                      </label>
                      <label className="color-radio">
                        <input 
                          type="radio" 
                          name={`color-${item.id}`} 
                          checked={item.fallbackColor === '#000000'}
                          onChange={() => handleUpdateColor(item.id, '#000000')}
                          disabled={isProcessing}
                        />
                        Negro
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Zona inferior para sumar más fotos si hay espacio */}
        {conversionList.length < maxFiles && !isProcessing && (
          <div style={{ marginTop: '16px' }}>
             <MultiDragAndDrop 
               onFilesSelected={onAddFiles} 
               maxFiles={maxFiles - conversionList.length} 
             />
          </div>
        )}
      </div>

      <div className="converter-actions">
        <button 
          className="btn-primary" 
          onClick={handleProcessBatch}
          disabled={isProcessing || conversionList.length === 0}
        >
          {isProcessing ? 'Procesando Archivos...' : `Convertir ${conversionList.length} Archivo${conversionList.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};
