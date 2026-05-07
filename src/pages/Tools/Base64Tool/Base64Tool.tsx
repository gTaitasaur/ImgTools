import React from 'react';
import { Base64Module } from '../../../components/Base64/Base64Module';
import { Workspace } from '../../../components/UI/Workspace/Workspace';

export const Base64Tool: React.FC = () => {
  return (
    <div className="home-container" style={{ paddingBottom: '80px' }}>
      <header className="tool-header">
        <h1 className="tool-title">Convertidor <span>Base64.</span></h1>
        <p className="tool-subtitle">
          Codifica tus imágenes a Base64 para incrustarlas en HTML o CSS, 
          o decodifica un código Base64 a imagen descargable. 
          Todo el procesamiento es 100% local y privado.
        </p>
      </header>

      <Workspace>
        <Base64Module />
      </Workspace>
    </div>
  );
};
