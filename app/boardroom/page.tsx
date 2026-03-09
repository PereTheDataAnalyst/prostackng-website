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
type CallMode = 'audio' | 'video' | null;

const S: Record<string, React.CSSProperties> = {
  btn: { border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' },
};

export default function BoardroomPage() {
  const [screen, setScreen]           = useState<'login'|'app'>('login');
  const [tokenInput, setTokenInput]   = useState('');
  const [tokenError, setTokenError]   = useState('');
  const [loading, setLoading]         = useState(false);
  const [user, setUser]               = useState<User|null>(null);
  const [activeRoom, setActiveRoom]   = useState('general');
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState('');
  const [sending, setSending]         = useState(false);
  const [panel, setPanel]             = useState<'chat'|'settings'>('chat');

  // voice recording
  const [recording, setRecording]     = useState(false);
  const [recordSecs, setRecordSecs]   = useState(0);
  const [uploading, setUploading]     = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const recordTimerRef   = useRef<ReturnType<typeof setInterval>|null>(null);

  // call
  const [callMode, setCallMode]       = useState<CallMode>(null);
  const [callLoading, setCallLoading] = useState(false);
  const jitsiContainerRef             = useRef<HTMLDivElement>(null);
  const jitsiApiRef                   = useRef<any>(null);

  // message actions
  const [hoveredMsg, setHoveredMsg]   = useState<number|null>(null);
  const [editingId, setEditingId]     = useState<number|null>(null);
  const [editText, setEditText]       = useState('');
  const [menuMsgId, setMenuMsgId]     = useState<number|null>(null);

  // settings
  const [notifSound, setNotifSound]   = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [showTimestamps, setShowTs]   = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const editRef   = useRef<HTMLInputElement>(null);

  // ── Load & Realtime ───────────────────────────────────────
  const loadMessages = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from('boardroom_messages').select('*')
      .eq('room_id', roomId).order('created_at', { ascending: true }).limit(100);
    setMessages(data || []);
  }, []);

  useEffect(() => {
    if (screen !== 'app') return;
    loadMessages(activeRoom);
  }, [activeRoom, screen, loadMessages]);

  useEffect(() => {
    if (screen !== 'app') return;
    const ch = supabase.channel(`room-${activeRoom}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boardroom_messages', filter: `room_id=eq.${activeRoom}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setMessages(p => [...p, payload.new as Message]);
          if (payload.eventType === 'UPDATE') setMessages(p => p.map(m => m.id === (payload.new as Message).id ? payload.new as Message : m));
          if (payload.eventType === 'DELETE') setMessages(p => p.filter(m => m.id !== (payload.old as Message).id));
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeRoom, screen]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // close menu on outside click
  useEffect(() => {
    const handler = () => setMenuMsgId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // ── Auth ──────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!tokenInput.trim()) return;
    setLoading(true); setTokenError('');
    try {
      const res  = await fetch('/api/boardroom/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tokenInput }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user); setScreen('app');
    } catch (err: any) { setTokenError(err.message || 'Invalid token'); }
    finally { setLoading(false); }
  };

  // ── Send text ─────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const text = input.trim(); setInput('');
    await supabase.from('boardroom_messages').insert({ room_id: activeRoom, author_name: user.name, author_role: user.role, author_color: user.color, message: text, message_type: 'text', audio_url: null });
    setSending(false); inputRef.current?.focus();
  };

  // ── Edit message ──────────────────────────────────────────
  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;
    await supabase.from('boardroom_messages').update({ message: editText.trim() + ' (edited)' }).eq('id', id);
    setEditingId(null); setEditText('');
  };

  // ── Delete for me (local only) ────────────────────────────
  const deleteForMe = (id: number) => {
    setMessages(p => p.filter(m => m.id !== id));
    setMenuMsgId(null);
  };

  // ── Delete for all ────────────────────────────────────────
  const deleteForAll = async (id: number) => {
    await supabase.from('boardroom_messages').delete().eq('id', id);
    setMenuMsgId(null);
  };

  // ── Voice recording ───────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr; audioChunksRef.current = [];
      mr.ondataavailable = e => audioChunksRef.current.push(e.data);
      mr.start(); setRecording(true); setRecordSecs(0);
      recordTimerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    } catch { alert('Microphone access denied. Please allow microphone in your browser.'); }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !user) return;
    const mr = mediaRecorderRef.current;
    mr.onstop = async () => {
      setUploading(true);
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const filename = `${activeRoom}/${Date.now()}-${user.token}.webm`;
      const { data, error } = await supabase.storage.from('voice-messages').upload(filename, blob, { contentType: 'audio/webm' });
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('voice-messages').getPublicUrl(data.path);
        await supabase.from('boardroom_messages').insert({ room_id: activeRoom, author_name: user.name, author_role: user.role, author_color: user.color, message: '🎤 Voice message', message_type: 'audio', audio_url: urlData.publicUrl });
      }
      setUploading(false);
      mr.stream.getTracks().forEach(t => t.stop());
    };
    mr.stop(); setRecording(false);
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setRecordSecs(0);
  };

  // ── Jitsi call ────────────────────────────────────────────
  const initJitsi = useCallback((mode: CallMode) => {
    if (!user || !jitsiContainerRef.current || !mode) return;
    setCallLoading(true);
    const doInit = () => {
      if (jitsiApiRef.current) { try { jitsiApiRef.current.dispose(); } catch {} }
      try {
        jitsiApiRef.current = new (window as any).JitsiMeetExternalAPI('meet.jit.si', {
          roomName:   JITSI_ROOMS[activeRoom],
          parentNode: jitsiContainerRef.current,
          width:      '100%', height: '100%',
          userInfo:   { displayName: `${user.name} (${user.role})` },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: mode === 'audio',
            enableWelcomePage:   false,
            prejoinPageEnabled:  false,
            disableDeepLinking:  true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: mode === 'audio'
              ? ['microphone', 'hangup', 'raisehand', 'tileview']
              : ['microphone', 'camera', 'hangup', 'chat', 'raisehand', 'tileview', 'fullscreen', 'screensharing'],
          },
        });
        jitsiApiRef.current.addEventListener('videoConferenceJoined', () => setCallLoading(false));
        jitsiApiRef.current.addEventListener('readyToClose', endCall);
      } catch { setCallLoading(false); }
    };
    if (!(window as any).JitsiMeetExternalAPI) {
      const existing = document.getElementById('jitsi-script');
      if (!existing) {
        const script = document.createElement('script');
        script.id = 'jitsi-script'; script.src = 'https://meet.jit.si/external_api.js';
        script.onload = doInit;
        script.onerror = () => { setCallLoading(false); alert('Could not load Jitsi. Check your internet connection.'); };
        document.head.appendChild(script);
      } else { existing.addEventListener('load', doInit); }
    } else { doInit(); }
  }, [user, activeRoom]);

  const startCall = (mode: CallMode) => {
    setCallMode(mode);
  };

  useEffect(() => {
    if (callMode && jitsiContainerRef.current) { initJitsi(callMode); }
  }, [callMode, initJitsi]);

  const endCall = () => {
    try { if (jitsiApiRef.current) { jitsiApiRef.current.dispose(); jitsiApiRef.current = null; } } catch {}
    setCallMode(null); setCallLoading(false);
  };

  // ── Helpers ───────────────────────────────────────────────
  const fmt    = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const fmtSec = (s: number)  => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const currentRoom = ROOMS.find(r => r.id === activeRoom);

  // ─────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────
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
          <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="PSN-XXX-000" autoFocus
            style={{ width:'100%', background:'#080C12', border:`1px solid ${tokenError ? '#FF5757' : '#1A2E48'}`, color:'#E2EAF4', padding:'13px 16px', fontSize:15, fontFamily:'monospace', letterSpacing:'.1em', outline:'none', boxSizing:'border-box', marginBottom:8 }} />
          {tokenError && <div style={{ color:'#FF5757', fontSize:12, fontFamily:'monospace', marginBottom:10 }}>⚠ {tokenError}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{ ...S.btn, width:'100%', background:'#00E87A', color:'#000', padding:'14px 0', fontWeight:700, fontSize:13, letterSpacing:'.08em', textTransform:'uppercase', marginTop:4 }}>
            {loading ? 'Verifying…' : 'Enter BoardRoom →'}
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // APP
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100vh', display:'flex', background:'#050709', fontFamily:'Space Grotesk, sans-serif', overflow:'hidden' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:220, background:'#080C12', borderRight:'1px solid #111D2E', display:'flex', flexDirection:'column', flexShrink:0 }}>
        {/* Workspace */}
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #111D2E', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'#00E87A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:11, color:'#000', flexShrink:0 }}>PS</div>
          <div>
            <div style={{ color:'#E2EAF4', fontWeight:700, fontSize:13 }}>ProStack NG</div>
            <div style={{ color:'#00E87A', fontSize:9, fontFamily:'monospace', letterSpacing:'.08em' }}>● WORKSPACE</div>
          </div>
        </div>

        {/* Channels */}
        <div style={{ flex:1, overflow:'auto', padding:'12px 0' }}>
          <div style={{ padding:'4px 16px 8px', fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em' }}>CHANNELS</div>
          {ROOMS.map(room => (
            <button key={room.id} onClick={() => { setActiveRoom(room.id); endCall(); setPanel('chat'); }}
              style={{ ...S.btn, width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 16px', background: activeRoom === room.id ? 'rgba(0,232,122,.08)' : 'transparent', textAlign:'left', borderLeft: activeRoom === room.id ? '2px solid #00E87A' : '2px solid transparent' }}>
              <span style={{ color: activeRoom === room.id ? '#00E87A' : '#445566', fontSize:13 }}>{room.icon}</span>
              <span style={{ color: activeRoom === room.id ? '#E2EAF4' : '#8899AA', fontSize:13, fontWeight: activeRoom === room.id ? 600 : 400 }}>{room.name}</span>
            </button>
          ))}
        </div>

        {/* Bottom nav */}
        <div style={{ borderTop:'1px solid #111D2E' }}>
          <button onClick={() => setPanel(p => p === 'settings' ? 'chat' : 'settings')}
            style={{ ...S.btn, width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background: panel === 'settings' ? 'rgba(0,232,122,.08)' : 'transparent', borderLeft: panel === 'settings' ? '2px solid #00E87A' : '2px solid transparent' }}>
            <span style={{ fontSize:14 }}>⚙</span>
            <span style={{ color: panel === 'settings' ? '#E2EAF4' : '#8899AA', fontSize:13 }}>Settings</span>
          </button>
          {/* User */}
          <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10, borderTop:'1px solid #111D2E' }}>
            <div style={{ width:30, height:30, background: user!.color + '20', border:`1.5px solid ${user!.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:user!.color, fontSize:11, flexShrink:0 }}>
              {user!.name.split(' ').map((n:string) => n[0]).join('')}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:'#E2EAF4', fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user!.name}</div>
              <div style={{ color:'#445566', fontSize:10, fontFamily:'monospace' }}>{user!.role}</div>
            </div>
            <button onClick={() => { setScreen('login'); setUser(null); endCall(); }}
              style={{ ...S.btn, background:'none', color:'#445566', fontSize:14, padding:4 }} title="Sign out">⎋</button>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Header */}
        <div style={{ padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #111D2E', background:'#080C12', flexShrink:0, gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:'#00E87A', fontSize:16 }}>{currentRoom?.icon}</span>
            <span style={{ color:'#E2EAF4', fontWeight:700, fontSize:14 }}>{currentRoom?.name}</span>
            <span style={{ color:'#445566', fontSize:12, display:'none' }}>{currentRoom?.desc}</span>
          </div>

          {/* Call buttons */}
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {callMode ? (
              <button onClick={endCall}
                style={{ ...S.btn, background:'#FF5757', color:'#fff', padding:'7px 14px', fontWeight:700, fontSize:12, letterSpacing:'.05em', display:'flex', alignItems:'center', gap:6 }}>
                📵 End Call
              </button>
            ) : (
              <>
                <button onClick={() => startCall('audio')}
                  style={{ ...S.btn, background:'#0C1220', border:'1px solid #1A2E48', color:'#00E87A', padding:'7px 14px', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', gap:6 }}>
                  🎙 Audio Call
                </button>
                <button onClick={() => startCall('video')}
                  style={{ ...S.btn, background:'#00E87A', color:'#000', padding:'7px 14px', fontWeight:700, fontSize:12, display:'flex', alignItems:'center', gap:6 }}>
                  📹 Video Call
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── SETTINGS PANEL ── */}
        {panel === 'settings' ? (
          <div style={{ flex:1, overflow:'auto', padding:'32px 36px' }}>
            <div style={{ maxWidth:560 }}>
              <div style={{ fontFamily:'monospace', color:'#00E87A', fontSize:10, letterSpacing:'.15em', marginBottom:6 }}>WORKSPACE SETTINGS</div>
              <h2 style={{ color:'#E2EAF4', fontWeight:800, fontSize:22, marginBottom:2 }}>Settings</h2>
              <div style={{ color:'#445566', fontSize:13, marginBottom:32 }}>Manage your BoardRoom preferences</div>

              {/* Profile */}
              <div style={{ background:'#0C1220', border:'1px solid #111D2E', padding:24, marginBottom:16, position:'relative' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#00E87A,transparent)' }} />
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>YOUR PROFILE</div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:52, height:52, background: user!.color + '20', border:`2px solid ${user!.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:user!.color, fontSize:18 }}>
                    {user!.name.split(' ').map((n:string) => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ color:'#E2EAF4', fontWeight:700, fontSize:16 }}>{user!.name}</div>
                    <div style={{ color:user!.color, fontFamily:'monospace', fontSize:11 }}>{user!.role}</div>
                    <div style={{ color:'#2A4060', fontFamily:'monospace', fontSize:10, marginTop:2 }}>Token: {user!.token}</div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div style={{ background:'#0C1220', border:'1px solid #111D2E', padding:24, marginBottom:16 }}>
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>PREFERENCES</div>
                {[
                  { label:'Notification sounds', desc:'Play a sound when a new message arrives', val:notifSound, set:setNotifSound },
                  { label:'Compact message view', desc:'Reduce spacing between messages', val:compactMode, set:setCompactMode },
                  { label:'Show timestamps', desc:'Show time on every message', val:showTimestamps, set:setShowTs },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid #0D1525' }}>
                    <div>
                      <div style={{ color:'#E2EAF4', fontSize:14, fontWeight:600 }}>{item.label}</div>
                      <div style={{ color:'#445566', fontSize:12, marginTop:2 }}>{item.desc}</div>
                    </div>
                    <button onClick={() => item.set(!item.val)}
                      style={{ ...S.btn, width:44, height:24, background: item.val ? '#00E87A' : '#111D2E', borderRadius:12, position:'relative', flexShrink:0 }}>
                      <div style={{ position:'absolute', top:3, left: item.val ? 23 : 3, width:18, height:18, background: item.val ? '#000' : '#445566', borderRadius:'50%', transition:'left .2s' }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Channels info */}
              <div style={{ background:'#0C1220', border:'1px solid #111D2E', padding:24, marginBottom:16 }}>
                <div style={{ fontFamily:'monospace', color:'#445566', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>CHANNELS</div>
                {ROOMS.map(room => (
                  <div key={room.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #0D1525' }}>
                    <span style={{ color:'#00E87A' }}>{room.icon}</span>
                    <div>
                      <div style={{ color:'#E2EAF4', fontSize:13, fontWeight:600 }}>{room.name}</div>
                      <div style={{ color:'#445566', fontSize:12 }}>{room.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Danger */}
              <div style={{ background:'#0C1220', border:'1px solid #2A1515', padding:24 }}>
                <div style={{ fontFamily:'monospace', color:'#FF5757', fontSize:9, letterSpacing:'.12em', marginBottom:16 }}>ACCOUNT</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ color:'#E2EAF4', fontSize:14, fontWeight:600 }}>Sign out</div>
                    <div style={{ color:'#445566', fontSize:12 }}>You'll need your token to sign back in</div>
                  </div>
                  <button onClick={() => { setScreen('login'); setUser(null); endCall(); }}
                    style={{ ...S.btn, background:'#2A1515', border:'1px solid #FF5757', color:'#FF5757', padding:'8px 18px', fontSize:13, fontWeight:600 }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ── CHAT PANEL ── */
          <>
            {/* Call embed */}
            {callMode && (
              <div style={{ height:400, borderBottom:'1px solid #111D2E', background:'#000', flexShrink:0, position:'relative' }}>
                <div ref={jitsiContainerRef} style={{ width:'100%', height:'100%' }} />
                {callLoading && (
                  <div style={{ position:'absolute', inset:0, background:'#050709', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
                    <div style={{ width:40, height:40, border:'3px solid #111D2E', borderTop:'3px solid #00E87A', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                    <div style={{ fontFamily:'monospace', color:'#00E87A', fontSize:12, letterSpacing:'.1em' }}>
                      CONNECTING {callMode === 'audio' ? 'AUDIO' : 'VIDEO'} CALL…
                    </div>
                    <div style={{ color:'#445566', fontSize:12 }}>Joining #{currentRoom?.name} call room</div>
                  </div>
                )}
                <div style={{ position:'absolute', top:10, left:10, background:'rgba(0,232,122,.12)', border:'1px solid rgba(0,232,122,.3)', padding:'4px 10px', fontFamily:'monospace', color:'#00E87A', fontSize:10, letterSpacing:'.08em', pointerEvents:'none' }}>
                  {callMode === 'audio' ? '🎙' : '📹'} LIVE · #{currentRoom?.name}
                </div>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex:1, overflow:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap: compactMode ? 1 : 2 }}>
              {messages.length === 0 && (
                <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#2A4060', textAlign:'center' }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{currentRoom?.icon}</div>
                  <div style={{ fontWeight:700, fontSize:15, color:'#445566', marginBottom:4 }}>#{currentRoom?.name}</div>
                  <div style={{ fontSize:13 }}>No messages yet. Start the conversation.</div>
                </div>
              )}

              {messages.map((msg, i) => {
                const showHeader  = i === 0 || messages[i-1].author_name !== msg.author_name || compactMode;
                const isOwn       = msg.author_name === user?.name;
                const isMenuOpen  = menuMsgId === msg.id;

                return (
                  <div key={msg.id}
                    onMouseEnter={() => setHoveredMsg(msg.id)}
                    onMouseLeave={() => { setHoveredMsg(null); }}
                    style={{ display:'flex', gap:10, marginTop: showHeader ? (compactMode ? 4 : 12) : 0, position:'relative', padding:'2px 4px', background: isMenuOpen ? 'rgba(0,232,122,.03)' : 'transparent', borderRadius:2 }}>

                    {/* Avatar */}
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
                          {showTimestamps && <span style={{ fontFamily:'monospace', color:'#2A4060', fontSize:9 }}>{fmt(msg.created_at)}</span>}
                        </div>
                      )}

                      {/* Editing */}
                      {editingId === msg.id ? (
                        <div style={{ display:'flex', gap:8 }}>
                          <input ref={editRef} value={editText} onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveEdit(msg.id); if (e.key === 'Escape') { setEditingId(null); setEditText(''); } }}
                            style={{ flex:1, background:'#0C1220', border:'1px solid #00E87A', color:'#E2EAF4', padding:'8px 12px', fontSize:14, outline:'none', fontFamily:'Space Grotesk, sans-serif' }} autoFocus />
                          <button onClick={() => saveEdit(msg.id)} style={{ ...S.btn, background:'#00E87A', color:'#000', padding:'8px 14px', fontWeight:700, fontSize:12 }}>Save</button>
                          <button onClick={() => { setEditingId(null); setEditText(''); }} style={{ ...S.btn, background:'#111D2E', color:'#8899AA', padding:'8px 14px', fontSize:12 }}>Cancel</button>
                        </div>
                      ) : msg.message_type === 'audio' && msg.audio_url ? (
                        <div style={{ display:'flex', alignItems:'center', gap:10, background:'#0C1220', border:'1px solid #111D2E', padding:'10px 14px', maxWidth:300 }}>
                          <span style={{ color:'#00E87A', fontSize:18 }}>🎤</span>
                          <audio controls src={msg.audio_url} style={{ height:32, flex:1, minWidth:0 }} />
                        </div>
                      ) : (
                        <div style={{ color:'#C8D8E8', fontSize:14, lineHeight:1.6, wordBreak:'break-word' }}>{msg.message}</div>
                      )}
                    </div>

                    {/* Hover actions */}
                    {(hoveredMsg === msg.id || isMenuOpen) && editingId !== msg.id && (
                      <div style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', display:'flex', gap:4, alignItems:'center' }}>
                        {isOwn && msg.message_type === 'text' && (
                          <button onClick={() => { setEditingId(msg.id); setEditText(msg.message.replace(' (edited)','')); }}
                            style={{ ...S.btn, background:'#0C1220', border:'1px solid #1A2E48', color:'#8899AA', padding:'4px 10px', fontSize:11, fontWeight:600 }}
                            title="Edit message">✎ Edit</button>
                        )}
                        <div style={{ position:'relative' }}>
                          <button onClick={e => { e.stopPropagation(); setMenuMsgId(isMenuOpen ? null : msg.id); }}
                            style={{ ...S.btn, background:'#0C1220', border:'1px solid #1A2E48', color:'#8899AA', padding:'4px 10px', fontSize:13 }}
                            title="More options">⋯</button>

                          {isMenuOpen && (
                            <div onClick={e => e.stopPropagation()}
                              style={{ position:'absolute', right:0, bottom:'calc(100% + 6px)', background:'#0C1220', border:'1px solid #1A2E48', minWidth:180, zIndex:50, boxShadow:'0 8px 32px rgba(0,0,0,.6)' }}>
                              <div style={{ padding:'6px 0' }}>
                                <button onClick={() => deleteForMe(msg.id)}
                                  style={{ ...S.btn, width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'none', color:'#8899AA', fontSize:13, textAlign:'left' }}>
                                  <span style={{ fontSize:14 }}>🙈</span> Delete for me
                                </button>
                                {isOwn && (
                                  <button onClick={() => deleteForAll(msg.id)}
                                    style={{ ...S.btn, width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'none', color:'#FF5757', fontSize:13, textAlign:'left' }}>
                                    <span style={{ fontSize:14 }}>🗑</span> Delete for everyone
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
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding:'12px 20px', borderTop:'1px solid #111D2E', background:'#080C12', flexShrink:0 }}>
              {uploading && <div style={{ fontFamily:'monospace', color:'#00E87A', fontSize:10, marginBottom:8, letterSpacing:'.08em' }}>⬆ Uploading voice message…</div>}
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  disabled={uploading} title="Hold to record voice message"
                  style={{ ...S.btn, width:42, height:42, background: recording ? '#FF5757' : '#0C1220', border:`1px solid ${recording ? '#FF5757' : '#1A2E48'}`, color: recording ? '#fff' : '#445566', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
                  🎤
                </button>

                {recording ? (
                  <div style={{ flex:1, background:'#0C1220', border:'1px solid #FF5757', padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ color:'#FF5757', fontSize:10, fontFamily:'monospace', letterSpacing:'.1em' }}>● REC</span>
                    <span style={{ color:'#E2EAF4', fontSize:14, fontFamily:'monospace' }}>{fmtSec(recordSecs)}</span>
                    <span style={{ color:'#445566', fontSize:12 }}>Release to send</span>
                  </div>
                ) : (
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={`Message #${currentRoom?.name}…`}
                    style={{ flex:1, background:'#0C1220', border:'1px solid #1A2E48', color:'#E2EAF4', padding:'12px 16px', fontSize:14, outline:'none', fontFamily:'Space Grotesk, sans-serif' }} />
                )}

                <button onClick={sendMessage} disabled={!input.trim() || sending || recording}
                  style={{ ...S.btn, width:42, height:42, background: input.trim() && !recording ? '#00E87A' : '#0C1220', border:`1px solid ${input.trim() && !recording ? '#00E87A' : '#111D2E'}`, color: input.trim() && !recording ? '#000' : '#445566', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
                  →
                </button>
              </div>
              <div style={{ fontFamily:'monospace', color:'#2A4060', fontSize:10, marginTop:6, letterSpacing:'.05em' }}>
                ENTER to send · Hold 🎤 to record voice · Hover message to edit or delete
              </div>
            </div>
          </>
        )}
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
