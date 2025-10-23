import React from 'react';

const LazyImage: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  fit?: 'cover' | 'contain';
}> = ({ src, alt = '', className = '', width, height, fit = 'cover' }) => {
  const [loaded, setLoaded] = React.useState(false);
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${!loaded ? 'animate-pulse' : ''}`}
      style={{ width: width || '100%', height: height || 'auto', willChange: 'opacity, transform' }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={width as any}
        height={height as any}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full ${fitClass} transition-[opacity,transform,filter] duration-300 ease-out ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-101'} ${className}`}
        style={{ transformOrigin: 'center center', backfaceVisibility: 'hidden' }}
      />
      {/* subtle gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
};

export default LazyImage;
