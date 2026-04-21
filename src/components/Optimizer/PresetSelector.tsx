import React from 'react';
import { OptimizationPreset, OPTIMIZATION_PRESETS } from '../../types/optimizer';

interface PresetSelectorProps {
  selectedId: string;
  disabled?: boolean;
  onSelect: (preset: OptimizationPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ selectedId, disabled, onSelect }) => {
  return (
    <div className={`preset-grid ${disabled ? 'disabled' : ''}`} style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      {OPTIMIZATION_PRESETS.map((preset) => (
        <button
          key={preset.id}
          className={`preset-card ${selectedId === preset.id ? 'active' : ''}`}
          onClick={() => onSelect(preset)}
          type="button"
          disabled={disabled}
        >
          <div className="preset-header">
            <h4>{preset.label}</h4>
            {preset.badge && <span className="preset-badge">{preset.badge}</span>}
          </div>
          <p className="preset-desc">{preset.description}</p>
          <div className="preset-specs">
            <span>Calidad: {preset.quality * 100}%</span>
            <span>Máx. Ancho: {preset.maxWidthOrHeight === 99999 ? 'Original' : `${preset.maxWidthOrHeight}px`}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
