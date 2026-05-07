import React, { useState } from 'react';
import { OptimizerModule } from '../../../components/Optimizer/OptimizerModule';
import { Workspace } from '../../../components/UI/Workspace/Workspace';

export const OptimizerTool: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleImageSelected = (url: string, file: File) => {
    setCurrentUrl(url);
    setCurrentFile(file);
  };

  return (
    <div className="home-container" style={{ paddingBottom: '80px' }}>
      <header className="tool-header">
        <h1 className="tool-title">Comprimir Imágenes <span>sin Perder Calidad.</span></h1>
        <p className="tool-subtitle">
          Reduce drásticamente el peso de tus fotos JPG, PNG o WebP. 
          Mejora la velocidad de tu web y tu SEO con nuestra compresión local segura.
        </p>
      </header>

      <Workspace>
        <OptimizerModule 
          originalUrl={currentUrl}
          originalFile={currentFile}
          onImageSelected={handleImageSelected}
        />
      </Workspace>
    </div>
  );
};
