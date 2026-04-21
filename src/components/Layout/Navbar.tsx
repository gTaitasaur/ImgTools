import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="brand-link">
            <svg className="brand-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            PixelTools
          </Link>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
            <NavLink 
              to="/herramientas/recorte-aspect-ratio" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={() => setIsMenuOpen(false)}
            >
              Recargar & Recortar
            </NavLink>
            <NavLink 
              to="/herramientas/optimizar-peso" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={() => setIsMenuOpen(false)}
            >
              Optimizar Peso
            </NavLink>
            <NavLink 
              to="/herramientas/cambiar-formato" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={() => setIsMenuOpen(false)}
            >
              Cambiar Formato
            </NavLink>
            <NavLink to="/herramientas/marca-de-agua" className="nav-link" style={{ opacity: 0.5 }} onClick={() => setIsMenuOpen(false)}>
              Marca de Agua
            </NavLink>
            <NavLink to="/herramientas/mejorar-calidad" className="nav-link" style={{ opacity: 0.5 }} onClick={() => setIsMenuOpen(false)}>
              Mejorar Calidad
            </NavLink>
            <NavLink to="/herramientas/quitar-fondo" className="nav-link" style={{ opacity: 0.5 }} onClick={() => setIsMenuOpen(false)}>
              Quitar Fondo
            </NavLink>
            <NavLink to="/herramientas/paleta-colores" className="nav-link" style={{ opacity: 0.5 }} onClick={() => setIsMenuOpen(false)}>
              Colores
            </NavLink>
            <NavLink to="/herramientas/filtros" className="nav-link" style={{ opacity: 0.5 }} onClick={() => setIsMenuOpen(false)}>
              Filtros Express
            </NavLink>
            <NavLink to="/herramientas/base64" className="nav-link" style={{ opacity: 0.5 }} onClick={() => setIsMenuOpen(false)}>
              A Base64
            </NavLink>
            <NavLink to="/herramientas/favicons" className="nav-link" style={{ opacity: 0.5 }} onClick={() => setIsMenuOpen(false)}>
              Favicons
            </NavLink>
          </div>
        </div>
      </nav>
      {/* Empujador de contenido para que los elementos no queden tras el nav fixed */}
      <div className="layout-spacer" /> 
    </>
  );
};
