import React from 'react';
import { BackgroundRemoverModule } from '../../../components/BackgroundRemover/BackgroundRemoverModule';
import { Workspace } from '../../../components/UI/Workspace/Workspace';

export const BackgroundRemoverTool: React.FC = () => {
  return (
    <div className="home-container" style={{ paddingBottom: '80px' }}>
      <header className="tool-header">
        <h1 className="tool-title">Quitar <span>Fondo con IA.</span></h1>
        <p className="tool-subtitle">
          Elimina el fondo de cualquier imagen mágicamente usando Inteligencia Artificial 
          directamente en tu navegador. Privado, rápido y profesional.
        </p>
      </header>

      <Workspace>
        <BackgroundRemoverModule />
      </Workspace>
    </div>
  );
};
