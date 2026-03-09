'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
];

const ROOMS = [
  { id: 'general',     name: 'General',     icon: '◈', desc: 'Company-wide updates' },
  { id: 'engineering', name: 'Engineering', icon: '⬡', desc: 'Dev team channel' },
  { id: 'boardroom',   name: 'BoardRoom',   icon: '▦', desc: 'Executive meetings' },
  { id: 'ops',         name: 'Operations',  icon: '◎', desc: 'Day-to-day ops' },
  { id: 'random',      name: 'Random',      icon: '⟁', desc: 'Non-work chat' },
];

const REACTIONS = ['👍','❤️','😂','🔥','👏','✅','💡','⚡'];

type User = { name: string; role: string; color: string; token: string; displayName?: string; avatarUrl?: string };
type Message = {
  id: number; room_id: string;
  author_name: string; author_role: string; author_color: string;
  message: string; message_type: string; audio_url: string | null;
  reactions: Record<string, string[]> | null;
  pinned: boolean;
  created_at: string;
};
type Peer = { peerId: string; name: string; color: string; stream: MediaStream | null; audioOnly: boolean };

export default function BoardroomPage() {
  const [screen, setScreen]             = useState<'login'|'app'>('login');
  const [tokenInput, setTokenInput]     = useState('');
  const [tokenError, setTokenError]     = useState('');
  const [authLoading, setAuthLoading]   = useState(false);
  const [user, setUser]                 = useState<User|null>(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [isMobile, setIsMobile]         = useState(false);
  const [activeRoom, setActiveRoom]     = useState('general');
  const [messages, setMessages]         = useState<Message[]>([]);
  const [pinned, setPinned]             = useState<Message[]>([]);
  const [showPinned, setShowPinned]     = useState(false);
  const [input, setInput]               = useState('');
  const [sending, setSending]           = useState(false);
  const [typing, setTyping]             = useState<string[]>([]);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [panel, setPanel]               = useState<'chat'|'settings'>('chat');
  const [hoveredMsg, setHoveredMsg]     = useState<number|null>(null);
  const [menuMsgId, setMenuMsgId]       = useState<number|null>(null);
  const [reactionMsgId, setReactionMsgId] = useState<number|null>(null);
  const [editingId, setEditingId]       = useState<number|null>(null);
  const [editText, setEditText]         = useState('');
  const typingTimerRef                  = useRef<ReturnType<typeof setTimeout>|null>(null);
  const [recording, setRecording]       = useState(false);
  const [recordSecs, setRecordSecs]     = useState(0);
  const [uploading, setUploading]       = useState(false);
  const mediaRecorderRef                = useRef<MediaRecorder|null>(null);
  const audioChunksRef                  = useRef<Blob[]>([]);
  const recordTimerRef                  = useRef<ReturnType<typeof setInterval>|null>(null);
  const [callActive, setCallActive]     = useState(false);
  const [callMode, setCallMode]         = useState<'audio'|'video'|null>(null);
  const [callRoom, setCallRoom]         = useState<string|null>(null);
  const [peers, setPeers]               = useState<Peer[]>([]);
  const [localStream, setLocalStream]   = useState<MediaStream|null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream|null>(null);
  const [muted, setMuted]               = useState(false);
  const [camOff, setCamOff]             = useState(false);
  const [sharing, setSharing]           = useState(false);
  const [incomingCall, setIncomingCall] = useState<{from:string;fromColor:string;mode:'audio'|'video';room:string}|null>(null);
  const pcsRef                          = useRef<Record<string, RTCPeerConnection>>({});
  const localVideoRef                   = useRef<HTMLVideoElement>(null);
  const signalChannelRef                = useRef<any>(null);
  const myPeerId                        = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [notifSound, setNotifSound]     = useState(true);
  const [compactMode, setCompact]       = useState(false);
  const [showTs, setShowTs]             = useState(true);
  const [theme, setTheme]               = useState<'dark'|'darker'>('dark');
  const [profileName, setProfileName]   = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const bottomRef                       = useRef<HTMLDivElement>(null);
  const inputRef                        = useRef<HTMLInputElement>(null);

  const BG  = theme === 'darker' ? '#020305' : '#050709';
  const BG2 = theme === 'darker' ? '#060810' : '#080C12';
  const BG3 = theme === 'darker' ? '#080C14' : '#0C1220';

  // ── Mobile detection ───────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const switchRoom = (roomId: string) => {
    setActiveRoom(roomId);
    setPanel('chat');
    setSearchOpen(false);
    setSidebarOpen(false);
  };

  // ── Audio ──────────────────────────────────────────────
  const playBeep = useCallback((freq = 880) => {
    if (!notifSound) return;
    try {
      const ctx = new AudioContext();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; g.gain.value = 0.08;
      o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.stop(ctx.currentTime + 0.25);
    } catch {}
  }, [notifSound]);

  const playRing = useCallback(() => {
    [0,300,600].forEach(d => setTimeout(() => playBeep(660), d));
  }, [playBeep]);

  // ── Profile ────────────────────────────────────────────
  const loadProfile = useCallback(async (u: User) => {
    const { data } = await supabase.from('staff_profiles').select('*').eq('token', u.token).single();
    if (data) {
      setUser(prev => prev ? { ...prev, displayName: data.display_name, avatarUrl: data.avatar_url } : prev);
      setProfileName(data.display_name || u.name);
    } else {
      setProfileName(u.name);
    }
  }, []);

  // ── Messages ───────────────────────────────────────────
  const loadMessages = useCallback(async (roomId: string) => {
    const { data } = await supabase.from('boardroom_messages').select('*')
      .eq('room_id', roomId).order('created_at', { ascending: true }).limit(150);
    setMessages(data || []);
    setPinned((data || []).filter((m: Message) => m.pinned));
  }, []);

  useEffect(() => {
    if (screen !== 'app') return;
    loadMessages(activeRoom);
  }, [activeRoom, screen, loadMessages]);

  useEffect(() => {
    if (screen !== 'app') return;
    const ch = supabase.channel(`msgs-${activeRoom}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boardroom_messages', filter: `room_id=eq.${activeRoom}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const msg = payload.new as Message;
          setMessages(p => [...p, msg]);
          if (msg.author_name !== (user?.displayName || user?.name)) playBeep();
        }
        if (payload.eventType === 'UPDATE') {
          const msg = payload.new as Message;
          setMessages(p => p.map(m => m.id === msg.id ? msg : m));
          setPinned(p => msg.pinned
            ? p.find(m => m.id === msg.id) ? p.map(m => m.id === msg.id ? msg : m) : [...p, msg]
            : p.filter(m => m.id !== msg.id));
        }
        if (payload.eventType === 'DELETE') {
          setMessages(p => p.filter(m => m.id !== (payload.old as any).id));
          setPinned(p => p.filter(m => m.id !== (payload.old as any).id));
        }
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeRoom, screen, user, playBeep]);

  useEffect(() => {
    if (screen !== 'app') return;
    const ch = supabase.channel(`typing-${activeRoom}`)
      .on('broadcast', { event: 'typing' }, ({ payload }: any) => {
        if (payload.name === (user?.displayName || user?.name)) return;
        setTyping(p => p.includes(payload.name) ? p : [...p, payload.name]);
        setTimeout(() => setTyping(p => p.filter(n => n !== payload.name)), 3000);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeRoom, screen, user]);

  const broadcastTyping = useCallback(() => {
    if (!user) return;
    supabase.channel(`typing-${activeRoom}`).send({ type: 'broadcast', event: 'typing', payload: { name: user.displayName || user.name } });
  }, [activeRoom, user]);

  const handleInputChange = (val: string) => {
    setInput(val); broadcastTyping();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setTyping([]), 3000);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-menu]')) {
        setMenuMsgId(null); setReactionMsgId(null);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── WebRTC ─────────────────────────────────────────────
  const getSignalChannel = useCallback((roomId: string) => {
    if (signalChannelRef.current) return signalChannelRef.current;
    const ch = supabase.channel(`call-signal-${roomId}`, { config: { broadcast: { self: false } } });
    signalChannelRef.current = ch;
    return ch;
  }, []);

  const createPC = useCallback((peerId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcsRef.current[peerId] = pc;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    pc.onicecandidate = ({ candidate }) => {
      if (!candidate) return;
      signalChannelRef.current?.send({ type: 'broadcast', event: 'ice', payload: { to: peerId, from: myPeerId.current, candidate } });
    };
    pc.ontrack = ({ streams }) => {
      setPeers(p => p.map(peer => peer.peerId === peerId ? { ...peer, stream: streams[0] } : peer));
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        setPeers(p => p.filter(peer => peer.peerId !== peerId));
        delete pcsRef.current[peerId];
      }
    };
    return pc;
  }, []);

  const endCall = useCallback(() => {
    if (signalChannelRef.current) {
      signalChannelRef.current.send({ type: 'broadcast', event: 'call_end', payload: { room: callRoom } });
      supabase.removeChannel(signalChannelRef.current);
      signalChannelRef.current = null;
    }
    Object.values(pcsRef.current).forEach(pc => pc.close());
    pcsRef.current = {};
    localStream?.getTracks().forEach(t => t.stop());
    screenStream?.getTracks().forEach(t => t.stop());
    setLocalStream(null); setScreenStream(null);
    setCallActive(false); setCallMode(null); setCallRoom(null);
    setPeers([]); setMuted(false); setCamOff(false); setSharing(false);
  }, [localStream, screenStream, callRoom]);

  const startCall = useCallback(async (mode: 'audio'|'video') => {
    if (!user) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: mode === 'video' ? { width: 1280, height: 720 } : false });
      setLocalStream(stream); setCallActive(true); setCallMode(mode); setCallRoom(activeRoom);
      setTimeout(() => { if (localVideoRef.current) { localVideoRef.current.srcObject = stream; localVideoRef.current.muted = true; localVideoRef.current.play().catch(() => {}); } }, 100);
      const ch = getSignalChannel(activeRoom).subscribe(async (status: string) => {
        if (status !== 'SUBSCRIBED') return;
        ch.send({ type: 'broadcast', event: 'call_invite', payload: { from: user.displayName || user.name, fromColor: user.color, fromId: myPeerId.current, mode, room: activeRoom } });
      });
      signalChannelRef.current = ch;
      ch.on('broadcast', { event: 'call_accept' }, async ({ payload }: any) => {
        if (payload.room !== activeRoom) return;
        const pc = createPC(payload.fromId, stream);
        setPeers(p => [...p.filter(x => x.peerId !== payload.fromId), { peerId: payload.fromId, name: payload.from, color: payload.fromColor, stream: null, audioOnly: mode === 'audio' }]);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ch.send({ type: 'broadcast', event: 'offer', payload: { to: payload.fromId, from: myPeerId.current, offer } });
      });
      ch.on('broadcast', { event: 'answer' }, async ({ payload }: any) => {
        if (payload.to !== myPeerId.current) return;
        const pc = pcsRef.current[payload.from];
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
      });
      ch.on('broadcast', { event: 'ice' }, async ({ payload }: any) => {
        if (payload.to !== myPeerId.current) return;
        const pc = pcsRef.current[payload.from];
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      });
      ch.on('broadcast', { event: 'call_end' }, ({ payload }: any) => { if (payload.room !== activeRoom) return; endCall(); });
    } catch { alert(`Could not access ${mode === 'video' ? 'camera/microphone' : 'microphone'}.`); }
  }, [user, activeRoom, createPC, getSignalChannel, endCall]);

  const acceptCall = useCallback(async () => {
    if (!incomingCall || !user) return;
    const { from, fromColor, mode, room } = incomingCall;
    setIncomingCall(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: mode === 'video' ? { width: 1280, height: 720 } : false });
      setLocalStream(stream); setCallActive(true); setCallMode(mode); setCallRoom(room);
      setTimeout(() => { if (localVideoRef.current) { localVideoRef.current.srcObject = stream; localVideoRef.current.muted = true; localVideoRef.current.play().catch(() => {}); } }, 100);
      const ch = getSignalChannel(room);
      if (!signalChannelRef.current || signalChannelRef.current.state !== 'joined') { ch.subscribe(); signalChannelRef.current = ch; }
      ch.send({ type: 'broadcast', event: 'call_accept', payload: { from: user.displayName || user.name, fromColor: user.color, fromId: myPeerId.current, room } });
      ch.on('broadcast', { event: 'offer' }, async ({ payload }: any) => {
        if (payload.to !== myPeerId.current) return;
        const pc = createPC(payload.from, stream);
        setPeers(p => [...p.filter(x => x.peerId !== payload.from), { peerId: payload.from, name: from, color: fromColor, stream: null, audioOnly: mode === 'audio' }]);
        await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ch.send({ type: 'broadcast', event: 'answer', payload: { to: payload.from, from: myPeerId.current, answer } });
      });
      ch.on('broadcast', { event: 'ice' }, async ({ payload }: any) => {
        if (payload.to !== myPeerId.current) return;
        const pc = pcsRef.current[payload.from];
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      });
      ch.on('broadcast', { event: 'call_end' }, ({ payload }: any) => { if (payload.room !== room) return; endCall(); });
    } catch { alert('Could not access microphone/camera.'); }
  }, [incomingCall, user, createPC, getSignalChannel, endCall]);

  useEffect(() => {
    if (screen !== 'app' || !user) return;
    const ch = supabase.channel(`incoming-${user.token}`)
      .on('broadcast', { event: 'call_invite' }, ({ payload }: any) => {
        if (callActive) return;
        setIncomingCall({ from: payload.from, fromColor: payload.fromColor, mode: payload.mode, room: payload.room });
        playRing();
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [screen, user, callActive, playRing]);

  const toggleMute   = () => { localStream?.getAudioTracks().forEach(t => { t.enabled = muted; }); setMuted(!muted); };
  const toggleCamera = () => { localStream?.getVideoTracks().forEach(t => { t.enabled = camOff; }); setCamOff(!camOff); };
  const toggleScreenShare = async () => {
    if (sharing) {
      screenStream?.getTracks().forEach(t => t.stop());
      const vt = localStream?.getVideoTracks()[0];
      if (vt) Object.values(pcsRef.current).forEach(pc => { const s = pc.getSenders().find(s => s.track?.kind === 'video'); s?.replaceTrack(vt); });
      setScreenStream(null); setSharing(false);
    } else {
      try {
        const ss = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        setScreenStream(ss); setSharing(true);
        const st = ss.getVideoTracks()[0];
        Object.values(pcsRef.current).forEach(pc => { const s = pc.getSenders().find(s => s.track?.kind === 'video'); s?.replaceTrack(st); });
        if (localVideoRef.current) localVideoRef.current.srcObject = ss;
        st.onended = () => toggleScreenShare();
      } catch {}
    }
  };

  // ── Chat actions ───────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const text = input.trim(); setInput('');
    await supabase.from('boardroom_messages').insert({
      room_id: activeRoom, author_name: user.displayName || user.name,
      author_role: user.role, author_color: user.color,
      message: text, message_type: 'text', audio_url: null, reactions: {}, pinned: false,
    });
    setSending(false); inputRef.current?.focus();
  };

  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;
    await supabase.from('boardroom_messages').update({ message: editText.trim() + ' ✎' }).eq('id', id);
    setEditingId(null); setEditText('');
  };

  const deleteForMe  = (id: number) => { setMessages(p => p.filter(m => m.id !== id)); setMenuMsgId(null); };
  const deleteForAll = async (id: number) => { await supabase.from('boardroom_messages').delete().eq('id', id); setMenuMsgId(null); };
  const togglePin    = async (msg: Message) => { await supabase.from('boardroom_messages').update({ pinned: !msg.pinned }).eq('id', msg.id); setMenuMsgId(null); };

  const addReaction = async (msg: Message, emoji: string) => {
    const existing = msg.reactions || {};
    const users    = existing[emoji] || [];
    const name     = user?.displayName || user?.name || '';
    const updated  = { ...existing, [emoji]: users.includes(name) ? users.filter((n:string) => n !== name) : [...users, name] };
    Object.keys(updated).forEach(k => { if ((updated[k] as string[]).length === 0) delete updated[k]; });
    await supabase.from('boardroom_messages').update({ reactions: updated }).eq('id', msg.id);
    setReactionMsgId(null);
  };

  // ── Voice recording ────────────────────────────────────
  const startRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } as any });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr; audioChunksRef.current = [];
      mr.ondataavailable = e => { if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start(100); setRecording(true); setRecordSecs(0);
      recordTimerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    } catch { alert('Microphone access denied.'); }
  };

  const stopRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive' || !user) return;
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setRecording(false); setRecordSecs(0);
    await new Promise<void>(resolve => {
      const mr = mediaRecorderRef.current!;
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (blob.size < 200) { resolve(); return; }
        setUploading(true);
        const { data, error } = await supabase.storage.from('voice-messages').upload(`${activeRoom}/${Date.now()}.webm`, blob, { contentType: 'audio/webm' });
        if (!error && data) {
          const { data: u } = supabase.storage.from('voice-messages').getPublicUrl(data.path);
          await supabase.from('boardroom_messages').insert({
            room_id: activeRoom, author_name: user.displayName || user.name,
            author_role: user.role, author_color: user.color,
            message: '🎤 Voice message', message_type: 'audio', audio_url: u.publicUrl, reactions: {}, pinned: false,
          });
        }
        setUploading(false); mr.stream.getTracks().forEach(t => t.stop()); resolve();
      };
      mr.stop();
    });
  };

  // ── Profile save/upload ────────────────────────────────
  const saveProfile = async () => {
    if (!user || !profileName.trim()) return;
    setProfileSaving(true);
    await supabase.from('staff_profiles').upsert({ token: user.token, display_name: profileName.trim(), avatar_url: user.avatarUrl || null });
    setUser(u => u ? { ...u, displayName: profileName.trim() } : u);
    setProfileSaving(false);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const ext = file.name.split('.').pop();
    const { data, error } = await supabase.storage.from('avatars').upload(`${user.token}.${ext}`, file, { upsert: true });
    if (!error && data) {
      const { data: u } = supabase.storage.from('avatars').getPublicUrl(data.path);
      const url = u.publicUrl + '?t=' + Date.now();
      await supabase.from('staff_profiles').upsert({ token: user.token, display_name: user.displayName || user.name, avatar_url: url });
      setUser(prev => prev ? { ...prev, avatarUrl: url } : prev);
    }
    setAvatarUploading(false);
  };

  // ── Auth ───────────────────────────────────────────────
  const handleLogin = async () => {
    if (!tokenInput.trim()) return;
    setAuthLoading(true); setTokenError('');
    try {
      const res  = await fetch('/api/boardroom/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tokenInput }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user); await loadProfile(data.user); setScreen('app');
    } catch (err: any) { setTokenError(err.message || 'Invalid token'); }
    finally { setAuthLoading(false); }
  };

  // ── Helpers ────────────────────────────────────────────
  const fmt     = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const fmtDate = (iso: string) => {
    const d = new Date(iso); const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const y = new Date(); y.setDate(today.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  const fmtSec      = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const currentRoom  = ROOMS.find(r => r.id === activeRoom);
  const displayName  = user?.displayName || user?.name || '';
  const filteredMsgs = searchQuery.trim()
    ? messages.filter(m => m.message.toLowerCase().includes(searchQuery.toLowerCase()) || m.author_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const msgGroups: { date: string; msgs: Message[] }[] = [];
  filteredMsgs.forEach(msg => {
    const date = fmtDate(msg.created_at);
    const last = msgGroups[msgGroups.length - 1];
    if (!last || last.date !== date) msgGroups.push({ date, msgs: [msg] });
    else last.msgs.push(msg);
  });

  const Avatar = ({ name, color, url, size = 34 }: { name: string; color: string; url?: string; size?: number }) => (
    <div style={{ width: size, height: size, background: url ? 'transparent' : color + '20', border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color, fontSize: size * 0.32, flexShrink: 0, overflow: 'hidden' }}>
      {url ? <img src={url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
    </div>
  );

  // ── SIDEBAR component (shared between mobile/desktop) ──
  const SidebarContent = () => (
    <>
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #111D2E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: '#00E87A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000', flexShrink: 0 }}>PS</div>
          <div>
            <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 13 }}>ProStack NG</div>
            <div style={{ color: '#00E87A', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.08em' }}>● WORKSPACE</div>
          </div>
        </div>
        {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#8899AA', fontSize: 24, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</button>}
      </div>

      {callActive && (
        <div style={{ margin: '8px 10px 0', background: 'rgba(0,232,122,.07)', border: '1px solid rgba(0,232,122,.2)', padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ color: '#00E87A', fontSize: 9, fontFamily: 'monospace' }}>● {callMode?.toUpperCase()} · #{callRoom}</div>
            <div style={{ color: '#445566', fontSize: 10, marginTop: 1 }}>{peers.length} participant{peers.length !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={endCall} style={{ background: '#FF5757', border: 'none', color: '#fff', padding: '3px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>End</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <div style={{ padding: '4px 16px 6px', fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em' }}>CHANNELS</div>
        {ROOMS.map(room => (
          <button key={room.id} onClick={() => switchRoom(room.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: activeRoom === room.id ? 'rgba(0,232,122,.08)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: activeRoom === room.id ? '2px solid #00E87A' : '2px solid transparent', fontFamily: 'Space Grotesk, sans-serif' }}>
            <span style={{ color: activeRoom === room.id ? '#00E87A' : '#445566', fontSize: 14, flexShrink: 0 }}>{room.icon}</span>
            <span style={{ color: activeRoom === room.id ? '#E2EAF4' : '#8899AA', fontSize: 13, fontWeight: activeRoom === room.id ? 600 : 400, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.name}</span>
          </button>
        ))}
        {pinned.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ padding: '4px 16px 6px', fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em' }}>PINNED · {pinned.length}</div>
            <button onClick={() => setShowPinned(!showPinned)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: showPinned ? 'rgba(245,181,48,.06)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: showPinned ? '2px solid #F5B530' : '2px solid transparent', fontFamily: 'Space Grotesk, sans-serif' }}>
              <span style={{ color: '#F5B530', fontSize: 13 }}>📌</span>
              <span style={{ color: '#8899AA', fontSize: 13 }}>Pinned Messages</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid #111D2E', flexShrink: 0 }}>
        <button onClick={() => { setPanel(p => p === 'settings' ? 'chat' : 'settings'); setSidebarOpen(false); }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: panel === 'settings' ? 'rgba(0,232,122,.06)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: panel === 'settings' ? '2px solid #00E87A' : '2px solid transparent', fontFamily: 'Space Grotesk, sans-serif' }}>
          <span style={{ fontSize: 14, color: panel === 'settings' ? '#00E87A' : '#445566', flexShrink: 0 }}>⚙</span>
          <span style={{ color: panel === 'settings' ? '#E2EAF4' : '#8899AA', fontSize: 13 }}>Settings</span>
        </button>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #111D2E' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={30} />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, background: '#00E87A', border: `2px solid ${BG2}`, borderRadius: '50%' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#E2EAF4', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
            <div style={{ color: '#445566', fontSize: 10, fontFamily: 'monospace' }}>{user!.role}</div>
          </div>
          <button onClick={() => { endCall(); setScreen('login'); setUser(null); }} style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 15, flexShrink: 0 }}>⎋</button>
        </div>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ minHeight: '100dvh', background: '#050709', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif', backgroundImage: 'linear-gradient(rgba(0,232,122,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.025) 1px,transparent 1px)', backgroundSize: '60px 60px', padding: 16 }}>
      <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(0,232,122,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, background: '#00E87A', color: '#000', fontWeight: 900, fontSize: 17, marginBottom: 14 }}>PS</div>
          <div style={{ color: '#E2EAF4', fontWeight: 800, fontSize: 20 }}>ProStack BoardRoom</div>
          <div style={{ color: '#445566', fontSize: 10, marginTop: 6, fontFamily: 'monospace', letterSpacing: '.14em' }}>STAFF ACCESS ONLY · v4.0</div>
        </div>
        <div style={{ background: '#0C1220', border: '1px solid #111D2E', padding: '36px 28px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#00E87A,#00C8FF,#A78BFA,transparent)' }} />
          <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 10, letterSpacing: '.15em', marginBottom: 8 }}>STAFF ACCESS TOKEN</div>
          <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Enter your token</div>
          <div style={{ color: '#8899AA', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>Each staff member has a unique token. Contact your administrator if you don't have one.</div>
          <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="PSN-XXX-000" autoFocus
            style={{ width: '100%', background: '#080C12', border: `1px solid ${tokenError ? '#FF5757' : '#1A2E48'}`, color: '#E2EAF4', padding: '13px 16px', fontSize: 15, fontFamily: 'monospace', letterSpacing: '.1em', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
          {tokenError && <div style={{ color: '#FF5757', fontSize: 12, fontFamily: 'monospace', marginBottom: 12 }}>⚠ {tokenError}</div>}
          <button onClick={handleLogin} disabled={authLoading}
            style={{ width: '100%', background: '#00E87A', color: '#000', border: 'none', padding: '14px 0', fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            {authLoading ? 'Verifying…' : 'Enter BoardRoom →'}
          </button>
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #111D2E', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[{ icon: '💬', label: 'Real-time chat' }, { icon: '🎤', label: 'Voice notes' }, { icon: '📞', label: 'P2P Calls' }, { icon: '🖥', label: 'Screen share' }].map(f => (
              <div key={f.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontFamily: 'monospace', color: '#2A4060', fontSize: 9, letterSpacing: '.08em' }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // APP — KEY FIX: on mobile sidebar is position:fixed
  //        and NOT part of the flex row at all,
  //        so main content always takes 100% width
  // ─────────────────────────────────────────────────────
  return (
    <div style={{ height: '100dvh', width: '100vw', display: 'flex', background: BG, fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden' }}>

      {/* ── MOBILE SIDEBAR (fixed, outside flex flow) ── */}
      {isMobile && (
        <>
          {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 98, backdropFilter: 'blur(2px)' }} />
          )}
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: 240,
            background: BG2, borderRight: '1px solid #111D2E',
            display: 'flex', flexDirection: 'column',
            zIndex: 99,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
            boxShadow: sidebarOpen ? '8px 0 32px rgba(0,0,0,.5)' : 'none',
          }}>
            <SidebarContent />
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR (in flex flow) ── */}
      {!isMobile && (
        <div style={{ width: 228, background: BG2, borderRight: '1px solid #111D2E', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <SidebarContent />
        </div>
      )}

      {/* ── INCOMING CALL ── */}
      {incomingCall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,7,9,.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: 16 }}>
          <div style={{ background: BG2, border: '1px solid #1A2E48', padding: '40px 28px', textAlign: 'center', maxWidth: 360, width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${incomingCall.fromColor},transparent)` }} />
            <div style={{ fontSize: 44, marginBottom: 14 }}>{incomingCall.mode === 'video' ? '📹' : '🎙'}</div>
            <div style={{ fontFamily: 'monospace', color: '#00E87A', fontSize: 10, letterSpacing: '.12em', marginBottom: 10 }}>INCOMING {incomingCall.mode.toUpperCase()} CALL</div>
            <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{incomingCall.from}</div>
            <div style={{ color: '#445566', fontSize: 13, marginBottom: 32 }}>calling in #{incomingCall.room}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setIncomingCall(null)} style={{ flex: 1, background: '#FF5757', border: 'none', color: '#fff', padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>📵 Decline</button>
              <button onClick={acceptCall} style={{ flex: 1, background: '#00E87A', border: 'none', color: '#000', padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>📞 Accept</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MAIN — always full width on mobile ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', width: isMobile ? '100%' : undefined }}>

        {/* HEADER */}
        <div style={{ height: 50, display: 'flex', alignItems: 'center', borderBottom: '1px solid #111D2E', background: BG2, flexShrink: 0, padding: '0 10px', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#8899AA', fontSize: 20, cursor: 'pointer', padding: '2px 4px', flexShrink: 0 }}>☰</button>
            )}
            <span style={{ color: '#00E87A', fontSize: 14, flexShrink: 0 }}>{currentRoom?.icon}</span>
            <span style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 14, flexShrink: 0, whiteSpace: 'nowrap' }}>{currentRoom?.name}</span>
            {!isMobile && <span style={{ color: '#445566', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentRoom?.desc}</span>}
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(s => !s)}
              style={{ width: 32, height: 32, background: searchOpen ? 'rgba(0,232,122,.12)' : 'transparent', border: `1px solid ${searchOpen ? '#00E87A' : '#1A2E48'}`, color: searchOpen ? '#00E87A' : '#8899AA', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔍</button>
            <button onClick={() => startCall('audio')} disabled={callActive}
              style={{ height: 32, padding: '0 10px', background: 'transparent', border: '1px solid #1A2E48', color: callActive ? '#2A4060' : '#00E87A', cursor: callActive ? 'default' : 'pointer', fontWeight: 600, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>
              {isMobile ? '🎙' : '🎙 Audio'}
            </button>
            <button onClick={() => startCall('video')} disabled={callActive}
              style={{ height: 32, padding: '0 10px', background: callActive ? '#1A2E48' : '#00E87A', color: callActive ? '#2A4060' : '#000', border: 'none', cursor: callActive ? 'default' : 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>
              {isMobile ? '📹' : '📹 Video'}
            </button>
          </div>
        </div>

        {/* Search */}
        {searchOpen && (
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #111D2E', background: BG2, display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search messages…" autoFocus
              style={{ flex: 1, background: BG3, border: '1px solid #1A2E48', color: '#E2EAF4', padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'Space Grotesk, sans-serif', minWidth: 0 }} />
            {searchQuery && <span style={{ color: '#445566', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>{filteredMsgs.length} found</span>}
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 20, flexShrink: 0 }}>×</button>
          </div>
        )}

        {/* Call panel */}
        {callActive && (
          <div style={{ borderBottom: '1px solid #111D2E', background: '#000', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 3, padding: 6, height: callMode === 'video' ? (isMobile ? 170 : 230) : 68 }}>
              <div style={{ flex: 1, background: '#0A0A0A', border: '1px solid #1A2E48', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {callMode === 'video'
                  ? <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                  : <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={34} />
                }
                <div style={{ position: 'absolute', bottom: 4, left: 6, background: 'rgba(0,0,0,.75)', padding: '2px 6px', fontFamily: 'monospace', color: '#00E87A', fontSize: 9 }}>{muted ? '🔇' : '🎙'} You</div>
              </div>
              {peers.map(peer => (
                <div key={peer.peerId} style={{ flex: 1, background: '#0A0A0A', border: '1px solid #1A2E48', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {peer.stream && !peer.audioOnly
                    ? <video autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} ref={el => { if (el && peer.stream) { el.srcObject = peer.stream; el.play().catch(() => {}); } }} />
                    : <div><Avatar name={peer.name} color={peer.color} size={34} />{peer.stream && <audio autoPlay ref={el => { if (el && peer.stream) { el.srcObject = peer.stream; el.play().catch(() => {}); } }} />}</div>
                  }
                  <div style={{ position: 'absolute', bottom: 4, left: 6, background: 'rgba(0,0,0,.75)', padding: '2px 6px', fontFamily: 'monospace', color: peer.color, fontSize: 9 }}>{peer.name}</div>
                </div>
              ))}
              {peers.length === 0 && <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2A4060', fontSize: 11, fontFamily: 'monospace', textAlign: 'center' }}>Waiting for others…</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: '5px 8px 7px', borderTop: '1px solid #111D2E', flexWrap: 'wrap' }}>
              {[
                { label: muted ? '🔇 Unmute' : '🎙 Mute', action: toggleMute, active: muted },
                ...(callMode === 'video' ? [{ label: camOff ? '📷 On' : '📷 Off', action: toggleCamera, active: camOff }] : []),
                { label: sharing ? '🖥 Stop' : '🖥 Share', action: toggleScreenShare, active: sharing },
                { label: '📵 End', action: endCall, danger: true },
              ].map((btn: any) => (
                <button key={btn.label} onClick={btn.action}
                  style={{ background: btn.danger ? '#FF5757' : btn.active ? 'rgba(0,232,122,.15)' : BG3, border: `1px solid ${btn.danger ? '#FF5757' : btn.active ? '#00E87A' : '#1A2E48'}`, color: btn.danger ? '#fff' : btn.active ? '#00E87A' : '#8899AA', padding: '5px 11px', cursor: 'pointer', fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', fontWeight: btn.danger ? 700 : 400, whiteSpace: 'nowrap' }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {panel === 'settings' ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 14px' : '24px 28px', background: BG }}>
            <div style={{ maxWidth: 540 }}>
              <div style={{ fontFamily: 'monospace', color: '#00E87A', fontSize: 10, letterSpacing: '.15em', marginBottom: 4 }}>WORKSPACE SETTINGS</div>
              <h2 style={{ color: '#E2EAF4', fontWeight: 800, fontSize: 20, margin: '0 0 4px' }}>Settings</h2>
              <div style={{ color: '#445566', fontSize: 13, marginBottom: 22 }}>Manage your profile and preferences</div>

              <div style={{ background: BG2, border: '1px solid #111D2E', padding: 18, marginBottom: 10, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#00E87A,#00C8FF,transparent)' }} />
                <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em', marginBottom: 14 }}>YOUR PROFILE</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={58} />
                    <button onClick={() => fileInputRef.current?.click()}
                      style={{ position: 'absolute', bottom: -3, right: -3, width: 22, height: 22, background: '#00E87A', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11 }}>
                      {avatarUploading ? '…' : '📷'}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                    <div style={{ color: user!.color, fontFamily: 'monospace', fontSize: 11, marginTop: 2 }}>{user!.role}</div>
                    <div style={{ color: '#2A4060', fontFamily: 'monospace', fontSize: 10, marginTop: 3 }}>{user!.token}</div>
                    {avatarUploading && <div style={{ color: '#00E87A', fontSize: 11, marginTop: 3, fontFamily: 'monospace' }}>Uploading…</div>}
                  </div>
                </div>
                <div style={{ color: '#445566', fontSize: 10, fontFamily: 'monospace', marginBottom: 6, letterSpacing: '.08em' }}>DISPLAY NAME</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your display name"
                    style={{ flex: 1, minWidth: 0, background: BG3, border: '1px solid #1A2E48', color: '#E2EAF4', padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }} />
                  <button onClick={saveProfile} disabled={profileSaving}
                    style={{ background: '#00E87A', border: 'none', color: '#000', padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0 }}>
                    {profileSaving ? '…' : 'Save'}
                  </button>
                </div>
              </div>

              <div style={{ background: BG2, border: '1px solid #111D2E', padding: 18, marginBottom: 10 }}>
                <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em', marginBottom: 12 }}>PREFERENCES</div>
                {[
                  { label: 'Notification sounds', desc: 'Tone when a message arrives', val: notifSound, set: setNotifSound },
                  { label: 'Compact view', desc: 'Reduce spacing between messages', val: compactMode, set: setCompact },
                  { label: 'Show timestamps', desc: 'Time next to each message', val: showTs, set: setShowTs },
                ].map((item, idx, arr) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: idx < arr.length - 1 ? '1px solid #0D1525' : 'none' }}>
                    <div style={{ paddingRight: 10 }}>
                      <div style={{ color: '#E2EAF4', fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ color: '#445566', fontSize: 12, marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <button onClick={() => item.set(!item.val)}
                      style={{ width: 44, height: 24, background: item.val ? '#00E87A' : '#111D2E', borderRadius: 12, position: 'relative', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
                      <div style={{ position: 'absolute', top: 3, left: item.val ? 23 : 3, width: 18, height: 18, background: item.val ? '#000' : '#445566', borderRadius: '50%', transition: 'left .2s' }} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ background: BG2, border: '1px solid #111D2E', padding: 18, marginBottom: 10 }}>
                <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em', marginBottom: 12 }}>APPEARANCE</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['dark','darker'] as const).map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      style={{ flex: 1, padding: '12px 8px', background: t === 'dark' ? '#080C12' : '#020305', border: `2px solid ${theme === t ? '#00E87A' : '#1A2E48'}`, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                      <div style={{ color: theme === t ? '#00E87A' : '#445566', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{t}</div>
                      <div style={{ color: '#2A4060', fontSize: 11, marginTop: 3 }}>{t === 'dark' ? 'Default' : 'Extra dark'}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: BG2, border: '1px solid #2A1515', padding: 18 }}>
                <div style={{ fontFamily: 'monospace', color: '#FF5757', fontSize: 9, letterSpacing: '.12em', marginBottom: 12 }}>ACCOUNT</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ color: '#E2EAF4', fontSize: 13, fontWeight: 600 }}>Sign out</div>
                    <div style={{ color: '#445566', fontSize: 12, marginTop: 2 }}>You'll need your token to sign back in</div>
                  </div>
                  <button onClick={() => { endCall(); setScreen('login'); setUser(null); }}
                    style={{ background: 'rgba(255,87,87,.1)', border: '1px solid #FF5757', color: '#FF5757', padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ══ CHAT ══ */
          <>
            {showPinned && pinned.length > 0 && (
              <div style={{ borderBottom: '1px solid #111D2E', background: 'rgba(245,181,48,.04)', padding: '8px 14px', maxHeight: 110, overflowY: 'auto', flexShrink: 0 }}>
                <div style={{ fontFamily: 'monospace', color: '#F5B530', fontSize: 9, letterSpacing: '.12em', marginBottom: 6 }}>📌 PINNED</div>
                {pinned.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 5, height: 5, background: '#F5B530', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
                    <span style={{ color: '#F5B530', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{msg.author_name}: </span>
                    <span style={{ color: '#8899AA', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message.slice(0,80)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── MESSAGES with wallpaper ── */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 12px', display: 'flex', flexDirection: 'column', position: 'relative', background: BG }}>
              {/* Wallpaper layer */}
              <div style={{
                position: 'fixed', top: 0, left: isMobile ? 0 : 228, right: 0, bottom: 0,
                pointerEvents: 'none', zIndex: 0,
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(0,232,122,0.03) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(0,200,255,0.03) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(167,139,250,0.02) 0%, transparent 60%)
                `,
              }} />
              <div style={{
                position: 'fixed', top: 0, left: isMobile ? 0 : 228, right: 0, bottom: 0,
                pointerEvents: 'none', zIndex: 0, opacity: 0.4,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='30' cy='30' r='1' fill='%2300E87A' opacity='0.12'/%3E%3Ccircle cx='0' cy='0' r='0.8' fill='%2300E87A' opacity='0.08'/%3E%3Ccircle cx='60' cy='0' r='0.8' fill='%2300E87A' opacity='0.08'/%3E%3Ccircle cx='0' cy='60' r='0.8' fill='%2300E87A' opacity='0.08'/%3E%3Ccircle cx='60' cy='60' r='0.8' fill='%2300E87A' opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23p)'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }} />

              {filteredMsgs.length === 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2A4060', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>{currentRoom?.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#445566', marginBottom: 4 }}>#{currentRoom?.name}</div>
                  <div style={{ fontSize: 13 }}>{searchQuery ? 'No messages match.' : 'No messages yet. Say hello!'}</div>
                </div>
              )}

              {msgGroups.map(group => (
                <div key={group.date} style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 10px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.05)' }} />
                    <span style={{ fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.1em', whiteSpace: 'nowrap', background: BG, padding: '2px 10px', border: '1px solid #111D2E' }}>{group.date}</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.05)' }} />
                  </div>

                  {group.msgs.map((msg, i) => {
                    const showHeader = i === 0 || group.msgs[i-1].author_name !== msg.author_name;
                    const isOwn      = msg.author_name === displayName || msg.author_name === user?.name;
                    const reactions  = msg.reactions || {};
                    const hasReact   = Object.keys(reactions).some(k => (reactions[k] as string[]).length > 0);

                    return (
                      <div key={msg.id}
                        onMouseEnter={() => !isMobile && setHoveredMsg(msg.id)}
                        onMouseLeave={() => !isMobile && setHoveredMsg(null)}
                        style={{ display: 'flex', gap: 8, marginTop: showHeader ? (compactMode ? 6 : 14) : (compactMode ? 1 : 2), position: 'relative', padding: '3px 6px 3px 4px', background: hoveredMsg === msg.id ? 'rgba(255,255,255,.03)' : msg.pinned ? 'rgba(245,181,48,.04)' : 'transparent', transition: 'background .1s' }}>

                        {showHeader
                          ? <Avatar name={msg.author_name} color={msg.author_color} size={32} />
                          : <div style={{ width: 32, flexShrink: 0 }} />
                        }

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {showHeader && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ color: msg.author_color, fontWeight: 700, fontSize: 13 }}>{msg.author_name}</span>
                              <span style={{ fontFamily: 'monospace', color: '#3A5070', fontSize: 9 }}>{msg.author_role}</span>
                              {showTs && <span style={{ fontFamily: 'monospace', color: '#3A5070', fontSize: 9 }}>{fmt(msg.created_at)}</span>}
                              {msg.pinned && <span>📌</span>}
                            </div>
                          )}

                          {editingId === msg.id ? (
                            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                              <input value={editText} onChange={e => setEditText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') saveEdit(msg.id); if (e.key === 'Escape') { setEditingId(null); setEditText(''); } }}
                                autoFocus style={{ flex: 1, minWidth: 100, background: BG3, border: '1px solid #00E87A', color: '#E2EAF4', padding: '7px 10px', fontSize: 13, outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }} />
                              <button onClick={() => saveEdit(msg.id)} style={{ background: '#00E87A', color: '#000', border: 'none', padding: '7px 12px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>Save</button>
                              <button onClick={() => { setEditingId(null); setEditText(''); }} style={{ background: '#111D2E', color: '#8899AA', border: 'none', padding: '7px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>✕</button>
                            </div>
                          ) : msg.message_type === 'audio' && msg.audio_url ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(12,18,32,0.9)', border: '1px solid #1A2E48', padding: '8px 12px', maxWidth: '100%' }}>
                              <span style={{ color: '#00E87A', fontSize: 15, flexShrink: 0 }}>🎤</span>
                              <audio controls src={msg.audio_url} style={{ height: 28, maxWidth: 'calc(100vw - 180px)' }} />
                            </div>
                          ) : (
                            <div style={{
                              display: 'inline-block', maxWidth: '85%',
                              background: isOwn ? 'rgba(0,232,122,.09)' : 'rgba(12,18,32,0.82)',
                              border: `1px solid ${isOwn ? 'rgba(0,232,122,.18)' : 'rgba(255,255,255,.05)'}`,
                              padding: '7px 12px', wordBreak: 'break-word',
                              color: '#D0E0F0', fontSize: 14, lineHeight: 1.6,
                            }}>
                              {msg.message}
                            </div>
                          )}

                          {hasReact && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                              {Object.entries(reactions).map(([emoji, users]: [string, any]) =>
                                (users as string[]).length > 0 && (
                                  <button key={emoji} onClick={() => addReaction(msg, emoji)} title={(users as string[]).join(', ')}
                                    style={{ background: (users as string[]).includes(displayName) ? 'rgba(0,232,122,.15)' : 'rgba(12,18,32,.8)', border: `1px solid ${(users as string[]).includes(displayName) ? 'rgba(0,232,122,.4)' : '#1A2E48'}`, color: '#E2EAF4', padding: '2px 7px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Space Grotesk, sans-serif' }}>
                                    {emoji} <span style={{ fontSize: 11, color: '#8899AA' }}>{(users as string[]).length}</span>
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          {/* Mobile actions */}
                          {isMobile && (
                            <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                              <button data-menu onClick={e => { e.stopPropagation(); setReactionMsgId(reactionMsgId === msg.id ? null : msg.id); setMenuMsgId(null); }}
                                style={{ background: 'rgba(12,18,32,.8)', border: '1px solid #1A2E48', color: '#445566', cursor: 'pointer', fontSize: 12, padding: '3px 7px' }}>😊</button>
                              {isOwn && msg.message_type === 'text' && (
                                <button onClick={() => { setEditingId(msg.id); setEditText(msg.message.replace(' ✎','')); }}
                                  style={{ background: 'rgba(12,18,32,.8)', border: '1px solid #1A2E48', color: '#445566', cursor: 'pointer', fontSize: 12, padding: '3px 7px' }}>✎</button>
                              )}
                              <button data-menu onClick={e => { e.stopPropagation(); setMenuMsgId(menuMsgId === msg.id ? null : msg.id); setReactionMsgId(null); }}
                                style={{ background: 'rgba(12,18,32,.8)', border: '1px solid #1A2E48', color: '#445566', cursor: 'pointer', fontSize: 12, padding: '3px 7px' }}>⋯</button>
                            </div>
                          )}

                          {reactionMsgId === msg.id && (
                            <div data-menu onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 4, flexWrap: 'wrap', background: BG2, border: '1px solid #1A2E48', padding: 8, marginTop: 5, width: 'fit-content', zIndex: 30, boxShadow: '0 4px 20px rgba(0,0,0,.6)' }}>
                              {REACTIONS.map(emoji => <button key={emoji} onClick={() => addReaction(msg, emoji)} style={{ background: 'none', border: '1px solid #1A2E48', fontSize: 18, padding: '4px 5px', cursor: 'pointer' }}>{emoji}</button>)}
                            </div>
                          )}

                          {menuMsgId === msg.id && (
                            <div data-menu onClick={e => e.stopPropagation()} style={{ background: BG2, border: '1px solid #1A2E48', width: 196, zIndex: 30, boxShadow: '0 8px 24px rgba(0,0,0,.7)', marginTop: 4 }}>
                              <div style={{ padding: '4px 0' }}>
                                <button onClick={() => togglePin(msg)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>📌 {msg.pinned ? 'Unpin' : 'Pin message'}</button>
                                <button onClick={() => { navigator.clipboard?.writeText(msg.message); setMenuMsgId(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>📋 Copy text</button>
                                <div style={{ height: 1, background: '#111D2E', margin: '4px 0' }} />
                                <button onClick={() => deleteForMe(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#8899AA', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>🙈 Delete for me</button>
                                {isOwn && <button onClick={() => deleteForAll(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#FF5757', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>🗑 Delete for everyone</button>}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Desktop hover actions */}
                        {!isMobile && hoveredMsg === msg.id && editingId !== msg.id && (
                          <div data-menu style={{ position: 'absolute', right: 6, top: 0, display: 'flex', gap: 2, background: BG2, border: '1px solid #1A2E48', padding: '3px 4px', zIndex: 20, boxShadow: '0 2px 12px rgba(0,0,0,.5)' }}>
                            <div data-menu style={{ position: 'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setReactionMsgId(reactionMsgId === msg.id ? null : msg.id); setMenuMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 14, padding: '4px 6px' }}>😊</button>
                              {reactionMsgId === msg.id && (
                                <div data-menu style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 4px)', background: BG2, border: '1px solid #1A2E48', padding: 8, display: 'flex', gap: 5, flexWrap: 'wrap', width: 188, zIndex: 30, boxShadow: '0 8px 24px rgba(0,0,0,.6)' }}>
                                  {REACTIONS.map(emoji => <button key={emoji} onClick={() => addReaction(msg, emoji)} style={{ background: 'none', border: '1px solid #1A2E48', fontSize: 18, padding: '4px 5px', cursor: 'pointer' }}>{emoji}</button>)}
                                </div>
                              )}
                            </div>
                            {isOwn && msg.message_type === 'text' && (
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.message.replace(' ✎','')); setMenuMsgId(null); setReactionMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 13, padding: '4px 6px' }}>✎</button>
                            )}
                            <div data-menu style={{ position: 'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setMenuMsgId(menuMsgId === msg.id ? null : msg.id); setReactionMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 16, padding: '4px 6px' }}>⋯</button>
                              {menuMsgId === msg.id && (
                                <div data-menu style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 4px)', background: BG2, border: '1px solid #1A2E48', minWidth: 200, zIndex: 30, boxShadow: '0 8px 32px rgba(0,0,0,.7)' }}>
                                  <div style={{ padding: '4px 0' }}>
                                    <button onClick={() => togglePin(msg)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>📌 {msg.pinned ? 'Unpin' : 'Pin message'}</button>
                                    <button onClick={() => { navigator.clipboard?.writeText(msg.message); setMenuMsgId(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>📋 Copy text</button>
                                    <div style={{ height: 1, background: '#111D2E', margin: '4px 0' }} />
                                    <button onClick={() => deleteForMe(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#8899AA', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>🙈 Delete for me</button>
                                    {isOwn && <button onClick={() => deleteForAll(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#FF5757', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>🗑 Delete for everyone</button>}
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
              <div ref={bottomRef} style={{ position: 'relative', zIndex: 1 }} />
            </div>

            {/* Typing */}
            {typing.length > 0 && (
              <div style={{ padding: '3px 14px 0', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, background: BG2 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, background: '#445566', borderRadius: '50%', animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                </div>
                <span style={{ color: '#445566', fontSize: 12, fontStyle: 'italic' }}>{typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing…</span>
              </div>
            )}

            {/* Input bar */}
            <div style={{ padding: '8px 10px 10px', borderTop: '1px solid #111D2E', background: BG2, flexShrink: 0 }}>
              {uploading && <div style={{ fontFamily: 'monospace', color: '#00E87A', fontSize: 10, marginBottom: 6 }}>⬆ Uploading voice…</div>}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
                  disabled={uploading} title="Hold to record"
                  style={{ width: 36, height: 36, background: recording ? '#FF5757' : BG3, border: `1px solid ${recording ? '#FF5757' : '#1A2E48'}`, color: recording ? '#fff' : '#445566', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}>🎤</button>
                {recording ? (
                  <div style={{ flex: 1, background: BG3, border: '1px solid #FF5757', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <div style={{ width: 6, height: 6, background: '#FF5757', borderRadius: '50%', animation: 'pulse 1s ease-in-out infinite', flexShrink: 0 }} />
                    <span style={{ color: '#FF5757', fontSize: 9, fontFamily: 'monospace', flexShrink: 0 }}>REC</span>
                    <span style={{ color: '#E2EAF4', fontSize: 13, fontFamily: 'monospace', flexShrink: 0 }}>{fmtSec(recordSecs)}</span>
                    <span style={{ color: '#445566', fontSize: 11 }}>Release to send</span>
                  </div>
                ) : (
                  <input ref={inputRef} value={input} onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={`Message #${currentRoom?.name}…`}
                    style={{ flex: 1, background: BG3, border: '1px solid #1A2E48', color: '#E2EAF4', padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Space Grotesk, sans-serif', minWidth: 0 }} />
                )}
                <button onClick={sendMessage} disabled={!input.trim() || sending || recording}
                  style={{ width: 36, height: 36, background: input.trim() && !recording ? '#00E87A' : BG3, border: `1px solid ${input.trim() && !recording ? '#00E87A' : '#111D2E'}`, color: input.trim() && !recording ? '#000' : '#445566', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: input.trim() && !recording ? 'pointer' : 'default' }}>→</button>
              </div>
              {!isMobile && <div style={{ fontFamily: 'monospace', color: '#2A4060', fontSize: 10, marginTop: 5 }}>ENTER to send · Hold 🎤 for voice · Hover message for actions</div>}
            </div>
          </>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A2E48; border-radius: 2px; }
        audio { max-width: 100%; }
      `}</style>
    </div>
  );
}
