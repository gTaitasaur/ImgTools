import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

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

          {!isHome && (
            <Link to="/" className="back-hub-btn">
              <svg className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Todas las herramientas</span>
            </Link>
          )}
        </div>
      </nav>
      {/* Empujador de contenido para que los elementos no queden tras el nav fixed */}
      <div className="layout-spacer" /> 
    </>
  );
};
