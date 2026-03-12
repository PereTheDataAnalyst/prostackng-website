// The Stack — ProStack NG identity mark
// Three perspective platform slabs. Reusable at any size.

interface StackLogoProps {
  size?: number;       // height in px (width auto-calculated)
  variant?: 'color' | 'white' | 'mono';
  className?: string;
}

export default function StackLogo({ size = 32, variant = 'color', className = '' }: StackLogoProps) {
  const w = Math.round(size * 1.18);
  const h = size;

  const top    = variant === 'white' ? '#ffffff'   : '#2563EB';
  const mid    = variant === 'white' ? '#ffffffBB' : '#1D4ED8';
  const bot    = variant === 'white' ? '#ffffff66' : '#1E3A8A';
  const shine  = variant === 'white' ? '#ffffffCC' : '#93C5FD';

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 52 44"
      fill="none"
      className={className}
      aria-label="ProStack NG"
    >
      <path d="M6 30 L36 30 L46 38 L16 38 Z" fill={bot} opacity={variant === 'color' ? .5 : .4} />
      <path d="M2 20 L32 20 L42 28 L12 28 Z" fill={mid} opacity={variant === 'color' ? .75 : .65} />
      <path d="M0 10 L30 10 L40 18 L10 18 Z" fill={top} />
      <path d="M0 10 L30 10" stroke={shine} strokeWidth="1.5" opacity={variant === 'color' ? .7 : .5} />
    </svg>
  );
}
