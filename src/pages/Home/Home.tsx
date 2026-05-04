import React from 'react';
import { Card } from '../../components/UI/Card';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="hub-wrapper">
        <section className="hero-section">
          <h1 className="hero-title">PixelTools: Tu Suite de Edición Local, Rápida y Privada</h1>
          <p className="hero-subtitle">
            Edita, comprime y convierte tus fotos sin subir nada a internet. Todo el procesamiento se realiza localmente en tu navegador para garantizar tu privacidad y ahorrarte horas de trabajo. Una suite creada con dedicación para hacerte la vida más fácil.
          </p>
        </section>

        <div className="tools-grid">
          <Card 
            to="/herramientas/recorte-aspect-ratio"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
            title="Recortar Fotos para Redes"
            description="Adapta tus imágenes al tamaño perfecto para Instagram, Facebook o Pinterest. Recorta fotos online fácilmente y sin perder calidad."
          />
          
          <Card 
            to="/herramientas/optimizar-peso"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
            title="Comprimir Imágenes sin Perder Calidad"
            description="Reduce el peso de tus fotos JPG, PNG o WebP hasta en un 80% para que tu web cargue más rápido. Compresión inteligente, segura y al instante."
          />

          <Card 
            to="/herramientas/cambiar-formato"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            )}
            title="Convertir Formato de Imagen"
            description="Convierte fotos a WebP, AVIF, JPG o PNG de forma masiva. El formato ideal para optimizar tu SEO y mejorar la experiencia de tus usuarios."
          />

          <Card 
            to="/herramientas/girar-voltear"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            title="Girar y Voltear Imágenes"
            description="Rota tus fotos o aplícales un efecto espejo fácilmente. Ideal para enderezar imágenes torcidas o crear composiciones simétricas de forma 100% privada."
          />

          <Card 
            to="/herramientas/marca-de-agua"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            )}
            title="Poner Marca de Agua a Fotos"
            description="Protege tus fotografías añadiendo tu logo o texto como marca de agua. Todo se procesa localmente en tu navegador para garantizar tu privacidad."
          />

          <Card 
            disabled
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            )}
            title="Mejorar Calidad de Imagen"
            description="Aumenta la resolución de fotos borrosas o antiguas. Agranda imágenes sin pixelarlas usando tecnología de escalado avanzada desde tu navegador. (Próximamente)"
          />

          <Card 
            to="/herramientas/quitar-fondo"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            )}
            title="Quitar Fondo"
            description="Elimina el fondo de cualquier imagen mágicamente usando IA directamente en tu navegador. Compara el antes y después al instante."
          />

          <Card 
            to="/herramientas/paleta-colores"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            )}
            title="Extraer Paleta de Colores"
            description="Saca los colores predominantes de cualquier imagen y obtén sus códigos HEX. La herramienta ideal para diseñadores web y creativos. Procesamiento instantáneo y local."
          />

          <Card 
            disabled
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            )}
            title="Editor de Fotos Online"
            description="Ajusta el brillo, contraste y aplica filtros profesionales gratis. Edición fotográfica rápida y privada desde la comodidad de tu pantalla. (Próximamente)"
          />

          <Card 
            to="/herramientas/base64"
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            )}
            title="Convertidor Base64"
            description="Codifica tus imágenes a Base64 para incrustarlas en HTML o CSS, o decodifica un código Base64 a imagen. Bidireccional, instantáneo y 100% privado."
          />

          <Card 
            disabled
            icon={(
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            )}
            title="Generador de Favicon ICO"
            description="Crea el icono perfecto para tu página web. Sube tu logo y conviértelo a .ico y otros formatos estandarizados listos para usar. (Próximamente)"
          />
        </div>
      </div>
    </div>
  );
};
