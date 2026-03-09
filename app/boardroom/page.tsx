'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
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

// Unique Jitsi room per channel — obscure enough to be private
const JITSI_ROOMS: Record<string, string> = {
  general:     'psng-general-x9k2m',
  engineering: 'psng-engineering-p4q7r',
  boardroom:   'psng-boardroom-z3w8v',
  ops:         'psng-operations-j6n1t',
  random:      'psng-random-h5b9s',
};

type User    = { name: string; role: string; color: string; token: string };
type Message = {
  id: number; room_id: string;
  author_name: string; author_role: string; author_color: string;
  message: string; message_type: string; audio_url: string | null;
  created_at: string;
};

export default function BoardroomPage() {
  const [screen, setScreen]         = useState<'login'|'app'>('login');
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [loading, setLoading]       = useState(false);
  const [user, setUser]             = useState<User|null>(null);
  const [activeRoom, setActiveRoom] = useState('general');
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [sending, setSending]       = useState(false);

  // Voice recording
  const [recording, setRecording]       = useState(false);
  const [recordSeconds, setRecordSecs]  = useState(0);
  const [uploading, setUploading]       = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const recordTimerRef   = useRef<ReturnType<typeof setInterval>|null>(null);

  // Call
  const [callOpen, setCallOpen]   = useState(false);
  const jitsiContainerRef         = useRef<HTMLDivElement>(null);
  const jitsiApiRef               = useRef<any>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // ── Load messages ──────────────────────────────────────────
  const loadMessages = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from('boardroom_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);
    setMessages(data || []);
  }, []);

  useEffect(() => {
    if (screen !== 'app') return;
    loadMessages(activeRoom);
  }, [activeRoom, screen, loadMessages]);

  // ── Realtime subscription ──────────────────────────────────
  useEffect(() => {
    if (screen !== 'app') return;
    const channel = supabase
      .channel(`room-${activeRoom}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'boardroom_messages',
        filter: `room_id=eq.${activeRoom}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeRoom, screen]);

  // ── Auto scroll ────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Login ──────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!tokenInput.trim()) return;
    setLoading(true); setTokenError('');
    try {
      const res  = await fetch('/api/boardroom/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user);
      setScreen('app');
    } catch (err: any) {
      setTokenError(err.message || 'Invalid token');
    } finally { setLoading(false); }
  };

  // ── Send text message ──────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    await supabase.from('boardroom_messages').insert({
      room_id: activeRoom, author_name: user.name,
      author_role: user.role, author_color: user.color,
      message: text, message_type: 'text', audio_url: null,
    });
    setSending(false);
    inputRef.current?.focus();
  };

  // ── Voice recording ────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr     = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current   = [];
      mr.ondataavailable = e => audioChunksRef.current.push(e.data);
      mr.start();
      setRecording(true);
      setRecordSecs(0);
      recordTimerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone in your browser settings.');
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !user) return;
    const mr = mediaRecorderRef.current;
    mr.onstop = async () => {
      setUploading(true);
      const blob     = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const filename = `${activeRoom}/${Date.now()}-${user.token}.webm`;
      const { data, error } = await supabase.storage
        .from('voice-messages')
        .upload(filename, blob, { contentType: 'audio/webm' });
      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('voice-messages')
          .getPublicUrl(data.path);
        await supabase.from('boardroom_messages').insert({
          room_id: activeRoom, author_name: user.name,
          author_role: user.role, author_color: user.color,
          message: '🎤 Voice message', message_type: 'audio',
          audio_url: urlData.publicUrl,
        });
      }
      setUploading(false);
      mr.stream.getTracks().forEach(t => t.stop());
    };
    mr.stop();
    setRecording(false);
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setRecordSecs(0);
  };

  // ── Jitsi call ─────────────────────────────────────────────
  const startCall = useCallback(() => {
    setCallOpen(true);
  }, []);

  useEffect(() => {
    if (!callOpen || !jitsiContainerRef.current || !user) return;
    // Load Jitsi script dynamically
    const existing = document.getElementById('jitsi-script');
    const initJitsi = () => {
      if (jitsiApiRef.current) { jitsiApiRef.current.dispose(); }
      jitsiApiRef.current = new (window as any).JitsiMeetExternalAPI('meet.jit.si', {
        roomName:  JITSI_ROOMS[activeRoom],
        parentNode: jitsiContainerRef.current,
        width:     '100%',
        height:    '100%',
        userInfo:  { displayName: `${user.name} (${user.role})` },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage:   false,
          prejoinPageEnabled:  false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK:       false,
          SHOW_WATERMARK_FOR_GUESTS:  false,
          TOOLBAR_BUTTONS: ['microphone','camera','hangup','chat','raisehand','tileview','fullscreen'],
        },
      });
      jitsiApiRef.current.addEventListener('readyToClose', () => {
        setCallOpen(false);
        if (jitsiApiRef.current) { jitsiApiRef.current.dispose(); jitsiApiRef.current = null; }
      });
    };
    if (!existing) {
      const script    = document.createElement('script');
      script.id       = 'jitsi-script';
      script.src      = 'https://meet.jit.si/external_api.js';
      script.onload   = initJitsi;
      document.head.appendChild(script);
    } else {
      initJitsi();
    }
    return () => {
      if (jitsiApiRef.current && !callOpen) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [callOpen, activeRoom, user]);

  const endCall = () => {
    if (jitsiApiRef.current) { jitsiApiRef.current.dispose(); jitsiApiRef.current = null; }
    setCallOpen(false);
  };

  // ── Helpers ────────────────────────────────────────────────
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const fmtSecs = (s: number) =>
    `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const currentRoom = ROOMS.find(r => r.id === activeRoom);

  // ─────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{
      minHeight: '100vh', background: '#050709', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif',
      backgroundImage: 'linear-gradient(rgba(0,232,122,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.025) 1px,transparent 1px)',
      backgroundSize: '60px 60px',
    }}>
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
          <div style={{ color:'#8899AA', fontSize:13, lineHeight:1.7, marginBottom:24 }}>
            Each staff member has a unique token. Contact your administrator if you don't have one.
          </div>
          <input
            value={tokenInput} onChange={e => setTokenInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="PSN-XXX-000" autoFocus
            style={{ width:'100%', background:'#080C12', border:`1px solid ${tokenError ? '#FF5757' : '#1A2E48'}`, color:'#E2EAF4', padding:'13px 16px', fontSize:15, fontFamily:'monospace', letterSpacing:'.1em', outline:'none', boxSizing:'border-box', marginBottom:8 }}
          />
          {tokenError && <div style={{ color:'#FF5757', fontSize:12, fontFamily:'monospace', marginBottom:10 }}>⚠ {tokenError}</div>}
          <button onClick={handleLogin} disabled={loading} style={{ width:'100%', background:'#00E87A', color:'#000', border:'none', padding:'14px 0', fontWeight:700, fontSize:13, letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer', marginTop:4 }}>
            {loading ? 'Verifying…' : 'Enter BoardRoom →'}
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // APP SCREEN
  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100vh', display:'flex', background:'#050709', fontFamily:'Space Grotesk, sans-serif', overflow:'hidden' }}>

      {/* ── Sidebar ── */}
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
            <button key={room.id} onClick={() => { setActiveRoom(room.id); setCallOpen(false); }}
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
          <button onClick={() => { setScreen('login'); setUser(null); setCallOpen(false); }}
            style={{ background:'none', border:'none', color:'#445566', cursor:'pointer', fontSize:14 }} title="Sign out">⎋</button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Header */}
        <div style={{ padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #111D2E', background:'#080C12', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:'#00E87A', fontSize:16 }}>{currentRoom?.icon}</span>
            <span style={{ color:'#E2EAF4', fontWeight:700, fontSize:14 }}>{currentRoom?.name}</span>
            <span style={{ color:'#445566', fontSize:12 }}>{currentRoom?.desc}</span>
          </div>
          <button onClick={callOpen ? endCall : startCall} style={{
            display:'flex', alignItems:'center', gap:8,
            background: callOpen ? '#FF5757' : '#00E87A',
            border:'none', color:'#000', padding:'8px 16px',
            cursor:'pointer', fontWeight:700, fontSize:12, letterSpacing:'.05em',
          }}>
            {callOpen ? '📵 END CALL' : '📞 START CALL'}
          </button>
        </div>

        {/* Call panel */}
        {callOpen && (
          <div style={{ height:380, borderBottom:'1px solid #111D2E', background:'#000', flexShrink:0, position:'relative' }}>
            <div ref={jitsiContainerRef} style={{ width:'100%', height:'100%' }} />
            <div style={{ position:'absolute', top:10, left:10, background:'rgba(0,232,122,.15)', border:'1px solid rgba(0,232,122,.3)', padding:'4px 10px', fontFamily:'monospace', color:'#00E87A', fontSize:10, letterSpacing:'.08em' }}>
              ● LIVE · #{currentRoom?.name}
            </div>
          </div>
        )}

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
                  {msg.message_type === 'audio' && msg.audio_url ? (
                    <div style={{ display:'flex', alignItems:'center', gap:10, background:'#0C1220', border:'1px solid #111D2E', padding:'10px 14px', maxWidth:300 }}>
                      <span style={{ color:'#00E87A', fontSize:18 }}>🎤</span>
                      <audio controls src={msg.audio_url} style={{ height:32, flex:1, minWidth:0 }} />
                    </div>
                  ) : (
                    <div style={{ color:'#C8D8E8', fontSize:14, lineHeight:1.6, wordBreak:'break-word' }}>{msg.message}</div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding:'12px 20px', borderTop:'1px solid #111D2E', background:'#080C12', flexShrink:0 }}>
          {uploading && (
            <div style={{ fontFamily:'monospace', color:'#00E87A', fontSize:10, marginBottom:8, letterSpacing:'.08em' }}>⬆ Uploading voice message…</div>
          )}
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>

            {/* Voice record button */}
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={uploading}
              title="Hold to record voice message"
              style={{
                width:42, height:42, background: recording ? '#FF5757' : '#0C1220',
                border:`1px solid ${recording ? '#FF5757' : '#1A2E48'}`,
                color: recording ? '#fff' : '#445566', cursor:'pointer',
                fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, transition:'all .15s',
              }}>
              🎤
            </button>

            {recording ? (
              <div style={{ flex:1, background:'#0C1220', border:'1px solid #FF5757', padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ color:'#FF5757', fontSize:10, fontFamily:'monospace', letterSpacing:'.1em' }}>● REC</span>
                <span style={{ color:'#E2EAF4', fontSize:14, fontFamily:'monospace' }}>{fmtSecs(recordSeconds)}</span>
                <span style={{ color:'#445566', fontSize:12 }}>Release button to send</span>
              </div>
            ) : (
              <input
                ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder={`Message #${currentRoom?.name}…`}
                style={{ flex:1, background:'#0C1220', border:'1px solid #1A2E48', color:'#E2EAF4', padding:'12px 16px', fontSize:14, outline:'none', fontFamily:'Space Grotesk, sans-serif' }}
              />
            )}

            <button onClick={sendMessage} disabled={!input.trim() || sending || recording}
              style={{ width:42, height:42, background: input.trim() && !recording ? '#00E87A' : '#0C1220', border:`1px solid ${input.trim() && !recording ? '#00E87A' : '#111D2E'}`, color: input.trim() && !recording ? '#000' : '#445566', cursor: input.trim() && !recording ? 'pointer' : 'default', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
              →
            </button>
          </div>

          <div style={{ fontFamily:'monospace', color:'#2A4060', fontSize:10, marginTop:6, letterSpacing:'.05em' }}>
            ENTER to send · Hold 🎤 to record · This workspace is private and secured
          </div>
        </div>
      </div>
    </div>
  );
}
