import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';

const MAX_WAIT_MS = 8000;

interface PreloaderProps {
  minMs?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ minMs = 700 }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let finished = false;
    let progressInterval: NodeJS.Timeout;

    const onLoad = () => {
      finished = true;
      setProgress(100);
      setTimeout(() => setVisible(false), 300);
    };

    const startTime = Date.now();
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / MAX_WAIT_MS) * 100, 95);
      setProgress(newProgress);
    }, 50);

    const minTimer = setTimeout(() => {
      if (!finished) {
        window.addEventListener('load', onLoad, { once: true });
      } else {
        setVisible(false);
      }
    }, minMs);

    const safetyTimeout = setTimeout(() => {
      if (!finished) {
        finished = true;
        setProgress(100);
        setVisible(false);
      }
    }, MAX_WAIT_MS);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      if (!finished) {
        finished = true;
        clearTimeout(minTimer);
        setProgress(100);
        setTimeout(() => setVisible(false), 300);
      }
    }

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimeout);
      clearInterval(progressInterval);
      window.removeEventListener('load', onLoad);
    };
  }, [minMs]);

  if (!visible) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-nurmaa-beige transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <img
            src={logo}
            alt="Nurmaa Logo"
            className="w-full h-full relative z-10 object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-4 w-64">
          <div className="w-full h-1.5 bg-nurmaa-peach/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nurmaa-purple to-nurmaa-dark rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-nurmaa-dark text-sm font-semibold tracking-wider">
              Loading Experience
            </p>
            <p className="text-nurmaa-dark/70 text-xs mt-1">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
