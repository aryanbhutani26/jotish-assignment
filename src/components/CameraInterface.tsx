import { useRef, useEffect, useState } from 'react';

interface CameraInterfaceProps {
  onCapture(imageDataUrl: string): void;
  onError(message: string): void;
}

function CameraInterface({ onCapture, onError }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        if (!active) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().then(() => setReady(true)).catch(() => setReady(true));
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError') {
            onError('Camera access was denied. Please allow camera permissions and try again.');
          } else if (err.name === 'NotFoundError') {
            onError('No camera device found on this device.');
          } else {
            onError(err.message || 'An error occurred while accessing the camera.');
          }
        } else {
          onError('An unexpected error occurred while accessing the camera.');
        }
      });

    return () => {
      active = false;
    };
  }, [onError]);

  // Stop stream tracks on unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onError('Failed to capture image.');
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    // Stop the stream after capture
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);

    onCapture(dataUrl);
  }

  return (
    <div style={styles.wrapper}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={styles.video}
        aria-label="Camera preview"
      />
      <button
        style={{ ...styles.captureBtn, opacity: ready ? 1 : 0.5 }}
        onClick={handleCapture}
        disabled={!ready}
      >
        Capture Photo
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  video: {
    width: '100%',
    borderRadius: '6px',
    backgroundColor: '#000',
    display: 'block',
  },
  captureBtn: {
    padding: '10px 24px',
    backgroundColor: '#1e40af',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default CameraInterface;
