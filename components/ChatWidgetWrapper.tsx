'use client';
import { usePathname } from 'next/navigation';
import ChatWidget from './ChatWidget';

// Pages where the public chat bubble should NOT appear.
// The boardroom has its own internal comms system.
// chat-admin is a staff-only interface.
const HIDDEN_PATHS = ['/boardroom', '/chat-admin'];

export default function ChatWidgetWrapper() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null;
  return <ChatWidget />;
}
