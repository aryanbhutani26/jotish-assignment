import { useRef, useEffect, useState } from 'react';

interface SignatureCanvasProps {
  backgroundImage: string; // data URL of captured photo
  width: number;
  height: number;
  onConfirm(mergedDataUrl: string): void;
}

function SignatureCanvas({ backgroundImage, width, height, onConfirm }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [mergeError, setMergeError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Transparent background — strokes only
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height]);

  function getPos(e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function getTouchPos(e: React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } {
    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handleMouseUp() {
    isDrawing.current = false;
  }

  function handleTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getTouchPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getTouchPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    isDrawing.current = false;
  }

  function handleConfirm() {
    try {
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const ctx = offscreen.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D context');

      const img = new Image();
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, width, height);
          if (canvasRef.current) {
            ctx.drawImage(canvasRef.current, 0, 0);
          }
          const mergedDataUrl = offscreen.toDataURL('image/png');
          onConfirm(mergedDataUrl);
        } catch {
          setMergeError('Failed to generate audit image.');
        }
      };
      img.onerror = () => {
        setMergeError('Failed to generate audit image.');
      };
      img.src = backgroundImage;
    } catch {
      setMergeError('Failed to generate audit image.');
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={{ position: 'relative', width, height }}>
        {/* Background image */}
        <img
          src={backgroundImage}
          alt="Captured photo"
          style={{ position: 'absolute', top: 0, left: 0, width, height, display: 'block' }}
        />
        {/* Signature canvas overlaid on top */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {mergeError && (
        <div role="alert" style={styles.errorBox}>
          {mergeError}
        </div>
      )}

      <div style={styles.actions}>
        <button style={styles.confirmBtn} onClick={handleConfirm}>
          Confirm Signature
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
  },
  errorBox: {
    padding: '10px 14px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    color: '#b91c1c',
    fontSize: '0.875rem',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  confirmBtn: {
    padding: '10px 20px',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default SignatureCanvas;
