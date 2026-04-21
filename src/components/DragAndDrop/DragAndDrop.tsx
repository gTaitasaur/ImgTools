import React, { useState, DragEvent, ChangeEvent } from 'react';
import './DragAndDrop.css';
import { validateImageFile } from '../../utils/fileUpload';

interface DragAndDropProps {
  onImageSelected: (url: string, file: File) => void;
}

export const DragAndDrop: React.FC<DragAndDropProps> = ({ onImageSelected }) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    const url = URL.createObjectURL(file);
    onImageSelected(url, file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="drag-drop-container">
      {error && <div className="error-message">{error}</div>}
      
      <div 
        className={`drop-zone ${isDragActive ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          className="file-input" 
          onChange={handleChange}
          aria-label="Subir imagen"
        />
        <div className="drop-zone-content">
          <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-primary">Haz clic aquí o arrastra tu imagen</span>
          <span className="text-secondary">JPG, PNG o WebP (Max 20MB)</span>
        </div>
      </div>
    </div>
  );
};
