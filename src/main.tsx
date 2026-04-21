import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/variables.css'
import './index.css'

import { initMagickEngine } from './utils/magickEngine';

// Iniciamos la descarga en segundo plano inmediatamente
initMagickEngine();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
