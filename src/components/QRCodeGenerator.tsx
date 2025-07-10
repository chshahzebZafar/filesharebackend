
import React, { useEffect, useRef } from 'react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url, size = 128 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code simulation (in a real app, use a proper QR library like qrcode.js)
    const generateSimpleQR = () => {
      const cellSize = size / 25;
      
      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      // Generate random pattern (this is just for demo - use proper QR library)
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      
      // Add corner squares (QR code positioning markers)
      const markerSize = cellSize * 7;
      
      // Top-left
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, markerSize, markerSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cellSize, cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(cellSize * 2, cellSize * 2, markerSize - 4 * cellSize, markerSize - 4 * cellSize);
      
      // Top-right
      ctx.fillStyle = '#000000';
      ctx.fillRect(size - markerSize, 0, markerSize, markerSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size - markerSize + cellSize, cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(size - markerSize + cellSize * 2, cellSize * 2, markerSize - 4 * cellSize, markerSize - 4 * cellSize);
      
      // Bottom-left
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, size - markerSize, markerSize, markerSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cellSize, size - markerSize + cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(cellSize * 2, size - markerSize + cellSize * 2, markerSize - 4 * cellSize, markerSize - 4 * cellSize);
    };

    generateSimpleQR();
  }, [url, size]);

  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-200 dark:border-gray-600 rounded"
      />
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Scan to download files
      </p>
    </div>
  );
};

export default QRCodeGenerator;
