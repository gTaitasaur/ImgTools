import React, { useState } from 'react';
import { ConverterModule } from '../../../components/Converter/ConverterModule';
import { Workspace } from '../../../components/UI/Workspace/Workspace';

export const ConverterTool: React.FC = () => {
  const [activeFiles, setActiveFiles] = useState<File[]>([]);

  const handleAddFiles = (newFiles: File[]) => {
    setActiveFiles(prev => [...prev, ...newFiles]);
  };

  const handleClearAll = () => {
    setActiveFiles([]);
  };

  return (
    <div className="home-container" style={{ paddingBottom: '80px' }}>
      <header className="tool-header">
        <h1 className="tool-title">Convertidor de <span>Formatos.</span></h1>
        <p className="tool-subtitle">
          Cambia el formato de tus fotos a WebP, AVIF, JPG o PNG masivamente. 
          Todo se procesa en tu navegador para proteger tus archivos originales.
        </p>
      </header>

      <Workspace>
        <ConverterModule 
          files={activeFiles} 
          onAddFiles={handleAddFiles} 
          onClearAll={handleClearAll}
        />
      </Workspace>
    </div>
  );
};
