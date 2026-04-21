import { CropperModule } from '../../../components/Cropper/CropperModule';
import { useState } from 'react';

export const AspectRatioTool: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', width: '100%', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Encuadre perfecto</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Selecciona la imagen que deseas adaptar a proporciones ideales.</p>
      </div>

      <CropperModule 
        imageUrl={currentImage} 
        onImageSelected={(url) => setCurrentImage(url)}
      />
    </div>
  );
};
