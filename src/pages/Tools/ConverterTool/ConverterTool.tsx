import React, { useState } from 'react';
import { ConverterModule } from '../../../components/Converter/ConverterModule';

export const ConverterTool: React.FC = () => {
  const [activeFiles, setActiveFiles] = useState<File[]>([]);

  const handleAddFiles = (newFiles: File[]) => {
    // Suman los nuevos a los ya existentes
    setActiveFiles(prev => [...prev, ...newFiles]);
  };

  const handleClearAll = () => {
    setActiveFiles([]);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', width: '100%', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Cambio de Formato</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Convierte hasta 5 imágenes al formato que necesites en tiempo récord.</p>
      </div>

      <ConverterModule 
        files={activeFiles} 
        onAddFiles={handleAddFiles} 
        onClearAll={handleClearAll}
        maxFiles={5}
      />
    </div>
  );
};
