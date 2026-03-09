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

// Each channel has its own private Jitsi room — opened in new tab (reliable on any network)
const CALL_URLS: Record<string, string> = {
  general:     'https://meet.jit.si/psng-general-x9k2m7',
  engineering: 'https://meet.jit.si/psng-engineering-p4q7r3',
  boardroom:   'https://meet.jit.si/psng-boardroom-z3w8v1',
  ops:         'https://meet.jit.si/psng-operations-j6n1t9',
  random:      'https://meet.jit.si/psng-random-h5b9s4',
};

const REACTIONS = ['👍','❤️','😂','🔥','👏','✅','💡','⚡'];

type User = { name: string; role: string; color: string; token: string };
type Message = {
  id: number; room_id: string;
  author_name: string; author_role: string; author_color: string;
  message: string; message_type: string; audio_url: string | null;
  reactions: Record<string, string[]> | null;
  pinned: boolean;
  created_at: string;
};

export default function BoardroomPage() {
  const [screen, setScreen]           = useState<'login'|'app'>('login');
  const [tokenInput, setTokenInput]   = useState('');
  const [tokenError, setTokenError]   = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser]               = useState<User|null>(null);

  // rooms & messages
  const [activeRoom, setActiveRoom]   = useState('general');
  const [messages, setMessages]       = useState<Message[]>([]);
  const [unread, setUnread]           = useState<Record<string,number>>({});
  const [pinned, setPinned]           = useState<Message[]>([]);
  const [showPinned, setShowPinned]   = useState(false);

  // input
  const [input, setInput]             = useState('');
  const [sending, setSending]         = useState(false);
  const [typing, setTyping]           = useState<string[]>([]);
  const typingTimeoutRef              = useRef<ReturnType<typeof setTimeout>|null>(null);

  // search
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // panel
  const [panel, setPanel]             = useState<'chat'|'settings'>('chat');

  // voice recording
  const [recording, setRecording]     = useState(false);
  const [recordSecs, setRecordSecs]   = useState(0);
  const [uploading, setUploading]     = useState(false);
  const mediaRecorderRef              = useRef<MediaRecorder|null>(null);
  const audioChunksRef                = useRef<Blob[]>([]);
  const recordTimerRef                = useRef<ReturnType<typeof setInterval>|null>(null);

  // call state
  const [callActive, setCallActive]   = useState(false);
  const [callMode, setCallMode]       = useState<'audio'|'video'|null>(null);

  // message interactions
  const [menuMsgId, setMenuMsgId]     = useState<number|null>(null);
  const [reactionMsgId, setReactionMsgId] = useState<number|null>(null);
  const [editingId, setEditingId]     = useState<number|null>(null);
  const [editText, setEditText]       = useState('');
  const [hoveredMsg, setHoveredMsg]   = useState<number|null>(null);
  const menuRef                       = useRef<HTMLDivElement|null>(null);

  // settings
  const [notifSound, setNotifSound]   = useState(true);
  const [compactMode, setCompact]     = useState(false);
  const [showTs, setShowTs]           = useState(true);
  const [theme, setTheme]             = useState<'dark'|'darker'>('dark');

  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const audioRef    = useRef<HTMLAudioElement|null>(null);

  const BG  = theme === 'darker' ? '#020305' : '#050709';
  const BG2 = theme === 'darker' ? '#060810' : '#080C12';
  const BG3 = theme === 'darker' ? '#080C14' : '#0C1220';

  // ── Notification sound ─────────────────────────────────────
  const playNotif = useCallback(() => {
    if (!notifSound) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880; gain.gain.value = 0.1;
      osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, [notifSound]);

  // ── Load messages ─────────────────────────────────────────
  const loadMessages = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from('boardroom_messages').select('*')
      .eq('room_id', roomId).order('created_at', { ascending: true }).limit(150);
    setMessages(data || []);
    setPinned((data || []).filter((m: Message) => m.pinned));
  }, []);

  useEffect(() => {
    if (screen !== 'app') return;
    loadMessages(activeRoom);
    setUnread(u => ({ ...u, [activeRoom]: 0 }));
  }, [activeRoom, screen, loadMessages]);

  // ── Realtime ──────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'app') return;
    const ch = supabase.channel(`room-${activeRoom}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'boardroom_messages',
        filter: `room_id=eq.${activeRoom}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const msg = payload.new as Message;
          setMessages(p => [...p, msg]);
          if (msg.author_name !== user?.name) playNotif();
          setPinned(p => msg.pinned ? [...p, msg] : p);
        }
        if (payload.eventType === 'UPDATE') {
          const msg = payload.new as Message;
          setMessages(p => p.map(m => m.id === msg.id ? msg : m));
          setPinned(p => msg.pinned
            ? p.find(m => m.id === msg.id) ? p.map(m => m.id === msg.id ? msg : m) : [...p, msg]
            : p.filter(m => m.id !== msg.id));
        }
        if (payload.eventType === 'DELETE') {
          setMessages(p => p.filter(m => m.id !== (payload.old as Message).id));
          setPinned(p => p.filter(m => m.id !== (payload.old as Message).id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeRoom, screen, user, playNotif]);

  // ── Typing indicator via broadcast ────────────────────────
  useEffect(() => {
    if (screen !== 'app') return;
    const ch = supabase.channel(`typing-${activeRoom}`)
      .on('broadcast', { event: 'typing' }, ({ payload }: any) => {
        if (payload.name === user?.name) return;
        setTyping(p => p.includes(payload.name) ? p : [...p, payload.name]);
        setTimeout(() => setTyping(p => p.filter(n => n !== payload.name)), 3000);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeRoom, screen, user]);

  const broadcastTyping = useCallback(() => {
    if (!user) return;
    supabase.channel(`typing-${activeRoom}`).send({ type: 'broadcast', event: 'typing', payload: { name: user.name } });
  }, [activeRoom, user]);

  const handleInputChange = (val: string) => {
    setInput(val);
    broadcastTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping([]), 3000);
  };

  // ── Scroll to bottom ──────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Close menus on outside click ──────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuMsgId(null); setReactionMsgId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Auth ──────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!tokenInput.trim()) return;
    setAuthLoading(true); setTokenError('');
    try {
      const res  = await fetch('/api/boardroom/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token: tokenInput }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user); setScreen('app');
    } catch (err: any) { setTokenError(err.message || 'Invalid token'); }
    finally { setAuthLoading(false); }
  };

  // ── Send text ─────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const text = input.trim(); setInput('');
    await supabase.from('boardroom_messages').insert({
      room_id: activeRoom, author_name: user.name, author_role: user.role,
      author_color: user.color, message: text, message_type: 'text',
      audio_url: null, reactions: {}, pinned: false,
    });
    setSending(false); inputRef.current?.focus();
  };

  // ── Edit ──────────────────────────────────────────────────
  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;
    await supabase.from('boardroom_messages').update({ message: editText.trim() + ' ✎' }).eq('id', id);
    setEditingId(null); setEditText('');
  };

  // ── Delete ────────────────────────────────────────────────
  const deleteForMe  = (id: number) => { setMessages(p => p.filter(m => m.id !== id)); setMenuMsgId(null); };
  const deleteForAll = async (id: number) => { await supabase.from('boardroom_messages').delete().eq('id', id); setMenuMsgId(null); };

  // ── Pin ───────────────────────────────────────────────────
  const togglePin = async (msg: Message) => {
    await supabase.from('boardroom_messages').update({ pinned: !msg.pinned }).eq('id', msg.id);
    setMenuMsgId(null);
  };

  // ── Reactions ─────────────────────────────────────────────
  const addReaction = async (msg: Message, emoji: string) => {
    const existing = msg.reactions || {};
    const users    = existing[emoji] || [];
    const updated  = users.includes(user!.name)
      ? { ...existing, [emoji]: users.filter((n: string) => n !== user!.name) }
      : { ...existing, [emoji]: [...users, user!.name] };
    // Remove empty
    Object.keys(updated).forEach(k => { if (updated[k].length === 0) delete updated[k]; });
    await supabase.from('boardroom_messages').update({ reactions: updated }).eq('id', msg.id);
    setReactionMsgId(null);
  };

  // ── Voice recording (FIXED) ───────────────────────────────
  const startRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mr;
      audioChunksRef.current   = [];
      // timeslice=100ms ensures chunks are collected continuously
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start(100);
      setRecording(true); setRecordSecs(0);
      recordTimerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    } catch (err) {
      alert('Microphone access denied. Please allow microphone access in your browser and try again.');
    }
  };

  const stopRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!mediaRecorderRef.current || !user || mediaRecorderRef.current.state === 'inactive') return;
    const mr = mediaRecorderRef.current;
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setRecording(false); setRecordSecs(0);

    await new Promise<void>(resolve => {
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        if (blob.size < 100) { resolve(); return; } // too small, ignore
        setUploading(true);
        const filename = `${activeRoom}/${Date.now()}-${user.token}.webm`;
        const { data, error } = await supabase.storage.from('voice-messages')
          .upload(filename, blob, { contentType: 'audio/webm' });
        if (!error && data) {
          const { data: urlData } = supabase.storage.from('voice-messages').getPublicUrl(data.path);
          await supabase.from('boardroom_messages').insert({
            room_id: activeRoom, author_name: user.name, author_role: user.role,
            author_color: user.color, message: '🎤 Voice message',
            message_type: 'audio', audio_url: urlData.publicUrl,
            reactions: {}, pinned: false,
          });
        }
        setUploading(false);
        mr.stream.getTracks().forEach(t => t.stop());
        resolve();
      };
      mr.stop();
    });
  };

  // ── Call (opens in new tab — works on any network) ────────
  const startCall = (mode: 'audio'|'video') => {
    const url = CALL_URLS[activeRoom] + (mode === 'audio' ? '#config.startWithVideoMuted=true' : '');
    window.open(url, '_blank', 'width=1100,height=700,toolbar=0,menubar=0');
    setCallActive(true); setCallMode(mode);
    // Auto-reset indicator after 3 hours
    setTimeout(() => { setCallActive(false); setCallMode(null); }, 3 * 60 * 60 * 1000);
  };

  const endCall = () => { setCallActive(false); setCallMode(null); };

  // ── Helpers ───────────────────────────────────────────────
  const fmt     = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  const fmtDate = (iso: string) => {
    const d = new Date(iso); const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
  };
  const fmtSec  = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const currentRoom = ROOMS.find(r => r.id === activeRoom);
  const filteredMsgs = searchQuery.trim()
    ? messages.filter(m => m.message.toLowerCase().includes(searchQuery.toLowerCase()) || m.author_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // Group messages by date
  const msgGroups: { date: string; msgs: Message[] }[] = [];
  filteredMsgs.forEach(msg => {
    const date = fmtDate(msg.created_at);
    const last = msgGroups[msgGroups.length - 1];
    if (!last || last.date !== date) msgGroups.push({ date, msgs: [msg] });
    else last.msgs.push(msg);
  });

  const inputStyle: React.CSSProperties = {
    background: BG3, border: '1px solid #1A2E48', color: '#E2EAF4',
    padding: '13px 16px', fontSize: 15, fontFamily: 'monospace',
    letterSpacing: '.1em', outline: 'none', boxSizing: 'border-box',
  };

  // ─────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ minHeight:'100vh', background:'#050709', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Grotesk, sans-serif', backgroundImage:'linear-gradient(rgba(0,232,122,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.025) 1px,transparent 1px)', backgroundSize:'60px 60px' }}>
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle,rgba(0,232,122,.06) 0%,transparent 65%)', pointerEvents:'none' }} />
      <div style={{ width:'100%', maxWidth:440, padding:'0 24px', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:56, height:56, background:'#00E87A', color:'#000', fontWeight:900, fontSize:18, marginBottom:16 }}>PS</div>
          <div style={{ color:'#E2EAF4', fontWeight:800, fontSize:22, letterSpacing:'-.02em' }}>ProStack BoardRoom</div>
          <div style={{ color:'#445566', fontSize:11, marginTop:6, fontFamily:'monospace', letterSpacing:'.14em' }}>STAFF ACCESS ONLY · v2.0</div>
        </div>
        <div style={{ background:'#0C1220', border:'1px solid #111D2E', padding:'44px 40px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#00E87A,#00C8FF,#A78BFA,transparent)' }} />
          <div style={{ fontFamily:'monospace', color:'#445566', fontSize:10, letterSpacing:'.15em', marginBottom:8 }}>STAFF ACCESS TOKEN</div>
          <div style={{ color:'#E2EAF4', fontWeight:700, fontSize:18, marginBottom:6 }}>Enter your token</div>
          <div style={{ color:'#8899AA', fontSize:13, lineHeight:1.7, marginBottom:28 }}>Each ProStack NG staff member has a unique access token. Contact your administrator if you don't have one.</div>
          <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLogin()} placeholder="PSN-XXX-000" autoFocus style={{ ...inputStyle, width:'100%', marginBottom:8 }} />
          {tokenError && <div style={{ color:'#FF5757', fontSize:12, fontFamily:'monospace', marginBottom:12 }}>⚠ {tokenError}</div>}
          <button onClick={handleLogin} disabled={authLoading} style={{ width:'100%', background:'#00E87A', color:'#000', border:'none', padding:'15px 0', fontWeight:700, fontSize:13, letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer', marginTop:4, fontFamily:'Space Grotesk, sans-serif' }}>
            {authLoading ? 'Verifying…' : 'Enter BoardRoom →'}
          </button>
          <div style={{ marginTop:28, paddingTop:20, borderTop:'1px solid #111D2E', display:'flex', justifyContent:'center', gap:24 }}>
            {[{ icon:'💬', label:'Real-time chat' },{ icon:'🎤', label:'Voice notes' },{ icon:'📞', label:'HD calls' }].map(f => (
              <div key={f.label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{f.icon}</div>
                <div style={{ fontFamily:'monospace', color:'#2A4060', fontSize:9, letterSpacing:'.08em' }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // APP
  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100vh', display:'flex', background:BG, fontFamily:'Space Grotesk, sans-serif', overflow:'hidden' }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <div style={{ width:228, background:BG2, borderRight:'1px solid #111D2E', display:'flex', flexDirection:'column', flexShrink:0 }}>

        {/* Workspace header */}
        <div style={{ padding:'14px 16px 12px', borderBottom:'1px solid #111D2E' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, background:'#00E87A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:12, color:'#000', flexShrink:0 }}>PS</div>
            <div style={{ flex:1 }}>
              <div style={{ color:'#E2EAF4', fontWeight:700, fontSize:13 }}>ProStack NG</div>
              <div style={{ color:'#00E87A', fontSize:9, fontFamily:'monospace', letterSpacing:'.08em' }}>● WORKSPACE</div>
            </div>
          </div>
        </div>

        {/* Call status banner */}
        {callActive && (
          <div style={{ margin:'8px 10px 0', background:'rgba(0,232,122,.08)', border:'1px solid rgba(0,232,122,.2)', padding:'8px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ color:'#00E87A', fontSize:10, fontFamily:'monospace', letterSpacing:'.08em' }}>● {callMode?.toUpperCase()} CALL ACTIVE</div>
              <div style={{ color:'#445566', fontSize:10, marginTop:2 }}>#{currentRoom?.name}</div>
            </div>
            <button onClick={endCall} style={{ background:'#FF5757', border:'none', color:'#fff', padding:'3px 8px', fontSize:10, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>End</button>
          </div>
        )}

        {/* Channels */}
        <div style={{ flex:1, overflow:'auto', padding:'12px 0' }}>
          <div style={{ padding:'4px 16px 6px', fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em' }}>CHANNELS</div>
          {ROOMS.map(room => (
            <button key={room.id} onClick={() => { setActiveRoom(room.id); setPanel('chat'); setSearchOpen(false); }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 14px', background: activeRoom===room.id ? 'rgba(0,232,122,.08)' : 'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft: activeRoom===room.id ? '2px solid #00E87A' : '2px solid transparent', fontFamily:'Space Grotesk, sans-serif' }}>
              <span style={{ color: activeRoom===room.id ? '#00E87A' : '#445566', fontSize:13 }}>{room.icon}</span>
              <span style={{ color: activeRoom===room.id ? '#E2EAF4' : '#8899AA', fontSize:13, fontWeight: activeRoom===room.id ? 600 : 400, flex:1 }}>{room.name}</span>
              {(unread[room.id]||0) > 0 && room.id !== activeRoom && (
                <span style={{ background:'#00E87A', color:'#000', fontSize:9, fontWeight:800, padding:'1px 6px', borderRadius:8, fontFamily:'monospace' }}>{unread[room.id]}</span>
              )}
            </button>
          ))}

          {/* Pinned */}
          {pinned.length > 0 && (
            <div style={{ marginTop:12 }}>
              <div style={{ padding:'4px 16px 6px', fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em' }}>PINNED · {pinned.length}</div>
              <button onClick={() => setShowPinned(!showPinned)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 14px', background: showPinned ? 'rgba(245,181,48,.06)' : 'transparent', border:'none', cursor:'pointer', borderLeft: showPinned ? '2px solid #F5B530' : '2px solid transparent', fontFamily:'Space Grotesk, sans-serif' }}>
                <span style={{ color:'#F5B530', fontSize:13 }}>📌</span>
                <span style={{ color:'#8899AA', fontSize:13 }}>Pinned Messages</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ borderTop:'1px solid #111D2E' }}>
          <button onClick={() => setPanel(p => p==='settings' ? 'chat' : 'settings')}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 14px', background: panel==='settings' ? 'rgba(0,232,122,.06)' : 'transparent', border:'none', cursor:'pointer', borderLeft: panel==='settings' ? '2px solid #00E87A' : '2px solid transparent', fontFamily:'Space Grotesk, sans-serif' }}>
            <span style={{ fontSize:14, color: panel==='settings' ? '#00E87A' : '#445566' }}>⚙</span>
            <span style={{ color: panel==='settings' ? '#E2EAF4' : '#8899AA', fontSize:13 }}>Settings</span>
          </button>

          {/* User profile */}
          <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10, borderTop:'1px solid #111D2E' }}>
            <div style={{ position:'relative' }}>
              <div style={{ width:32, height:32, background:user!.color+'20', border:`1.5px solid ${user!.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:user!.color, fontSize:11, flexShrink:0 }}>
                {user!.name.split(' ').map((n:string)=>n[0]).join('')}
              </div>
              <div style={{ position:'absolute', bottom:-2, right:-2, width:9, height:9, background:'#00E87A', border:`2px solid ${BG2}`, borderRadius:'50%' }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:'#E2EAF4', fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user!.name}</div>
              <div style={{ color:'#445566', fontSize:10, fontFamily:'monospace' }}>{user!.role}</div>
            </div>
            <button onClick={() => { setScreen('login'); setUser(null); setCallActive(false); }} style={{ background:'none', border:'none', color:'#445566', cursor:'pointer', fontSize:15, padding:4 }} title="Sign out">⎋</button>
          </div>
        </div>
      </div>

      {/* ══ MAIN AREA ════════════════════════════════════════ */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* ── HEADER ── */}
        <div style={{ padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #111D2E', background:BG2, flexShrink:0, gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
            <span style={{ color:'#00E87A', fontSize:16, flexShrink:0 }}>{currentRoom?.icon}</span>
            <span style={{ color:'#E2EAF4', fontWeight:700, fontSize:14, flexShrink:0 }}>{currentRoom?.name}</span>
            <span style={{ color:'#445566', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentRoom?.desc}</span>
          </div>

          {/* Header actions */}
          <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
            {/* Search toggle */}
            <button onClick={() => setSearchOpen(s => !s)}
              style={{ background: searchOpen ? 'rgba(0,232,122,.1)' : BG3, border:`1px solid ${searchOpen ? '#00E87A' : '#1A2E48'}`, color: searchOpen ? '#00E87A' : '#8899AA', padding:'6px 12px', cursor:'pointer', fontSize:13, fontFamily:'Space Grotesk, sans-serif' }}
              title="Search messages">🔍</button>

            {/* Call buttons */}
            <button onClick={() => startCall('audio')}
              style={{ background:BG3, border:'1px solid #1A2E48', color:'#00E87A', padding:'6px 13px', cursor:'pointer', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', gap:6, fontFamily:'Space Grotesk, sans-serif' }}>
              🎙 Audio
            </button>
            <button onClick={() => startCall('video')}
              style={{ background:'#00E87A', color:'#000', border:'none', padding:'7px 14px', cursor:'pointer', fontWeight:700, fontSize:12, display:'flex', alignItems:'center', gap:6, fontFamily:'Space Grotesk, sans-serif' }}>
              📹 Video
            </button>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        {searchOpen && (
          <div style={{ padding:'10px 20px', borderBottom:'1px solid #111D2E', background:BG2, display:'flex', gap:10, alignItems:'center' }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search messages in this channel…" autoFocus
              style={{ flex:1, background:BG3, border:'1px solid #1A2E48', color:'#E2EAF4', padding:'9px 14px', fontSize:13, outline:'none', fontFamily:'Space Grotesk, sans-serif' }} />
            {searchQuery && <span style={{ fontFamily:'monospace', color:'#445566', fontSize:11 }}>{filteredMsgs.length} result{filteredMsgs.length!==1?'s':''}</span>}
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background:'none', border:'none', color:'#445566', cursor:'pointer', fontSize:18, padding:'0 4px' }}>×</button>
          </div>
        )}

        {/* ══ SETTINGS PANEL ══════════════════════════════════ */}
        {panel === 'settings' ? (
          <div style={{ flex:1, overflow:'auto', padding:'28px 32px', background:BG }}>
            <div style={{ maxWidth:580 }}>
              <div style={{ fontFamily:'monospace', color:'#00E87A', fontSize:10, letterSpacing:'.15em', marginBottom:6 }}>WORKSPACE SETTINGS</div>
              <h2 style={{ color:'#E2EAF4', fontWeight:800, fontSize:22, marginBottom:2, margin:'0 0 4px' }}>Settings</h2>
              <div style={{ color:'#445566', fontSize:13, marginBottom:28 }}>Manage your BoardRoom preferences and profile</div>

              {/* Profile */}
              <div style={{ background:BG2, border:'1px solid #111D2E', padding:24, marginBottom:14, position:'relative' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#00E87A,#00C8FF,transparent)' }} />
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>YOUR PROFILE</div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:54, height:54, background:user!.color+'20', border:`2px solid ${user!.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:user!.color, fontSize:20, position:'relative' }}>
                    {user!.name.split(' ').map((n:string)=>n[0]).join('')}
                    <div style={{ position:'absolute', bottom:-2, right:-2, width:12, height:12, background:'#00E87A', border:`2px solid ${BG2}`, borderRadius:'50%' }} />
                  </div>
                  <div>
                    <div style={{ color:'#E2EAF4', fontWeight:700, fontSize:16 }}>{user!.name}</div>
                    <div style={{ color:user!.color, fontFamily:'monospace', fontSize:11, marginTop:2 }}>{user!.role}</div>
                    <div style={{ color:'#2A4060', fontFamily:'monospace', fontSize:10, marginTop:4 }}>Token: {user!.token}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                      <div style={{ width:7, height:7, background:'#00E87A', borderRadius:'50%' }} />
                      <span style={{ color:'#00E87A', fontSize:11 }}>Active now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div style={{ background:BG2, border:'1px solid #111D2E', padding:24, marginBottom:14 }}>
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>PREFERENCES</div>
                {[
                  { label:'Notification sounds', desc:'Play a tone when a new message arrives', val:notifSound, set:setNotifSound },
                  { label:'Compact message view', desc:'Reduce spacing between messages', val:compactMode, set:setCompact },
                  { label:'Show timestamps', desc:'Display time next to every message', val:showTs, set:setShowTs },
                ].map((item, idx, arr) => (
                  <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 0', borderBottom: idx<arr.length-1 ? '1px solid #0D1525' : 'none' }}>
                    <div>
                      <div style={{ color:'#E2EAF4', fontSize:14, fontWeight:600 }}>{item.label}</div>
                      <div style={{ color:'#445566', fontSize:12, marginTop:2 }}>{item.desc}</div>
                    </div>
                    <button onClick={() => item.set(!item.val)}
                      style={{ width:44, height:24, background: item.val ? '#00E87A' : '#111D2E', borderRadius:12, position:'relative', border:'none', cursor:'pointer', flexShrink:0, transition:'background .2s' }}>
                      <div style={{ position:'absolute', top:3, left: item.val ? 23 : 3, width:18, height:18, background: item.val ? '#000' : '#445566', borderRadius:'50%', transition:'left .2s' }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Theme */}
              <div style={{ background:BG2, border:'1px solid #111D2E', padding:24, marginBottom:14 }}>
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>APPEARANCE</div>
                <div style={{ display:'flex', gap:12 }}>
                  {(['dark','darker'] as const).map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      style={{ flex:1, padding:'14px 12px', background: t==='dark' ? '#080C12' : '#020305', border:`2px solid ${theme===t ? '#00E87A' : '#1A2E48'}`, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>
                      <div style={{ color: theme===t ? '#00E87A' : '#445566', fontSize:13, fontWeight:600, textTransform:'capitalize' }}>{t}</div>
                      <div style={{ color:'#2A4060', fontSize:11, marginTop:4 }}>{t==='dark' ? 'Default theme' : 'Extra dark'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels overview */}
              <div style={{ background:BG2, border:'1px solid #111D2E', padding:24, marginBottom:14 }}>
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>CHANNELS ({ROOMS.length})</div>
                {ROOMS.map((room, idx, arr) => (
                  <div key={room.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 0', borderBottom: idx<arr.length-1 ? '1px solid #0D1525' : 'none' }}>
                    <span style={{ color:'#00E87A', fontSize:16 }}>{room.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:'#E2EAF4', fontSize:13, fontWeight:600 }}>{room.name}</div>
                      <div style={{ color:'#445566', fontSize:12 }}>{room.desc}</div>
                    </div>
                    <button onClick={() => { setActiveRoom(room.id); setPanel('chat'); }}
                      style={{ background:BG3, border:'1px solid #1A2E48', color:'#8899AA', padding:'5px 12px', fontSize:11, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>
                      Open
                    </button>
                  </div>
                ))}
              </div>

              {/* Keyboard shortcuts */}
              <div style={{ background:BG2, border:'1px solid #111D2E', padding:24, marginBottom:14 }}>
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>KEYBOARD SHORTCUTS</div>
                {[
                  ['Enter', 'Send message'],
                  ['Hold 🎤 button', 'Record voice note'],
                  ['Click ✎', 'Edit your message'],
                  ['Click ⋯', 'Message options'],
                  ['Click 😊', 'Add reaction'],
                  ['🔍 button', 'Search messages'],
                ].map(([key, action]) => (
                  <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #0D1525' }}>
                    <span style={{ color:'#445566', fontSize:12 }}>{action}</span>
                    <span style={{ background:'#111D2E', color:'#8899AA', fontFamily:'monospace', fontSize:11, padding:'2px 8px' }}>{key}</span>
                  </div>
                ))}
              </div>

              {/* Sign out */}
              <div style={{ background:BG2, border:'1px solid #2A1515', padding:24 }}>
                <div style={{ fontFamily:'monospace', color:'#FF5757', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>ACCOUNT</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ color:'#E2EAF4', fontSize:14, fontWeight:600 }}>Sign out</div>
                    <div style={{ color:'#445566', fontSize:12, marginTop:2 }}>You'll need your token to sign back in</div>
                  </div>
                  <button onClick={() => { setScreen('login'); setUser(null); setCallActive(false); }}
                    style={{ background:'rgba(255,87,87,.1)', border:'1px solid #FF5757', color:'#FF5757', padding:'8px 20px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ══ CHAT PANEL ════════════════════════════════════ */
          <>
            {/* Pinned messages */}
            {showPinned && pinned.length > 0 && (
              <div style={{ borderBottom:'1px solid #111D2E', background:'rgba(245,181,48,.04)', padding:'10px 20px', maxHeight:160, overflow:'auto' }}>
                <div style={{ fontFamily:'monospace', color:'#F5B530', fontSize:9, letterSpacing:'.12em', marginBottom:8 }}>📌 PINNED MESSAGES</div>
                {pinned.map(msg => (
                  <div key={msg.id} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:6 }}>
                    <div style={{ width:6, height:6, background:'#F5B530', borderRadius:'50%', marginTop:6, flexShrink:0 }} />
                    <div>
                      <span style={{ color:'#F5B530', fontSize:11, fontWeight:600 }}>{msg.author_name}: </span>
                      <span style={{ color:'#8899AA', fontSize:12 }}>{msg.message.slice(0,80)}{msg.message.length>80?'…':''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Messages area */}
            <div style={{ flex:1, overflow:'auto', padding:'12px 16px', display:'flex', flexDirection:'column' }}>
              {filteredMsgs.length === 0 && (
                <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#2A4060', textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>{currentRoom?.icon}</div>
                  <div style={{ fontWeight:700, fontSize:15, color:'#445566', marginBottom:4 }}>#{currentRoom?.name}</div>
                  <div style={{ fontSize:13 }}>{searchQuery ? 'No messages match your search.' : 'No messages yet. Start the conversation.'}</div>
                </div>
              )}

              {msgGroups.map(group => (
                <div key={group.date}>
                  {/* Date divider */}
                  <div style={{ display:'flex', alignItems:'center', gap:12, margin:'16px 0 12px' }}>
                    <div style={{ flex:1, height:1, background:'#111D2E' }} />
                    <span style={{ fontFamily:'monospace', color:'#2A4060', fontSize:9, letterSpacing:'.1em', whiteSpace:'nowrap' }}>{group.date}</span>
                    <div style={{ flex:1, height:1, background:'#111D2E' }} />
                  </div>

                  {group.msgs.map((msg, i) => {
                    const showHeader = i === 0 || group.msgs[i-1].author_name !== msg.author_name;
                    const isOwn      = msg.author_name === user?.name;
                    const reactions  = msg.reactions || {};
                    const hasReactions = Object.keys(reactions).length > 0;

                    return (
                      <div key={msg.id}
                        onMouseEnter={() => setHoveredMsg(msg.id)}
                        onMouseLeave={() => setHoveredMsg(null)}
                        style={{ display:'flex', gap:10, marginTop: showHeader ? (compactMode ? 6 : 14) : (compactMode ? 1 : 2), position:'relative', padding:'2px 6px 2px 4px', background: hoveredMsg===msg.id ? 'rgba(255,255,255,.018)' : msg.pinned ? 'rgba(245,181,48,.03)' : 'transparent' }}>

                        {showHeader
                          ? <div style={{ width:34, height:34, background:msg.author_color+'20', border:`1.5px solid ${msg.author_color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:msg.author_color, fontSize:11, flexShrink:0, marginTop:2 }}>
                              {msg.author_name.split(' ').map((n:string)=>n[0]).join('')}
                            </div>
                          : <div style={{ width:34, flexShrink:0 }} />
                        }

                        <div style={{ flex:1, minWidth:0 }}>
                          {showHeader && (
                            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:3 }}>
                              <span style={{ color:msg.author_color, fontWeight:700, fontSize:13 }}>{msg.author_name}</span>
                              <span style={{ fontFamily:'monospace', color:'#2A4060', fontSize:9 }}>{msg.author_role}</span>
                              {showTs && <span style={{ fontFamily:'monospace', color:'#2A4060', fontSize:9 }}>{fmt(msg.created_at)}</span>}
                              {msg.pinned && <span style={{ color:'#F5B530', fontSize:10 }}>📌</span>}
                            </div>
                          )}

                          {/* Editing state */}
                          {editingId === msg.id ? (
                            <div style={{ display:'flex', gap:8, marginTop:4 }}>
                              <input value={editText} onChange={e => setEditText(e.target.value)}
                                onKeyDown={e => { if(e.key==='Enter') saveEdit(msg.id); if(e.key==='Escape'){setEditingId(null);setEditText('');} }}
                                autoFocus style={{ flex:1, background:BG3, border:'1px solid #00E87A', color:'#E2EAF4', padding:'8px 12px', fontSize:14, outline:'none', fontFamily:'Space Grotesk, sans-serif' }} />
                              <button onClick={() => saveEdit(msg.id)} style={{ background:'#00E87A', color:'#000', border:'none', padding:'8px 14px', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>Save</button>
                              <button onClick={() => {setEditingId(null);setEditText('');}} style={{ background:'#111D2E', color:'#8899AA', border:'none', padding:'8px 12px', fontSize:12, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>Cancel</button>
                            </div>
                          ) : msg.message_type === 'audio' && msg.audio_url ? (
                            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:BG3, border:'1px solid #1A2E48', padding:'10px 14px', maxWidth:300, marginTop:2 }}>
                              <span style={{ color:'#00E87A', fontSize:16, flexShrink:0 }}>🎤</span>
                              <audio controls src={msg.audio_url} style={{ height:32, minWidth:180 }} />
                            </div>
                          ) : (
                            <div style={{ color:'#C8D8E8', fontSize:14, lineHeight:1.65, wordBreak:'break-word' }}>{msg.message}</div>
                          )}

                          {/* Reactions display */}
                          {hasReactions && (
                            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
                              {Object.entries(reactions).map(([emoji, users]: [string, any]) => (
                                users.length > 0 && (
                                  <button key={emoji} onClick={() => addReaction(msg, emoji)} title={users.join(', ')}
                                    style={{ background: users.includes(user?.name) ? 'rgba(0,232,122,.15)' : 'rgba(255,255,255,.05)', border:`1px solid ${users.includes(user?.name) ? 'rgba(0,232,122,.4)' : '#1A2E48'}`, color:'#E2EAF4', padding:'3px 8px', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:'Space Grotesk, sans-serif' }}>
                                    {emoji} <span style={{ fontSize:11, color:'#8899AA' }}>{users.length}</span>
                                  </button>
                                )
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Hover action bar */}
                        {hoveredMsg === msg.id && editingId !== msg.id && (
                          <div ref={menuRef} style={{ position:'absolute', right:8, top:0, display:'flex', gap:3, alignItems:'center', background:BG2, border:'1px solid #1A2E48', padding:'3px 4px', zIndex:20 }}>

                            {/* React */}
                            <div style={{ position:'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setReactionMsgId(reactionMsgId===msg.id ? null : msg.id); setMenuMsgId(null); }}
                                style={{ background:'none', border:'none', color:'#445566', cursor:'pointer', fontSize:14, padding:'4px 6px', lineHeight:1 }} title="Add reaction">😊</button>
                              {reactionMsgId === msg.id && (
                                <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', right:0, bottom:'calc(100% + 4px)', background:BG2, border:'1px solid #1A2E48', padding:'8px', display:'flex', gap:6, flexWrap:'wrap', width:180, zIndex:30, boxShadow:'0 8px 24px rgba(0,0,0,.6)' }}>
                                  {REACTIONS.map(emoji => (
                                    <button key={emoji} onClick={() => addReaction(msg, emoji)}
                                      style={{ background:'none', border:'1px solid #1A2E48', fontSize:18, padding:'4px 6px', cursor:'pointer', transition:'transform .1s' }}
                                      onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.3)')}
                                      onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Edit (own text only) */}
                            {isOwn && msg.message_type==='text' && (
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.message.replace(' ✎','')); setMenuMsgId(null); setReactionMsgId(null); }}
                                style={{ background:'none', border:'none', color:'#445566', cursor:'pointer', fontSize:13, padding:'4px 6px' }} title="Edit message">✎</button>
                            )}

                            {/* More options */}
                            <div style={{ position:'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setMenuMsgId(menuMsgId===msg.id ? null : msg.id); setReactionMsgId(null); }}
                                style={{ background:'none', border:'none', color:'#445566', cursor:'pointer', fontSize:16, padding:'4px 6px', lineHeight:1 }} title="More options">⋯</button>

                              {menuMsgId === msg.id && (
                                <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', right:0, bottom:'calc(100% + 4px)', background:BG2, border:'1px solid #1A2E48', minWidth:200, zIndex:30, boxShadow:'0 8px 32px rgba(0,0,0,.7)' }}>
                                  <div style={{ padding:'4px 0' }}>
                                    <button onClick={() => togglePin(msg)}
                                      style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'none', border:'none', color:'#C8D8E8', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>
                                      <span>📌</span> {msg.pinned ? 'Unpin message' : 'Pin message'}
                                    </button>
                                    <button onClick={() => { navigator.clipboard?.writeText(msg.message); setMenuMsgId(null); }}
                                      style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'none', border:'none', color:'#C8D8E8', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>
                                      <span>📋</span> Copy text
                                    </button>
                                    <div style={{ height:1, background:'#111D2E', margin:'4px 0' }} />
                                    <button onClick={() => deleteForMe(msg.id)}
                                      style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'none', border:'none', color:'#8899AA', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>
                                      <span>🙈</span> Delete for me
                                    </button>
                                    {isOwn && (
                                      <button onClick={() => deleteForAll(msg.id)}
                                        style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'none', border:'none', color:'#FF5757', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' }}>
                                        <span>🗑</span> Delete for everyone
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Typing indicator */}
            {typing.length > 0 && (
              <div style={{ padding:'4px 20px 0', display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ display:'flex', gap:3 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:5, height:5, background:'#445566', borderRadius:'50%', animation:`bounce 1.2s ${i*0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
                <span style={{ color:'#445566', fontSize:12, fontStyle:'italic' }}>
                  {typing.join(', ')} {typing.length===1?'is':'are'} typing…
                </span>
              </div>
            )}

            {/* ── INPUT BAR ── */}
            <div style={{ padding:'10px 16px 12px', borderTop:'1px solid #111D2E', background:BG2, flexShrink:0 }}>
              {uploading && (
                <div style={{ fontFamily:'monospace', color:'#00E87A', fontSize:10, marginBottom:8, letterSpacing:'.08em' }}>⬆ Uploading voice message…</div>
              )}
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>

                {/* Voice button — hold to record */}
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  disabled={uploading}
                  title="Hold to record voice message"
                  style={{ width:40, height:40, background: recording ? '#FF5757' : BG3, border:`1px solid ${recording ? '#FF5757' : '#1A2E48'}`, color: recording ? '#fff' : '#445566', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s', cursor:'pointer', userSelect:'none' }}>
                  🎤
                </button>

                {recording ? (
                  <div style={{ flex:1, background:BG3, border:'1px solid #FF5757', padding:'10px 16px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:8, height:8, background:'#FF5757', borderRadius:'50%', animation:'pulse 1s ease-in-out infinite' }} />
                    <span style={{ color:'#FF5757', fontSize:11, fontFamily:'monospace', letterSpacing:'.1em' }}>REC</span>
                    <span style={{ color:'#E2EAF4', fontSize:14, fontFamily:'monospace' }}>{fmtSec(recordSecs)}</span>
                    <span style={{ color:'#445566', fontSize:12 }}>Release to send</span>
                  </div>
                ) : (
                  <input ref={inputRef} value={input} onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){e.preventDefault(); sendMessage();} }}
                    placeholder={`Message #${currentRoom?.name}…`}
                    style={{ flex:1, background:BG3, border:'1px solid #1A2E48', color:'#E2EAF4', padding:'10px 14px', fontSize:14, outline:'none', fontFamily:'Space Grotesk, sans-serif' }} />
                )}

                <button onClick={sendMessage} disabled={!input.trim() || sending || recording}
                  style={{ width:40, height:40, background: input.trim() && !recording ? '#00E87A' : BG3, border:`1px solid ${input.trim() && !recording ? '#00E87A' : '#111D2E'}`, color: input.trim() && !recording ? '#000' : '#445566', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s', cursor: input.trim() && !recording ? 'pointer' : 'default' }}>
                  →
                </button>
              </div>

              <div style={{ fontFamily:'monospace', color:'#2A4060', fontSize:10, marginTop:7, letterSpacing:'.04em' }}>
                ENTER to send · Hold 🎤 for voice · Hover message for actions
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100%{opacity:1;} 50%{opacity:.3;} }
        @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }
      `}</style>
    </div>
  );
}
