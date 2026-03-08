'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ROOMS = [
  { id: 'general',     name: 'General',     icon: '◈', desc: 'Company-wide updates' },
  { id: 'engineering', name: 'Engineering', icon: '⬡', desc: 'Dev team channel' },
  { id: 'boardroom',   name: 'BoardRoom',   icon: '▦', desc: 'Executive meetings' },
  { id: 'ops',         name: 'Operations',  icon: '◎', desc: 'Day-to-day ops' },
  { id: 'random',      name: 'Random',      icon: '⟁', desc: 'Non-work chat' },
];

type User = { name: string; role: string; color: string; token: string };
type Message = { id: number; room_id: string; author_name: string; author_role: string; author_color: string; message: string; created_at: string };

export default function BoardroomPage() {
  const [screen, setScreen]       = useState<'login'|'app'>('login');
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [loading, setLoading]     = useState(false);
  const [user, setUser]           = useState<User|null>(null);
  const [activeRoom, setActiveRoom] = useState('general');
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [sending, setSending]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Load messages when room changes
  useEffect(() => {
    if (screen !== 'app') return;
    loadMessages(activeRoom);
  }, [activeRoom, screen]);

  // Realtime subscription
  useEffect(() => {
    if (screen !== 'app') return;
    const channel = supabase
      .channel('boardroom')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'boardroom_messages',
        filter: `room_id=eq.${activeRoom}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeRoom, screen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (roomId: string) => {
    const { data } = await supabase
      .from('boardroom_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);
    setMessages(data || []);
  };

  const handleLogin = async () => {
    if (!tokenInput.trim()) return;
    setLoading(true);
    setTokenError('');
    try {
      const res = await fetch('/api/boardroom/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user);
      setScreen('app');
    } catch (err: any) {
      setTokenError(err.message || 'Invalid token');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    await supabase.from('boardroom_messages').insert({
      room_id: activeRoom,
      author_name: user.name,
      author_role: user.role,
      author_color: user.color,
      message: text,
    });
    setSending(false);
    inputRef.current?.focus();
  };

  const currentRoom = ROOMS.find(r => r.id === activeRoom);
  const fmt = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // ── LOGIN SCREEN ──────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ minHeight:'100vh', background:'#050709', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Grotesk, sans-serif', backgroundImage:'linear-gradient(rgba(0,232,122,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.025) 1px,transparent 1px)', backgroundSize:'60px 60px' }}>
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:500, height:500, background:'radial-gradient(circle,rgba(0,232,122,.06) 0%,transparent 65%)', pointerEvents:'none' }} />
      <div style={{ width:'100%', maxWidth:420, padding:'0 24px', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:48, height:48, background:'#00E87A', color:'#000', fontWeight:900, fontSize:16, marginBottom:16 }}>PS</div>
          <div style={{ color:'#E2EAF4', fontWeight:800, fontSize:20, letterSpacing:'-.02em' }}>ProStack BoardRoom</div>
          <div style={{ color:'#445566', fontSize:11, marginTop:6, fontFamily:'monospace', letterSpacing:'.12em' }}>STAFF ACCESS ONLY</div>
        </div>
        <div style={{ background:'#0C1220', border:'1px solid #111D2E', padding:'40px 36px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#00E87A,#00C8FF,transparent)' }} />
          <div style={{ fontFamily:'monospace', color:'#445566', fontSize:10, letterSpacing:'.15em', marginBottom:6 }}>STAFF ACCESS TOKEN</div>
          <div style={{ color:'#E2EAF4', fontWeight:700, fontSize:17, marginBottom:4 }}>Enter your token</div>
          <div style={{ color:'#8899AA', fontSize:13, lineHeight:1.7, marginBottom:24 }}>Each staff member has a unique token. Contact your administrator if you don't have one.</div>
          <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="PSN-XXX-000" autoFocus
            style={{ width:'100%', background:'#080C12', border:`1px solid ${tokenError ? '#FF5757' : '#1A2E48'}`, color:'#E2EAF4', padding:'13px 16px', fontSize:15, fontFamily:'monospace', letterSpacing:'.1em', outline:'none', boxSizing:'border-box', marginBottom:8 }} />
          {tokenError && <div style={{ color:'#FF5757', fontSize:12, fontFamily:'monospace', marginBottom:10 }}>⚠ {tokenError}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{ width:'100%', background:'#00E87A', color:'#000', border:'none', padding:'14px 0', fontWeight:700, fontSize:13, letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer', marginTop:4 }}>
            {loading ? 'Verifying…' : 'Enter BoardRoom →'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── APP SCREEN ────────────────────────────────────────────
  return (
    <div style={{ height:'100vh', display:'flex', background:'#050709', fontFamily:'Space Grotesk, sans-serif', overflow:'hidden' }}>

      {/* Sidebar */}
      <div style={{ width:220, background:'#080C12', borderRight:'1px solid #111D2E', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #111D2E', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'#00E87A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:11, color:'#000', flexShrink:0 }}>PS</div>
          <div>
            <div style={{ color:'#E2EAF4', fontWeight:700, fontSize:13 }}>ProStack NG</div>
            <div style={{ color:'#00E87A', fontSize:9, fontFamily:'monospace', letterSpacing:'.08em' }}>● WORKSPACE</div>
          </div>
        </div>
        <div style={{ flex:1, overflow:'auto', padding:'12px 0' }}>
          <div style={{ padding:'4px 16px 8px', fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em' }}>CHANNELS</div>
          {ROOMS.map(room => (
            <button key={room.id} onClick={() => setActiveRoom(room.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 16px', background: activeRoom === room.id ? 'rgba(0,232,122,.08)' : 'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft: activeRoom === room.id ? '2px solid #00E87A' : '2px solid transparent' }}>
              <span style={{ color: activeRoom === room.id ? '#00E87A' : '#445566', fontSize:13 }}>{room.icon}</span>
              <span style={{ color: activeRoom === room.id ? '#E2EAF4' : '#8899AA', fontSize:13, fontWeight: activeRoom === room.id ? 600 : 400 }}>{room.name}</span>
            </button>
          ))}
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid #111D2E', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background: user!.color + '20', border:`1.5px solid ${user!.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:user!.color, fontSize:11, flexShrink:0 }}>
            {user!.name.split(' ').map((n:string) => n[0]).join('')}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:'#E2EAF4', fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user!.name}</div>
            <div style={{ color:'#445566', fontSize:10, fontFamily:'monospace' }}>{user!.role}</div>
          </div>
          <button onClick={() => { setScreen('login'); setUser(null); }} style={{ background:'none', border:'none', color:'#445566', cursor:'pointer', fontSize:14 }} title="Sign out">⎋</button>
        </div>
      </div>

      {/* Main chat */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <div style={{ padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #111D2E', background:'#080C12', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:'#00E87A', fontSize:16 }}>{currentRoom?.icon}</span>
            <span style={{ color:'#E2EAF4', fontWeight:700, fontSize:14 }}>{currentRoom?.name}</span>
            <span style={{ color:'#445566', fontSize:12 }}>{currentRoom?.desc}</span>
          </div>
          <div style={{ fontFamily:'monospace', color:'#2A4060', fontSize:10, letterSpacing:'.08em' }}>END-TO-END SECURED · PROSTACK NG</div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflow:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:2 }}>
          {messages.length === 0 && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#2A4060', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{currentRoom?.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, color:'#445566', marginBottom:4 }}>#{currentRoom?.name}</div>
              <div style={{ fontSize:13 }}>No messages yet. Start the conversation.</div>
            </div>
          )}
          {messages.map((msg, i) => {
            const showHeader = i === 0 || messages[i-1].author_name !== msg.author_name;
            return (
              <div key={msg.id} style={{ display:'flex', gap:10, marginTop: showHeader ? 12 : 0 }}>
                {showHeader
                  ? <div style={{ width:34, height:34, background: msg.author_color + '20', border:`1.5px solid ${msg.author_color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:msg.author_color, fontSize:11, flexShrink:0 }}>
                      {msg.author_name.split(' ').map((n:string) => n[0]).join('')}
                    </div>
                  : <div style={{ width:34, flexShrink:0 }} />
                }
                <div style={{ flex:1, minWidth:0 }}>
                  {showHeader && (
                    <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:3 }}>
                      <span style={{ color: msg.author_color, fontWeight:700, fontSize:13 }}>{msg.author_name}</span>
                      <span style={{ fontFamily:'monospace', color:'#2A4060', fontSize:9 }}>{msg.author_role}</span>
                      <span style={{ fontFamily:'monospace', color:'#2A4060', fontSize:9 }}>{fmt(msg.created_at)}</span>
                    </div>
                  )}
                  <div style={{ color:'#C8D8E8', fontSize:14, lineHeight:1.6, wordBreak:'break-word' }}>{msg.message}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding:'14px 24px', borderTop:'1px solid #111D2E', background:'#080C12' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={`Message #${currentRoom?.name}…`}
              style={{ flex:1, background:'#0C1220', border:'1px solid #1A2E48', color:'#E2EAF4', padding:'12px 16px', fontSize:14, outline:'none', fontFamily:'Space Grotesk, sans-serif' }} />
            <button onClick={sendMessage} disabled={!input.trim() || sending}
              style={{ background: input.trim() ? '#00E87A' : '#0C1220', border:`1px solid ${input.trim() ? '#00E87A' : '#111D2E'}`, color: input.trim() ? '#000' : '#445566', padding:'12px 18px', cursor: input.trim() ? 'pointer' : 'default', fontWeight:700, fontSize:13, transition:'all .15s' }}>
              →
            </button>
          </div>
          <div style={{ fontFamily:'monospace', color:'#2A4060', fontSize:10, marginTop:6, letterSpacing:'.05em' }}>ENTER to send · This workspace is private and secured</div>
        </div>
      </div>
    </div>
  );
}