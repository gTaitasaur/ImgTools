import React, { useState } from 'react';
import { OptimizerModule } from '../../../components/Optimizer/OptimizerModule';

export const OptimizerTool: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleImageSelected = (url: string, file: File) => {
    setCurrentUrl(url);
    setCurrentFile(file);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', width: '100%', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Optimización de Peso</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Reduce el peso de tu imagen al extremo manteniendo la mejor calidad visual.</p>
      </div>

      <OptimizerModule 
        originalUrl={currentUrl}
        originalFile={currentFile}
        onImageSelected={handleImageSelected}
      />
    </div>
  );
};
