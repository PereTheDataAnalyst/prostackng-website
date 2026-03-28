'use client';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function OpenChatButton({ children, className, style }: Props) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent('psng:open-chat'));
    // Scroll to bottom-right so the user sees the chat widget open
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
