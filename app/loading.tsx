// app/loading.tsx — shown during Next.js page transitions
// Displays a minimal branded progress indicator so navigating between pages
// never feels like the site has frozen

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg, #080B14)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9000,
      gap: 24,
    }}>
      {/* Logo mark */}
      <svg width="48" height="40" viewBox="0 0 52 44" fill="none" style={{ opacity: 0.7 }}>
        <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#1E3A8A" opacity=".5"/>
        <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#1D4ED8" opacity=".75"/>
        <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
        <path d="M0 10 L30 10" stroke="#93C5FD" strokeWidth="1.5" opacity=".7"/>
      </svg>

      {/* Animated progress bar */}
      <div style={{
        width: 120,
        height: 2,
        background: 'rgba(37,99,235,.12)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '40%',
          background: 'linear-gradient(90deg, transparent, #2563EB, transparent)',
          animation: 'slide 1.2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-200%); }
          100% { transform: translateX(400%);  }
        }
      `}</style>
    </div>
  );
}
