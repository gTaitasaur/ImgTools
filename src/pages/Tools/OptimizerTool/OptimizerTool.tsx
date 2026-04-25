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
    <div className="home-container" style={{ paddingTop: '20px' }}>
      <section className="hero-section" style={{ marginBottom: '40px' }}>
        <h1 className="hero-title">Comprimir Imágenes <span>sin Perder Calidad.</span></h1>
        <p className="hero-subtitle">Reduce drásticamente el peso de tus fotos JPG, PNG o WebP. Mejora la velocidad de tu web y tu SEO con nuestra compresión local segura.</p>
      </section>

      <OptimizerModule 
        originalUrl={currentUrl}
        originalFile={currentFile}
        onImageSelected={handleImageSelected}
      />
    </div>
  );
};
