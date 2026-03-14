'use client';
import { useState, useEffect } from 'react';

// Thin progress bar fixed to top of page — shows how far through the article the reader is.
// Only renders on blog post pages. Fades out smoothly at 100%.

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(pct, 100));
      setVisible(scrollTop > 80);
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9998,
        background: 'transparent',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity .3s',
      }}
    >
      {/* Track */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(37,99,235,.08)' }} />
      {/* Fill */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, bottom: 0,
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #2563EB, #06B6D4)',
          transition: 'width .1s linear',
          // Glow effect
          boxShadow: '0 0 8px rgba(37,99,235,.6)',
        }}
      />
      {/* Reading time remaining — tiny indicator dot at the tip */}
      <div
        style={{
          position: 'absolute',
          top: -2,
          left: `${progress}%`,
          transform: 'translateX(-50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#06B6D4',
          opacity: progress > 2 && progress < 99 ? 1 : 0,
          transition: 'opacity .2s',
          boxShadow: '0 0 6px rgba(6,182,212,.8)',
        }}
      />
    </div>
  );
}
