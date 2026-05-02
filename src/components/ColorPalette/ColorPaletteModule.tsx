import React, { useState, useEffect, useRef } from 'react';
import { DragAndDrop } from '../DragAndDrop/DragAndDrop';
import { validateImageFile } from '../../utils/fileUpload';
import { extractColorsFromImage } from '../../utils/colorExtractor';
import { ColorPalettes, ExtractedColor, ColorFormat } from '../../types/color';
import './ColorPaletteModule.css';

export const ColorPaletteModule: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [palettes, setPalettes] = useState<ColorPalettes | null>(null);
  
  // Controles
  const [colorCount, setColorCount] = useState<number>(5);
  const [format, setFormat] = useState<ColorFormat>('HEX');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para el tooltip de "¡Copiado!"
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const tooltipTimeoutRef = useRef<number | null>(null);

  // ── MANEJO DE ARCHIVO ──

  const handleFileSelected = async (url: string, selectedFile: File) => {
    const validation = validateImageFile(selectedFile);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    setFile(selectedFile);
    // Utilizamos directamente el url generado por DragAndDrop
    setPreviewUrl(url);
  };

  // La limpieza manual ya no es necesaria, el input file maneja el cambio

  // ── EXTRACCIÓN DE COLORES ──

  useEffect(() => {
    if (!file) return;
    let isMounted = true;

    const extract = async () => {
      setIsProcessing(true);
      try {
        const result = await extractColorsFromImage(file);
        if (isMounted) {
          setPalettes(result);
        }
      } catch (error) {
        console.error("Error extrayendo colores:", error);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    extract();

    return () => { isMounted = false; };
  }, [file]); // Solo se re-ejecuta si cambia el archivo. El número de colores se filtra en el render.

  // ── COPIAR AL PORTAPAPELES ──

  const handleCopyColor = (colorCode: string) => {
    navigator.clipboard.writeText(colorCode).then(() => {
      setCopiedColor(colorCode);
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = window.setTimeout(() => {
        setCopiedColor(null);
      }, 2000);
    });
  };

  // ── RENDERIZADO DE PALETAS ──

  const renderColorBlock = (color: ExtractedColor) => {
    let code = '';
    switch (format) {
      case 'HEX': code = color.hex; break;
      case 'RGB': code = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`; break;
      case 'HSL': code = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`; break;
      case 'OKLCH': code = color.oklch; break;
    }

    const isLight = color.hsl.l > 65;
    const textColor = isLight ? '#333' : '#fff';

    return (
      <div 
        key={code + Math.random()} 
        className="cp-color-block" 
        onClick={() => handleCopyColor(code)}
        title="Clic para copiar"
      >
        <div 
          className="cp-color-swatch" 
          style={{ backgroundColor: color.hex }}
        >
          {copiedColor === code && (
            <span className="cp-copied-badge" style={{ color: textColor }}>¡Copiado!</span>
          )}
        </div>
        <span className="cp-color-code">{code}</span>
      </div>
    );
  };

  const renderPaletteRow = (title: string, colors: ExtractedColor[] = []) => {
    // Aplicamos el límite del slider aquí
    const limitedColors = colors.slice(0, colorCount);
    
    return (
      <div className="cp-palette-section fade-in">
        <h3 className="cp-palette-title">
          {title}
          {limitedColors.length < colorCount && limitedColors.length > 0 && (
            <span style={{ fontSize: '0.9rem', color: 'var(--color-error)', marginLeft: '12px', fontWeight: 'normal' }}>
              (Solo se encontraron {limitedColors.length} colores distintos)
            </span>
          )}
        </h3>
        <div className="cp-palette-grid">
          {limitedColors.map(renderColorBlock)}
        </div>
      </div>
    );
  };

  // ── VISTAS ──

  if (!file) {
    return (
      <div className="cp-stage fade-in">
        <DragAndDrop onImageSelected={handleFileSelected} />
      </div>
    );
  }

  return (
    <div className="cp-stage cp-active fade-in">
      {/* Zona Superior: Imagen y Controles Básicos */}
      <div className="cp-top-bar">
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              const url = URL.createObjectURL(file);
              handleFileSelected(url, file);
              e.target.value = ''; // Reset para poder seleccionar la misma imagen
            }
          }} 
        />
        <button className="cp-btn-change" onClick={() => fileInputRef.current?.click()}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Cambiar Foto
        </button>
      </div>

      <div className="cp-preview-container">
        <img src={previewUrl!} alt="Preview" className="cp-image-preview" />
        {isProcessing && (
          <div className="cp-processing-overlay">
            <div className="spinner"></div>
            <span>Extrayendo colores...</span>
          </div>
        )}
      </div>

      {/* Controles de Paleta (Sliders y Formato) */}
      <div className="cp-controls">
        <div className="cp-control-row">
          <label className="cp-label">
            Cantidad de Colores: <span className="cp-value">{colorCount}</span>
          </label>
          <input 
            type="range" 
            className="cp-slider" 
            min="3" 
            max="10" 
            value={colorCount}
            onChange={(e) => setColorCount(Number(e.target.value))}
            disabled={isProcessing}
          />
        </div>

        <div className="cp-format-selector">
          <span className="cp-label">Formato:</span>
          <div className="cp-radio-group">
            {(['HEX', 'RGB', 'HSL', 'OKLCH'] as ColorFormat[]).map(fmt => (
              <label key={fmt} className={`cp-radio-label ${format === fmt ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="colorFormat" 
                  value={fmt} 
                  checked={format === fmt}
                  onChange={() => setFormat(fmt)}
                />
                {fmt}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Paletas */}
      {palettes && !isProcessing && (
        <div className="cp-palettes-container">
          {renderPaletteRow('🎨 Paleta General', palettes.general)}
          {renderPaletteRow('✨ Paleta Dominante', palettes.dominant)}
          {renderPaletteRow('🔥 Paleta Vibrante', palettes.vibrant)}
          {renderPaletteRow('☁️ Paleta Tenue (Muted)', palettes.muted)}
        </div>
      )}
    </div>
  );
};
