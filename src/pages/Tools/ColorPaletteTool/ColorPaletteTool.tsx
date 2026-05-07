import React from 'react';
import { ColorPaletteModule } from '../../../components/ColorPalette/ColorPaletteModule';
import { Workspace } from '../../../components/UI/Workspace/Workspace';

export const ColorPaletteTool: React.FC = () => {
  return (
    <div className="home-container" style={{ paddingBottom: '80px' }}>
      <header className="tool-header">
        <h1 className="tool-title">Extraer <span>Paleta de Colores.</span></h1>
        <p className="tool-subtitle">
          Obtén los colores predominantes, vibrantes y tenues de cualquier imagen. 
          Ideal para diseñadores web y creativos. Procesamiento instantáneo y 100% privado.
        </p>
      </header>

      <Workspace>
        <ColorPaletteModule />
      </Workspace>
    </div>
  );
};
