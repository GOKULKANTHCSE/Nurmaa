import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const getKey = (loc: ReturnType<typeof useLocation>) => loc.key ?? `${loc.pathname}${loc.search}`;

const ScrollRestoration: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const positions = useRef<Map<string, number>>(new Map());
  const currentKeyRef = useRef<string>(getKey(location));

  // update current key when location changes
  useEffect(() => {
    currentKeyRef.current = getKey(location);
  }, [location]);

  // global scroll listener to persist current position for current key
  useEffect(() => {
    const onScroll = () => {
      positions.current.set(currentKeyRef.current, window.scrollY || 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // restore behavior on location change
  useEffect(() => {
    const key = getKey(location);

    // If there's a hash fragment, attempt to scroll to the element
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      // delay slightly so element is in DOM
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }

    // POP navigation (back/forward) -> restore saved position if available
    if (navType === 'POP') {
      const y = positions.current.get(key) ?? 0;
      window.scrollTo({ top: y, behavior: 'auto' });
      return;
    }

    // For new navigations (PUSH/REPLACE), scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location, navType]);

  return null;
};

export default ScrollRestoration;
