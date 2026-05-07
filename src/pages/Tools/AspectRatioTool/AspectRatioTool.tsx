import { CropperModule } from '../../../components/Cropper/CropperModule';
import { Workspace } from '../../../components/UI/Workspace/Workspace';
import { useState } from 'react';

export const AspectRatioTool: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  return (
    <div className="home-container" style={{ paddingBottom: '80px' }}>
      <header className="tool-header">
        <h1 className="tool-title">Recorte y <span>Aspect Ratio.</span></h1>
        <p className="tool-subtitle">
          Ajusta tus fotos a los formatos ideales para Instagram, TikTok o Web. 
          Todo el procesamiento es local y privado en tu navegador.
        </p>
      </header>

      <Workspace>
        <CropperModule 
          imageUrl={currentImage} 
          onImageSelected={(url) => setCurrentImage(url)}
        />
      </Workspace>
    </div>
  );
};
