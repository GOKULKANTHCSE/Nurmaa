import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const MAX_WAIT_MS = 8000;

interface PreloaderProps {
  minMs?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ minMs = 700 }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const runningRef = useRef(false);

  useEffect(() => {
    // Run on mount and on every route change (location)
    let progressInterval: ReturnType<typeof setInterval> | null = null;
    let safetyTimeout: ReturnType<typeof setTimeout> | null = null;
    let mounted = true;

    const startAndWait = async () => {
      if (runningRef.current) return;
      runningRef.current = true;
      setVisible(true);
      setProgress(5);

      const startTime = Date.now();

      // progress updater until resources settle
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / MAX_WAIT_MS) * 100, 95);
        setProgress(newProgress);
      }, 100);

      // Wait for window load OR document readyState complete
      const waitForWindowLoad = () =>
        new Promise<void>((resolve) => {
          if (document.readyState === 'complete') return resolve();
          window.addEventListener('load', () => resolve(), { once: true });
        });

      // Wait for images inside <main> to load
      const waitForMainImages = () =>
        new Promise<void>((resolve) => {
          try {
            const imgs = Array.from(document.querySelectorAll('main img')) as HTMLImageElement[];
            if (imgs.length === 0) return resolve();
            let remaining = imgs.length;
            const check = () => {
              remaining -= 1;
              if (remaining <= 0) resolve();
            };
            imgs.forEach((img) => {
              if (img.complete) {
                check();
              } else {
                img.addEventListener('load', check, { once: true });
                img.addEventListener('error', check, { once: true });
              }
            });
          } catch (e) {
            resolve();
          }
        });

      // Safety timeout to avoid hanging forever
      const safety = new Promise<void>((resolve) => {
        safetyTimeout = setTimeout(() => resolve(), MAX_WAIT_MS);
      });

      // Wait for both window load and main images, bounded by safety timeout
      await Promise.race([Promise.all([waitForWindowLoad(), waitForMainImages()]), safety]);

      if (!mounted) return;

      // Ensure minimum display time
      const elapsedTotal = Date.now() - startTime;
      const remainingMin = Math.max(0, minMs - elapsedTotal);

      setProgress(100);
      setTimeout(() => {
        if (!mounted) return;
        setVisible(false);
        runningRef.current = false;
      }, remainingMin + 250); // small fade allowance

      // cleanup interval
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      if (safetyTimeout) {
        clearTimeout(safetyTimeout);
        safetyTimeout = null;
      }
    };

    startAndWait();

    return () => {
      mounted = false;
      if (progressInterval) clearInterval(progressInterval);
      if (safetyTimeout) clearTimeout(safetyTimeout);
      runningRef.current = false;
    };
    // run again when location changes
  }, [minMs, location]);

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
