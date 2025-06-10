import React, { useState } from 'react';

interface PlantVisualProps {
  emotion: string;
  intensity: number;
  date: string;
  journalSummary: string;
  plantConfig: {
    color: string;
    shape: string;
    animation: string;
  };
}

const emotionEmoji: Record<string, string> = {
  joy: '🌸',
  calm: '🌿',
  stress: '🥀',
  sadness: '💧',
  anger: '🌵',
};

const PlantVisual: React.FC<PlantVisualProps> = ({ emotion, intensity, date, journalSummary, plantConfig }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className="relative flex flex-col items-center cursor-pointer group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* SVG or Emoji for now, can be replaced with animated SVGs */}
      <div
        className="w-16 h-16 flex items-center justify-center rounded-full shadow-lg"
        style={{ backgroundColor: plantConfig.color, transition: 'background 0.3s' }}
      >
        <span className="text-3xl">
          {emotionEmoji[emotion] || '🌱'}
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-2">{date}</div>
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-64 z-50 text-sm text-gray-700 animate-fade-in">
          <div className="font-bold mb-1 capitalize">{emotion} ({Math.round(intensity * 100)}%)</div>
          <div className="italic mb-2">{journalSummary}</div>
          <div className="text-xs text-gray-400">{date}</div>
        </div>
      )}
    </div>
  );
};

export default PlantVisual; 