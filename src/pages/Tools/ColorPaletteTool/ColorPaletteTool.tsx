import React from 'react';
import { ColorPaletteModule } from '../../../components/ColorPalette/ColorPaletteModule';

export const ColorPaletteTool: React.FC = () => {
  return (
    <div className="home-container" style={{ paddingTop: '20px' }}>
      <section className="hero-section" style={{ marginBottom: '40px' }}>
        <h1 className="hero-title">Extraer <span>Paleta de Colores.</span></h1>
        <p className="hero-subtitle">Obtén los colores predominantes, vibrantes y tenues de cualquier imagen. Ideal para diseñadores web y creativos. Procesamiento instantáneo y 100% privado en tu navegador.</p>
      </section>

      <ColorPaletteModule />
    </div>
  );
};
