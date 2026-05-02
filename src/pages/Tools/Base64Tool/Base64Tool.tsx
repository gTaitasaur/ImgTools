import React from 'react';
import { Base64Module } from '../../../components/Base64/Base64Module';

export const Base64Tool: React.FC = () => {
  return (
    <div className="home-container" style={{ paddingTop: '20px' }}>
      <section className="hero-section" style={{ marginBottom: '40px' }}>
        <h1 className="hero-title">Convertidor <span>Base64.</span></h1>
        <p className="hero-subtitle">Codifica tus imágenes a Base64 para incrustarlas en HTML o CSS, o decodifica un código Base64 a imagen descargable. Todo el procesamiento es 100% local y privado en tu navegador.</p>
      </section>

      <Base64Module />
    </div>
  );
};
