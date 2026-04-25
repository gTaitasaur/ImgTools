import React, { useState } from 'react';
import { ConverterModule } from '../../../components/Converter/ConverterModule';

export const ConverterTool: React.FC = () => {
  const [activeFiles, setActiveFiles] = useState<File[]>([]);

  const handleAddFiles = (newFiles: File[]) => {
    setActiveFiles(prev => [...prev, ...newFiles]);
  };

  const handleClearAll = () => {
    setActiveFiles([]);
  };

  return (
    <div className="home-container" style={{ paddingTop: '20px' }}>
      <section className="hero-section" style={{ marginBottom: '40px' }}>
        <h1 className="hero-title">Convertidor de <span>Formatos de Imagen.</span></h1>
        <p className="hero-subtitle">Cambia el formato de tus fotos a WebP, AVIF, JPG o PNG masivamente. Todo se procesa en tu navegador para proteger tus archivos originales.</p>
      </section>

      <ConverterModule 
        files={activeFiles} 
        onAddFiles={handleAddFiles} 
        onClearAll={handleClearAll}
      />
    </div>
  );
};
