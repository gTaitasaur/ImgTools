import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '32px 16px',
        color: '#86868b',
        fontSize: '0.85rem'
      }}>
        <p>PixelTools — Rendimiento 100% en tu navegador.</p>
      </footer>
    </div>
  );
};
