'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: number;
  session_id: string;
  sender: 'visitor' | 'agent';
  message: string;
  created_at: string;
};

type Step = 'bubble' | 'intro' | 'chat';

export default function ChatWidget() {
  const [step, setStep]           = useState<Step>('bubble');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [input, setInput]         = useState('');
  const [messages, setMessages]   = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending]     = useState(false);
  const [unread, setUnread]       = useState(0);
  const [agentOnline, setAgentOnline] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('psng_chat_session');
    if (saved) {
      setSessionId(saved);
      setStep('chat');
      loadMessages(saved);
    }
  }, []);

  // Check if any agent is online (simple heuristic — session updated recently)
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from('chat_sessions')
        .select('updated_at')
        .eq('status', 'open')
        .order('updated_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        const last = new Date(data[0].updated_at).getTime();
        setAgentOnline(Date.now() - last < 5 * 60 * 1000); // active in last 5min
      }
    };
    check();
  }, []);

  // Realtime subscription
  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        const msg = payload.new as Message;
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        if (msg.sender === 'agent' && step !== 'chat') setUnread(u => u + 1);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sessionId, step]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear unread when chat opens
  useEffect(() => {
    if (step === 'chat') setUnread(0);
  }, [step]);

  // External trigger — dispatch window event 'psng:open-chat' to open from anywhere
  useEffect(() => {
    const handler = () => {
      setStep(prev => prev === 'bubble' ? (sessionId ? 'chat' : 'intro') : prev);
    };
    window.addEventListener('psng:open-chat', handler);
    return () => window.removeEventListener('psng:open-chat', handler);
  }, [sessionId]);

  async function loadMessages(sid: string) {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  }

  async function startChat() {
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ visitor_name: name.trim(), visitor_email: email.trim() || null })
      .select()
      .single();
    if (error || !data) return;
    const sid = data.id;
    setSessionId(sid);
    localStorage.setItem('psng_chat_session', sid);
    // Welcome message from agent
    await supabase.from('chat_messages').insert({
      session_id: sid,
      sender: 'agent',
      message: `Hi ${name.trim()} 👋 Welcome to ProStack NG. How can we help you today?`,
    });
    await loadMessages(sid);
    setStep('chat');
  }

  async function sendMessage() {
    if (!input.trim() || !sessionId || sending) return;
    setSending(true);
    const msg = input.trim();
    setInput('');
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender: 'visitor',
      message: msg,
    });
    // Also email to contact address
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, service: 'LIVE_CHAT',
        message: `[Live Chat] ${name}: ${msg}`,
        company: sessionId,
      }),
    }).catch(() => {});
    setSending(false);
  }

  const styles = {
    bubble: {
      position: 'fixed' as const,
      bottom: 28, right: 28,
      width: 56, height: 56,
      background: 'var(--blue)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 24px rgba(37,99,235,.5)',
      zIndex: 9999,
      border: 'none',
      transition: 'transform .2s, box-shadow .2s',
    },
    window: {
      position: 'fixed' as const,
      bottom: 96, right: 28,
      width: 'min(380px, calc(100vw - 32px))',
      height: 'min(520px, calc(100vh - 120px))',
      background: 'var(--bg, #080B14)',
      border: '1px solid var(--border, #181C30)',
      boxShadow: '0 24px 80px rgba(0,0,0,.6)',
      display: 'flex',
      flexDirection: 'column' as const,
      zIndex: 9999,
      overflow: 'hidden',
    },
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        style={styles.bubble}
        onClick={() => setStep(step === 'bubble' ? (sessionId ? 'chat' : 'intro') : 'bubble')}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        aria-label="Open chat"
      >
        {step === 'bubble' || step === 'intro' ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        )}
        {unread > 0 && (
          <div style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, background: '#FF5757', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
            {unread}
          </div>
        )}
      </button>

      {/* Chat window */}
      {(step === 'intro' || step === 'chat') && (
        <div style={styles.window}>

          {/* Header */}
          <div style={{ background: 'var(--s1, #0C0F1C)', borderBottom: '1px solid var(--border, #181C30)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#000', flexShrink: 0 }}>
              P
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text, #EEF0FF)', letterSpacing: '-.01em' }}>ProStack NG</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: agentOnline ? '#22C55E' : '#F5B530', flexShrink: 0 }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--sub, #7A7DA0)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  {agentOnline ? 'Online now' : 'Usually replies within 2 hours'}
                </span>
              </div>
            </div>
            <button onClick={() => setStep('bubble')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sub, #7A7DA0)', padding: 4, display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Intro screen */}
          {step === 'intro' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, gap: 16, overflowY: 'auto' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text, #EEF0FF)', letterSpacing: '-.03em', lineHeight: 1.2 }}>
                👋 Hi there!
              </div>
              <p style={{ fontSize: 13, color: 'var(--sub, #7A7DA0)', lineHeight: 1.7, margin: 0 }}>
                Have a question about our products? Want to book a demo? We're here to help.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name *"
                  style={{ background: 'var(--s1, #0C0F1C)', border: '1px solid var(--border, #181C30)', color: 'var(--text, #EEF0FF)', padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', width: '100%', boxSizing: 'border-box' as const }}
                  onFocus={e => { e.target.style.borderColor = 'var(--blue)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border, #181C30)'; }}
                />
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  type="email"
                  style={{ background: 'var(--s1, #0C0F1C)', border: '1px solid var(--border, #181C30)', color: 'var(--text, #EEF0FF)', padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', width: '100%', boxSizing: 'border-box' as const }}
                  onFocus={e => { e.target.style.borderColor = 'var(--blue)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border, #181C30)'; }}
                />
                <button
                  onClick={startChat}
                  disabled={!name.trim()}
                  style={{ background: name.trim() ? 'var(--blue)' : 'var(--s2, #0F1220)', border: 'none', color: name.trim() ? '#000' : 'var(--muted, #32365A)', padding: '12px 20px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', cursor: name.trim() ? 'pointer' : 'default', transition: 'background .2s' }}
                >
                  Start Conversation →
                </button>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border, #181C30)' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted, #32365A)', letterSpacing: '.06em', textTransform: 'uppercase', margin: 0 }}>
                  Or reach us directly — contact@prostackng.com.ng
                </p>
              </div>
            </div>
          )}

          {/* Chat screen */}
          {step === 'chat' && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'visitor' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                    {msg.sender === 'agent' && (
                      <div style={{ width: 26, height: 26, background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#000', flexShrink: 0 }}>P</div>
                    )}
                    <div style={{
                      maxWidth: '75%',
                      background: msg.sender === 'visitor' ? 'var(--blue)' : 'var(--card, #111428)',
                      border: msg.sender === 'visitor' ? 'none' : '1px solid var(--border, #181C30)',
                      color: msg.sender === 'visitor' ? '#000' : 'var(--text, #EEF0FF)',
                      padding: '9px 13px',
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: msg.sender === 'visitor' ? 600 : 400,
                    }}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ borderTop: '1px solid var(--border, #181C30)', padding: '12px 16px', display: 'flex', gap: 8, flexShrink: 0, background: 'var(--s1, #0C0F1C)' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  style={{ flex: 1, background: 'var(--bg, #080B14)', border: '1px solid var(--border, #181C30)', color: 'var(--text, #EEF0FF)', padding: '10px 13px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: 0 }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  style={{ background: input.trim() ? 'var(--blue)' : 'var(--s2, #0F1220)', border: 'none', color: input.trim() ? '#000' : 'var(--muted)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'background .15s' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>

              {/* Footer */}
              <div style={{ padding: '6px 16px 10px', background: 'var(--s1, #0C0F1C)' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, color: 'var(--muted, #32365A)', letterSpacing: '.06em', textTransform: 'uppercase', margin: 0, textAlign: 'center' }}>
                  Powered by ProStack NG
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
