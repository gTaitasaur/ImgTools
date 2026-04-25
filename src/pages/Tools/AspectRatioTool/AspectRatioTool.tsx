import { CropperModule } from '../../../components/Cropper/CropperModule';
import { useState } from 'react';

export const AspectRatioTool: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  return (
    <div className="home-container" style={{ paddingTop: '20px' }}>
      <section className="hero-section" style={{ marginBottom: '40px' }}>
        <h1 className="hero-title">Recortar Fotos para <span>Redes Sociales.</span></h1>
        <p className="hero-subtitle">Adapta tus imágenes al tamaño exacto de Instagram, Facebook o Pinterest. Recorta online, sin perder calidad y con 100% de privacidad garantizada.</p>
      </section>

      <CropperModule 
        imageUrl={currentImage} 
        onImageSelected={(url) => setCurrentImage(url)}
      />
    </div>
  );
};
