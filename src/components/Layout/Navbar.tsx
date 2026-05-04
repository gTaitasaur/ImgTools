import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="brand-link">
            PixelTools
          </Link>

          <div className="navbar-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/" className="nav-link">Herramientas</Link>
            <Link to="/" className="nav-link">Acerca de</Link>
            <Link to="/" className="nav-btn-support">Soporte</Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

