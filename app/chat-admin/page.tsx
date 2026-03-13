'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Session = {
  id: string;
  visitor_name: string;
  visitor_email: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  lastMessage?: string;
  unread?: number;
};

type Message = {
  id: number;
  session_id: string;
  sender: 'visitor' | 'agent';
  message: string;
  created_at: string;
};

// Simple PIN auth — change this to something private
const ADMIN_PIN = '0000';

export default function ChatAdmin() {
  const [authed, setAuthed]         = useState(false);
  const [pin, setPin]               = useState('');
  const [sessions, setSessions]     = useState<Session[]>([]);
  const [active, setActive]         = useState<Session | null>(null);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [reply, setReply]           = useState('');
  const [sending, setSending]       = useState(false);
  const bottomRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authed) return;
    loadSessions();
    const channel = supabase.channel('admin-sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, loadSessions)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, () => {
        loadSessions();
        if (active) loadMessages(active.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authed, active?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadSessions() {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });
    if (data) setSessions(data as Session[]);
  }

  async function loadMessages(sid: string) {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  }

  async function selectSession(s: Session) {
    setActive(s);
    await loadMessages(s.id);
    // Mark session updated
    await supabase.from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', s.id);
  }

  async function sendReply() {
    if (!reply.trim() || !active || sending) return;
    setSending(true);
    const msg = reply.trim();
    setReply('');
    await supabase.from('chat_messages').insert({
      session_id: active.id,
      sender: 'agent',
      message: msg,
    });
    setSending(false);
  }

  async function closeSession(id: string) {
    await supabase.from('chat_sessions').update({ status: 'closed' }).eq('id', id);
    if (active?.id === id) setActive(null);
    loadSessions();
  }

  // PIN screen
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#080B14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ background: '#0C0F1C', border: '1px solid #181C30', padding: 40, width: 320 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#EEF0FF', marginBottom: 8, letterSpacing: '-.03em' }}>Chat Admin</div>
        <p style={{ fontSize: 12, color: '#7A7DA0', marginBottom: 24 }}>ProStack NG internal tool</p>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && pin === ADMIN_PIN && setAuthed(true)}
          placeholder="Enter PIN"
          style={{ width: '100%', background: '#080B14', border: '1px solid #181C30', color: '#EEF0FF', padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 }}
        />
        <button
          onClick={() => pin === ADMIN_PIN && setAuthed(true)}
          style={{ width: '100%', background: '#2563EB', border: 'none', color: '#000', padding: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Enter →
        </button>
        {pin && pin !== ADMIN_PIN && <p style={{ fontSize: 11, color: '#FF5757', marginTop: 8 }}>Incorrect PIN</p>}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080B14', display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* Sidebar — sessions list */}
      <div style={{ width: 280, background: '#0C0F1C', borderRight: '1px solid #181C30', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #181C30' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#EEF0FF', letterSpacing: '-.03em' }}>Live Chat</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#7A7DA0', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 4 }}>
            {sessions.filter(s => s.status === 'open').length} open conversations
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.length === 0 && (
            <div style={{ padding: 20, fontSize: 12, color: '#32365A', textAlign: 'center', marginTop: 40 }}>No conversations yet</div>
          )}
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => selectSession(s)}
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid #181C30',
                cursor: 'pointer',
                background: active?.id === s.id ? '#111428' : 'transparent',
                borderLeft: active?.id === s.id ? '2px solid #2563EB' : '2px solid transparent',
                transition: 'background .15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#EEF0FF' }}>{s.visitor_name}</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'open' ? '#22C55E' : '#32365A', flexShrink: 0 }} />
              </div>
              {s.visitor_email && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#7A7DA0', letterSpacing: '.06em' }}>{s.visitor_email}</div>
              )}
              <div style={{ fontSize: 10, color: '#32365A', marginTop: 4 }}>
                {new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main — messages */}
      {!active ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#32365A', fontSize: 14 }}>
          Select a conversation to reply
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #181C30', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#EEF0FF' }}>{active.visitor_name}</div>
              {active.visitor_email && <div style={{ fontSize: 12, color: '#7A7DA0', marginTop: 2 }}>{active.visitor_email}</div>}
            </div>
            <button
              onClick={() => closeSession(active.id)}
              style={{ background: 'none', border: '1px solid #181C30', color: '#7A7DA0', padding: '6px 14px', fontSize: 11, fontFamily: 'Syne, sans-serif', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Close Chat
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'agent' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ maxWidth: '65%', background: msg.sender === 'agent' ? '#2563EB' : '#111428', border: msg.sender === 'agent' ? 'none' : '1px solid #181C30', color: msg.sender === 'agent' ? '#000' : '#EEF0FF', padding: '10px 14px', fontSize: 13.5, lineHeight: 1.6 }}>
                  {msg.message}
                </div>
                <div style={{ fontSize: 10, color: '#32365A', flexShrink: 0 }}>
                  {msg.sender === 'agent' ? 'You' : active.visitor_name}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Reply input */}
          <div style={{ borderTop: '1px solid #181C30', padding: '16px 24px', display: 'flex', gap: 12, background: '#0C0F1C', flexShrink: 0 }}>
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendReply()}
              placeholder="Type your reply..."
              disabled={active.status === 'closed'}
              style={{ flex: 1, background: '#080B14', border: '1px solid #181C30', color: '#EEF0FF', padding: '12px 16px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            />
            <button
              onClick={sendReply}
              disabled={!reply.trim() || sending || active.status === 'closed'}
              style={{ background: reply.trim() && active.status === 'open' ? '#2563EB' : '#0F1220', border: 'none', color: reply.trim() ? '#000' : '#32365A', padding: '12px 24px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              {sending ? '…' : 'Send →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
