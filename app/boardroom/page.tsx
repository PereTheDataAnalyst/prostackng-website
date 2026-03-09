'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Free STUN servers for WebRTC NAT traversal (works in Nigeria)
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
  { urls: 'stun:stun.nextcloud.com:443' },
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
  // ── Auth ───────────────────────────────────────────────
  const [screen, setScreen]           = useState<'login'|'app'>('login');
  const [tokenInput, setTokenInput]   = useState('');
  const [tokenError, setTokenError]   = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser]               = useState<User|null>(null);

  // ── Chat ───────────────────────────────────────────────
  const [activeRoom, setActiveRoom]   = useState('general');
  const [messages, setMessages]       = useState<Message[]>([]);
  const [pinned, setPinned]           = useState<Message[]>([]);
  const [showPinned, setShowPinned]   = useState(false);
  const [input, setInput]             = useState('');
  const [sending, setSending]         = useState(false);
  const [typing, setTyping]           = useState<string[]>([]);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [panel, setPanel]             = useState<'chat'|'settings'>('chat');
  const [hoveredMsg, setHoveredMsg]   = useState<number|null>(null);
  const [menuMsgId, setMenuMsgId]     = useState<number|null>(null);
  const [reactionMsgId, setReactionMsgId] = useState<number|null>(null);
  const [editingId, setEditingId]     = useState<number|null>(null);
  const [editText, setEditText]       = useState('');
  const typingTimerRef                = useRef<ReturnType<typeof setTimeout>|null>(null);

  // ── Voice recording ────────────────────────────────────
  const [recording, setRecording]     = useState(false);
  const [recordSecs, setRecordSecs]   = useState(0);
  const [uploading, setUploading]     = useState(false);
  const mediaRecorderRef              = useRef<MediaRecorder|null>(null);
  const audioChunksRef                = useRef<Blob[]>([]);
  const recordTimerRef                = useRef<ReturnType<typeof setInterval>|null>(null);

  // ── WebRTC Call ────────────────────────────────────────
  const [callActive, setCallActive]   = useState(false);
  const [callMode, setCallMode]       = useState<'audio'|'video'|null>(null);
  const [callRoom, setCallRoom]       = useState<string|null>(null);
  const [peers, setPeers]             = useState<Peer[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream|null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream|null>(null);
  const [muted, setMuted]             = useState(false);
  const [camOff, setCamOff]           = useState(false);
  const [sharing, setSharing]         = useState(false);
  const [incomingCall, setIncomingCall] = useState<{from:string;fromColor:string;mode:'audio'|'video';room:string}|null>(null);
  const pcsRef                        = useRef<Record<string, RTCPeerConnection>>({});
  const localVideoRef                 = useRef<HTMLVideoElement>(null);
  const signalChannelRef              = useRef<any>(null);
  const myPeerId                      = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // ── Settings ───────────────────────────────────────────
  const [notifSound, setNotifSound]   = useState(true);
  const [compactMode, setCompact]     = useState(false);
  const [showTs, setShowTs]           = useState(true);
  const [theme, setTheme]             = useState<'dark'|'darker'>('dark');
  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const BG  = theme === 'darker' ? '#020305' : '#050709';
  const BG2 = theme === 'darker' ? '#060810' : '#080C12';
  const BG3 = theme === 'darker' ? '#080C14' : '#0C1220';

  // ── Notification beep ──────────────────────────────────
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

  // ── Load profile ───────────────────────────────────────
  const loadProfile = useCallback(async (u: User) => {
    const { data } = await supabase.from('staff_profiles').select('*').eq('token', u.token).single();
    if (data) {
      setUser(prev => prev ? { ...prev, displayName: data.display_name, avatarUrl: data.avatar_url } : prev);
      setProfileName(data.display_name || u.name);
    } else {
      setProfileName(u.name);
    }
  }, []);

  // ── Load messages ──────────────────────────────────────
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

  // ── Realtime messages ──────────────────────────────────
  useEffect(() => {
    if (screen !== 'app') return;
    const ch = supabase.channel(`msgs-${activeRoom}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boardroom_messages', filter: `room_id=eq.${activeRoom}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const msg = payload.new as Message;
          setMessages(p => [...p, msg]);
          if (msg.author_name !== user?.name) playBeep();
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

  // ── Typing broadcast ───────────────────────────────────
  useEffect(() => {
    if (screen !== 'app') return;
    const ch = supabase.channel(`typing-${activeRoom}`)
      .on('broadcast', { event: 'typing' }, ({ payload }: any) => {
        if (payload.name === user?.name) return;
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

  // ── Close menus on outside click ───────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('[data-menu]')) { setMenuMsgId(null); setReactionMsgId(null); }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ═══════════════════════════════════════════════════════
  // WebRTC CALL ENGINE
  // ═══════════════════════════════════════════════════════
  const getSignalChannel = useCallback((roomId: string) => {
    if (signalChannelRef.current) return signalChannelRef.current;
    const ch = supabase.channel(`call-signal-${roomId}`, { config: { broadcast: { self: false } } });
    signalChannelRef.current = ch;
    return ch;
  }, []);

  const createPC = useCallback((peerId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcsRef.current[peerId] = pc;

    // Add local tracks
    stream.getTracks().forEach(t => pc.addTrack(t, stream));

    // ICE candidates → send via signal
    pc.onicecandidate = ({ candidate }) => {
      if (!candidate) return;
      signalChannelRef.current?.send({ type: 'broadcast', event: 'ice', payload: { to: peerId, from: myPeerId.current, candidate } });
    };

    // Remote stream → update peer
    pc.ontrack = ({ streams }) => {
      const remoteStream = streams[0];
      setPeers(p => p.map(peer => peer.peerId === peerId ? { ...peer, stream: remoteStream } : peer));
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        setPeers(p => p.filter(peer => peer.peerId !== peerId));
        delete pcsRef.current[peerId];
      }
    };

    return pc;
  }, []);

  const startCall = useCallback(async (mode: 'audio' | 'video') => {
    if (!user) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === 'video' ? { width: 1280, height: 720 } : false,
      });
      setLocalStream(stream);
      setCallActive(true);
      setCallMode(mode);
      setCallRoom(activeRoom);

      // Attach local video preview
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;
          localVideoRef.current.play().catch(() => {});
        }
      }, 100);

      // Set up signal channel and announce call
      const ch = getSignalChannel(activeRoom).subscribe(async (status: string) => {
        if (status !== 'SUBSCRIBED') return;
        // Announce call invite
        ch.send({ type: 'broadcast', event: 'call_invite', payload: {
          from: user.displayName || user.name, fromColor: user.color,
          fromId: myPeerId.current, mode, room: activeRoom,
        }});
      });

      // Listen for answers and ICE
      signalChannelRef.current = ch;
      ch.on('broadcast', { event: 'call_accept' }, async ({ payload }: any) => {
        if (payload.room !== activeRoom) return;
        const peerId = payload.fromId;
        const pc = createPC(peerId, stream);
        setPeers(p => [...p.filter(x => x.peerId !== peerId), { peerId, name: payload.from, color: payload.fromColor, stream: null, audioOnly: mode === 'audio' }]);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ch.send({ type: 'broadcast', event: 'offer', payload: { to: peerId, from: myPeerId.current, offer } });
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

      ch.on('broadcast', { event: 'call_end' }, ({ payload }: any) => {
        if (payload.room !== activeRoom) return;
        endCall();
      });

    } catch (err: any) {
      alert(`Could not access ${mode === 'video' ? 'camera/microphone' : 'microphone'}. Please check your browser permissions and try again.`);
    }
  }, [user, activeRoom, createPC, getSignalChannel]);

  const acceptCall = useCallback(async () => {
    if (!incomingCall || !user) return;
    const { from, fromColor, mode, room } = incomingCall;
    setIncomingCall(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === 'video' ? { width: 1280, height: 720 } : false,
      });
      setLocalStream(stream);
      setCallActive(true);
      setCallMode(mode);
      setCallRoom(room);

      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;
          localVideoRef.current.play().catch(() => {});
        }
      }, 100);

      const ch = getSignalChannel(room);
      if (!signalChannelRef.current || signalChannelRef.current.state !== 'joined') {
        ch.subscribe();
        signalChannelRef.current = ch;
      }

      // Tell caller we accepted
      ch.send({ type: 'broadcast', event: 'call_accept', payload: {
        from: user.displayName || user.name, fromColor: user.color,
        fromId: myPeerId.current, room,
      }});

      // Listen for offer from caller
      ch.on('broadcast', { event: 'offer' }, async ({ payload }: any) => {
        if (payload.to !== myPeerId.current) return;
        const peerId = payload.from;
        const pc = createPC(peerId, stream);
        setPeers(p => [...p.filter(x => x.peerId !== peerId), { peerId, name: from, color: fromColor, stream: null, audioOnly: mode === 'audio' }]);
        await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ch.send({ type: 'broadcast', event: 'answer', payload: { to: peerId, from: myPeerId.current, answer } });
      });

      ch.on('broadcast', { event: 'ice' }, async ({ payload }: any) => {
        if (payload.to !== myPeerId.current) return;
        const pc = pcsRef.current[payload.from];
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      });

      ch.on('broadcast', { event: 'call_end' }, ({ payload }: any) => {
        if (payload.room !== room) return;
        endCall();
      });

    } catch {
      alert('Could not access your microphone/camera. Please check permissions.');
    }
  }, [incomingCall, user, createPC, getSignalChannel]);

  // Listen for incoming calls globally
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

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach(t => { t.enabled = muted; });
    setMuted(!muted);
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach(t => { t.enabled = camOff; });
    setCamOff(!camOff);
  };

  const toggleScreenShare = async () => {
    if (sharing) {
      screenStream?.getTracks().forEach(t => t.stop());
      // Restore camera track in all PCs
      const videoTrack = localStream?.getVideoTracks()[0];
      if (videoTrack) {
        Object.values(pcsRef.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          sender?.replaceTrack(videoTrack);
        });
      }
      setScreenStream(null); setSharing(false);
    } else {
      try {
        const ss = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        setScreenStream(ss);
        setSharing(true);
        const screenTrack = ss.getVideoTracks()[0];
        // Replace video track in all peer connections
        Object.values(pcsRef.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          sender?.replaceTrack(screenTrack);
        });
        // Show screen in local preview
        if (localVideoRef.current) localVideoRef.current.srcObject = ss;
        screenTrack.onended = () => toggleScreenShare();
      } catch {}
    }
  };

  // ═══════════════════════════════════════════════════════
  // MESSAGES
  // ═══════════════════════════════════════════════════════
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
  const deleteForAll = async (id: number) => {
    const { error } = await supabase.from('boardroom_messages').delete().eq('id', id);
    if (!error) setMenuMsgId(null);
  };

  const togglePin = async (msg: Message) => {
    await supabase.from('boardroom_messages').update({ pinned: !msg.pinned }).eq('id', msg.id);
    setMenuMsgId(null);
  };

  const addReaction = async (msg: Message, emoji: string) => {
    const existing = msg.reactions || {};
    const users    = existing[emoji] || [];
    const name     = user?.displayName || user?.name || '';
    const updated  = { ...existing, [emoji]: users.includes(name) ? users.filter((n:string) => n !== name) : [...users, name] };
    Object.keys(updated).forEach(k => { if ((updated[k] as string[]).length === 0) delete updated[k]; });
    await supabase.from('boardroom_messages').update({ reactions: updated }).eq('id', msg.id);
    setReactionMsgId(null);
  };

  // ═══════════════════════════════════════════════════════
  // VOICE RECORDING (FIXED)
  // ═══════════════════════════════════════════════════════
  const startRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;
      audioChunksRef.current   = [];
      mr.ondataavailable = e => { if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start(100); // collect every 100ms
      setRecording(true); setRecordSecs(0);
      recordTimerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    } catch { alert('Microphone access denied. Allow microphone in browser settings.'); }
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
        const filename = `${activeRoom}/${Date.now()}.webm`;
        const { data, error } = await supabase.storage.from('voice-messages').upload(filename, blob, { contentType: 'audio/webm' });
        if (!error && data) {
          const { data: u } = supabase.storage.from('voice-messages').getPublicUrl(data.path);
          await supabase.from('boardroom_messages').insert({
            room_id: activeRoom, author_name: user.displayName || user.name,
            author_role: user.role, author_color: user.color,
            message: '🎤 Voice message', message_type: 'audio', audio_url: u.publicUrl,
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

  // ═══════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════
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
    const path = `${user.token}.${ext}`;
    const { data, error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
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
      setUser(data.user);
      await loadProfile(data.user);
      setScreen('app');
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
  const fmtSec  = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
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
    <div style={{ width: size, height: size, background: url ? 'transparent' : color + '20', border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color, fontSize: size * 0.33, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
      {url ? <img src={url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
    </div>
  );

  // ─────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ minHeight: '100vh', background: '#050709', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif', backgroundImage: 'linear-gradient(rgba(0,232,122,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }}>
      <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(0,232,122,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: '#00E87A', color: '#000', fontWeight: 900, fontSize: 18, marginBottom: 16 }}>PS</div>
          <div style={{ color: '#E2EAF4', fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}>ProStack BoardRoom</div>
          <div style={{ color: '#445566', fontSize: 11, marginTop: 6, fontFamily: 'monospace', letterSpacing: '.14em' }}>STAFF ACCESS ONLY · v4.0</div>
        </div>
        <div style={{ background: '#0C1220', border: '1px solid #111D2E', padding: '44px 40px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#00E87A,#00C8FF,#A78BFA,transparent)' }} />
          <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 10, letterSpacing: '.15em', marginBottom: 8 }}>STAFF ACCESS TOKEN</div>
          <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Enter your token</div>
          <div style={{ color: '#8899AA', fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>Each staff member has a unique token. Contact your administrator if you don't have one.</div>
          <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="PSN-XXX-000" autoFocus
            style={{ width: '100%', background: '#080C12', border: `1px solid ${tokenError ? '#FF5757' : '#1A2E48'}`, color: '#E2EAF4', padding: '13px 16px', fontSize: 15, fontFamily: 'monospace', letterSpacing: '.1em', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
          {tokenError && <div style={{ color: '#FF5757', fontSize: 12, fontFamily: 'monospace', marginBottom: 12 }}>⚠ {tokenError}</div>}
          <button onClick={handleLogin} disabled={authLoading}
            style={{ width: '100%', background: '#00E87A', color: '#000', border: 'none', padding: '15px 0', fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            {authLoading ? 'Verifying…' : 'Enter BoardRoom →'}
          </button>
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #111D2E', display: 'flex', justifyContent: 'center', gap: 28 }}>
            {[{ icon: '💬', label: 'Real-time chat' }, { icon: '🎤', label: 'Voice notes' }, { icon: '📞', label: 'P2P Calls' }, { icon: '🖥', label: 'Screen share' }].map(f => (
              <div key={f.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontFamily: 'monospace', color: '#2A4060', fontSize: 9, letterSpacing: '.08em' }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // APP
  // ─────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', background: BG, fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden' }}>

      {/* ── INCOMING CALL OVERLAY ── */}
      {incomingCall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,7,9,.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: BG2, border: '1px solid #1A2E48', padding: '48px 56px', textAlign: 'center', maxWidth: 420, width: '90%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${incomingCall.fromColor},transparent)` }} />
            <div style={{ fontSize: 48, marginBottom: 16 }}>{incomingCall.mode === 'video' ? '📹' : '🎙'}</div>
            <div style={{ fontFamily: 'monospace', color: '#00E87A', fontSize: 10, letterSpacing: '.12em', marginBottom: 12 }}>INCOMING {incomingCall.mode.toUpperCase()} CALL</div>
            <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{incomingCall.from}</div>
            <div style={{ color: '#445566', fontSize: 13, marginBottom: 36 }}>calling in #{incomingCall.room}</div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button onClick={() => setIncomingCall(null)}
                style={{ background: '#FF5757', border: 'none', color: '#fff', padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                📵 Decline
              </button>
              <button onClick={acceptCall}
                style={{ background: '#00E87A', border: 'none', color: '#000', padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                📞 Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <div style={{ width: 228, background: BG2, borderRight: '1px solid #111D2E', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #111D2E' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#00E87A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>PS</div>
            <div>
              <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 13 }}>ProStack NG</div>
              <div style={{ color: '#00E87A', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.08em' }}>● WORKSPACE</div>
            </div>
          </div>
        </div>

        {/* Active call banner */}
        {callActive && (
          <div style={{ margin: '8px 10px 0', background: 'rgba(0,232,122,.07)', border: '1px solid rgba(0,232,122,.2)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#00E87A', fontSize: 10, fontFamily: 'monospace', letterSpacing: '.06em' }}>● {callMode?.toUpperCase()} CALL · #{callRoom}</div>
              <div style={{ color: '#445566', fontSize: 10, marginTop: 2 }}>{peers.length} participant{peers.length !== 1 ? 's' : ''}</div>
            </div>
            <button onClick={endCall} style={{ background: '#FF5757', border: 'none', color: '#fff', padding: '3px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>End</button>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
          <div style={{ padding: '4px 16px 6px', fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em' }}>CHANNELS</div>
          {ROOMS.map(room => (
            <button key={room.id} onClick={() => { setActiveRoom(room.id); setPanel('chat'); setSearchOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: activeRoom === room.id ? 'rgba(0,232,122,.08)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: activeRoom === room.id ? '2px solid #00E87A' : '2px solid transparent', fontFamily: 'Space Grotesk, sans-serif' }}>
              <span style={{ color: activeRoom === room.id ? '#00E87A' : '#445566', fontSize: 13 }}>{room.icon}</span>
              <span style={{ color: activeRoom === room.id ? '#E2EAF4' : '#8899AA', fontSize: 13, fontWeight: activeRoom === room.id ? 600 : 400, flex: 1 }}>{room.name}</span>
            </button>
          ))}
          {pinned.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ padding: '4px 16px 6px', fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em' }}>PINNED · {pinned.length}</div>
              <button onClick={() => setShowPinned(!showPinned)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: showPinned ? 'rgba(245,181,48,.06)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: showPinned ? '2px solid #F5B530' : '2px solid transparent', fontFamily: 'Space Grotesk, sans-serif' }}>
                <span style={{ color: '#F5B530', fontSize: 13 }}>📌</span>
                <span style={{ color: '#8899AA', fontSize: 13 }}>Pinned Messages</span>
              </button>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid #111D2E' }}>
          <button onClick={() => setPanel(p => p === 'settings' ? 'chat' : 'settings')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: panel === 'settings' ? 'rgba(0,232,122,.06)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: panel === 'settings' ? '2px solid #00E87A' : '2px solid transparent', fontFamily: 'Space Grotesk, sans-serif' }}>
            <span style={{ fontSize: 14, color: panel === 'settings' ? '#00E87A' : '#445566' }}>⚙</span>
            <span style={{ color: panel === 'settings' ? '#E2EAF4' : '#8899AA', fontSize: 13 }}>Settings</span>
          </button>
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #111D2E' }}>
            <div style={{ position: 'relative' }}>
              <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={32} />
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 9, height: 9, background: '#00E87A', border: `2px solid ${BG2}`, borderRadius: '50%' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#E2EAF4', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              <div style={{ color: '#445566', fontSize: 10, fontFamily: 'monospace' }}>{user!.role}</div>
            </div>
            <button onClick={() => { endCall(); setScreen('login'); setUser(null); }} style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 15 }}>⎋</button>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #111D2E', background: BG2, flexShrink: 0, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ color: '#00E87A', fontSize: 16, flexShrink: 0 }}>{currentRoom?.icon}</span>
            <span style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{currentRoom?.name}</span>
            <span style={{ color: '#445566', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentRoom?.desc}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(s => !s)}
              style={{ background: searchOpen ? 'rgba(0,232,122,.1)' : BG3, border: `1px solid ${searchOpen ? '#00E87A' : '#1A2E48'}`, color: searchOpen ? '#00E87A' : '#8899AA', padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>🔍</button>
            <button onClick={() => startCall('audio')} disabled={callActive}
              style={{ background: BG3, border: '1px solid #1A2E48', color: callActive ? '#2A4060' : '#00E87A', padding: '6px 13px', cursor: callActive ? 'default' : 'pointer', fontWeight: 600, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
              🎙 Audio
            </button>
            <button onClick={() => startCall('video')} disabled={callActive}
              style={{ background: callActive ? '#1A2E48' : '#00E87A', color: callActive ? '#2A4060' : '#000', border: 'none', padding: '7px 14px', cursor: callActive ? 'default' : 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
              📹 Video
            </button>
          </div>
        </div>

        {/* Search */}
        {searchOpen && (
          <div style={{ padding: '10px 20px', borderBottom: '1px solid #111D2E', background: BG2, display: 'flex', gap: 10, alignItems: 'center' }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search messages…" autoFocus
              style={{ flex: 1, background: BG3, border: '1px solid #1A2E48', color: '#E2EAF4', padding: '9px 14px', fontSize: 13, outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }} />
            {searchQuery && <span style={{ fontFamily: 'monospace', color: '#445566', fontSize: 11 }}>{filteredMsgs.length} result{filteredMsgs.length !== 1 ? 's' : ''}</span>}
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
        )}

        {/* ── ACTIVE CALL PANEL ── */}
        {callActive && (
          <div style={{ borderBottom: '1px solid #111D2E', background: '#000', flexShrink: 0 }}>
            {/* Video grid */}
            <div style={{ display: 'flex', gap: 4, padding: 8, height: callMode === 'video' ? 260 : 80, overflow: 'hidden' }}>
              {/* Local */}
              <div style={{ flex: 1, background: '#0a0a0a', border: '1px solid #1A2E48', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {callMode === 'video' ? (
                  <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={40} />
                    <div style={{ color: '#445566', fontSize: 10, fontFamily: 'monospace', marginTop: 6 }}>YOU</div>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'rgba(0,0,0,.7)', padding: '2px 8px', fontFamily: 'monospace', color: '#00E87A', fontSize: 9 }}>
                  {muted ? '🔇' : '🎙'} {displayName} (you)
                </div>
                {sharing && <div style={{ position: 'absolute', top: 6, right: 8, background: 'rgba(0,232,122,.2)', border: '1px solid #00E87A', padding: '2px 8px', fontFamily: 'monospace', color: '#00E87A', fontSize: 9 }}>SHARING SCREEN</div>}
              </div>

              {/* Remote peers */}
              {peers.map(peer => (
                <div key={peer.peerId} style={{ flex: 1, background: '#0a0a0a', border: '1px solid #1A2E48', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {peer.stream && !peer.audioOnly ? (
                    <video autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      ref={el => { if (el && peer.stream) { el.srcObject = peer.stream; el.play().catch(() => {}); } }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <Avatar name={peer.name} color={peer.color} size={40} />
                      {peer.stream && <audio autoPlay ref={el => { if (el && peer.stream) { el.srcObject = peer.stream; el.play().catch(() => {}); } }} />}
                      <div style={{ color: '#445566', fontSize: 10, fontFamily: 'monospace', marginTop: 6 }}>{peer.audioOnly ? '🎙 AUDIO' : 'NO CAMERA'}</div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'rgba(0,0,0,.7)', padding: '2px 8px', fontFamily: 'monospace', color: peer.color, fontSize: 9 }}>
                    {peer.name}
                  </div>
                </div>
              ))}

              {peers.length === 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2A4060', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, marginBottom: 4 }}>Waiting for others to join…</div>
                  <div style={{ fontSize: 11, color: '#1A3040' }}>Ask your team to click {callMode === 'video' ? '📹 Video' : '🎙 Audio'}</div>
                </div>
              )}
            </div>

            {/* Call controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '8px 0 10px', borderTop: '1px solid #111D2E' }}>
              <button onClick={toggleMute}
                style={{ background: muted ? '#FF5757' : BG3, border: `1px solid ${muted ? '#FF5757' : '#1A2E48'}`, color: muted ? '#fff' : '#8899AA', padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                {muted ? '🔇 Unmute' : '🎙 Mute'}
              </button>
              {callMode === 'video' && (
                <button onClick={toggleCamera}
                  style={{ background: camOff ? '#FF5757' : BG3, border: `1px solid ${camOff ? '#FF5757' : '#1A2E48'}`, color: camOff ? '#fff' : '#8899AA', padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {camOff ? '📷 Cam On' : '📷 Cam Off'}
                </button>
              )}
              <button onClick={toggleScreenShare}
                style={{ background: sharing ? 'rgba(0,232,122,.2)' : BG3, border: `1px solid ${sharing ? '#00E87A' : '#1A2E48'}`, color: sharing ? '#00E87A' : '#8899AA', padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                {sharing ? '🖥 Stop Sharing' : '🖥 Share Screen'}
              </button>
              <button onClick={endCall}
                style={{ background: '#FF5757', border: 'none', color: '#fff', padding: '7px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                📵 End Call
              </button>
            </div>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {panel === 'settings' ? (
          <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px', background: BG }}>
            <div style={{ maxWidth: 580 }}>
              <div style={{ fontFamily: 'monospace', color: '#00E87A', fontSize: 10, letterSpacing: '.15em', marginBottom: 6 }}>WORKSPACE SETTINGS</div>
              <h2 style={{ color: '#E2EAF4', fontWeight: 800, fontSize: 22, margin: '0 0 4px' }}>Settings</h2>
              <div style={{ color: '#445566', fontSize: 13, marginBottom: 28 }}>Manage your profile and preferences</div>

              {/* Profile */}
              <div style={{ background: BG2, border: '1px solid #111D2E', padding: 24, marginBottom: 14, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#00E87A,#00C8FF,transparent)' }} />
                <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em', marginBottom: 18 }}>YOUR PROFILE</div>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                  <div style={{ position: 'relative' }}>
                    <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={64} />
                    <button onClick={() => fileInputRef.current?.click()}
                      style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, background: '#00E87A', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11 }}>
                      {avatarUploading ? '…' : '📷'}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#E2EAF4', fontWeight: 700, fontSize: 16 }}>{displayName}</div>
                    <div style={{ color: user!.color, fontFamily: 'monospace', fontSize: 11, marginTop: 2 }}>{user!.role}</div>
                    <div style={{ color: '#2A4060', fontFamily: 'monospace', fontSize: 10, marginTop: 4 }}>Token: {user!.token}</div>
                    {avatarUploading && <div style={{ color: '#00E87A', fontSize: 11, marginTop: 6, fontFamily: 'monospace' }}>Uploading photo…</div>}
                  </div>
                </div>

                {/* Display name */}
                <div style={{ marginBottom: 4 }}>
                  <div style={{ color: '#445566', fontSize: 11, fontFamily: 'monospace', marginBottom: 6, letterSpacing: '.08em' }}>DISPLAY NAME</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={profileName} onChange={e => setProfileName(e.target.value)}
                      placeholder="Your display name"
                      style={{ flex: 1, background: BG3, border: '1px solid #1A2E48', color: '#E2EAF4', padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }} />
                    <button onClick={saveProfile} disabled={profileSaving}
                      style={{ background: '#00E87A', border: 'none', color: '#000', padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {profileSaving ? '…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div style={{ background: BG2, border: '1px solid #111D2E', padding: 24, marginBottom: 14 }}>
                <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em', marginBottom: 16 }}>PREFERENCES</div>
                {[
                  { label: 'Notification sounds', desc: 'Play a tone when a new message arrives', val: notifSound, set: setNotifSound },
                  { label: 'Compact message view', desc: 'Reduce spacing between messages', val: compactMode, set: setCompact },
                  { label: 'Show timestamps', desc: 'Display time next to every message', val: showTs, set: setShowTs },
                ].map((item, idx, arr) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: idx < arr.length - 1 ? '1px solid #0D1525' : 'none' }}>
                    <div>
                      <div style={{ color: '#E2EAF4', fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ color: '#445566', fontSize: 12, marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <button onClick={() => item.set(!item.val)}
                      style={{ width: 44, height: 24, background: item.val ? '#00E87A' : '#111D2E', borderRadius: 12, position: 'relative', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
                      <div style={{ position: 'absolute', top: 3, left: item.val ? 23 : 3, width: 18, height: 18, background: item.val ? '#000' : '#445566', borderRadius: '50%', transition: 'left .2s' }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Theme */}
              <div style={{ background: BG2, border: '1px solid #111D2E', padding: 24, marginBottom: 14 }}>
                <div style={{ fontFamily: 'monospace', color: '#445566', fontSize: 9, letterSpacing: '.12em', marginBottom: 16 }}>APPEARANCE</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {(['dark', 'darker'] as const).map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      style={{ flex: 1, padding: '14px 12px', background: t === 'dark' ? '#080C12' : '#020305', border: `2px solid ${theme === t ? '#00E87A' : '#1A2E48'}`, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                      <div style={{ color: theme === t ? '#00E87A' : '#445566', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{t}</div>
                      <div style={{ color: '#2A4060', fontSize: 11, marginTop: 4 }}>{t === 'dark' ? 'Default' : 'Extra dark'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign out */}
              <div style={{ background: BG2, border: '1px solid #2A1515', padding: 24 }}>
                <div style={{ fontFamily: 'monospace', color: '#FF5757', fontSize: 9, letterSpacing: '.12em', marginBottom: 16 }}>ACCOUNT</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#E2EAF4', fontSize: 14, fontWeight: 600 }}>Sign out</div>
                    <div style={{ color: '#445566', fontSize: 12, marginTop: 2 }}>You'll need your token to sign back in</div>
                  </div>
                  <button onClick={() => { endCall(); setScreen('login'); setUser(null); }}
                    style={{ background: 'rgba(255,87,87,.1)', border: '1px solid #FF5757', color: '#FF5757', padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
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
              <div style={{ borderBottom: '1px solid #111D2E', background: 'rgba(245,181,48,.04)', padding: '10px 20px', maxHeight: 140, overflow: 'auto' }}>
                <div style={{ fontFamily: 'monospace', color: '#F5B530', fontSize: 9, letterSpacing: '.12em', marginBottom: 8 }}>📌 PINNED</div>
                {pinned.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 5, height: 5, background: '#F5B530', borderRadius: '50%', marginTop: 7, flexShrink: 0 }} />
                    <span style={{ color: '#F5B530', fontSize: 11, fontWeight: 600 }}>{msg.author_name}:</span>
                    <span style={{ color: '#8899AA', fontSize: 12 }}>{msg.message.slice(0, 90)}{msg.message.length > 90 ? '…' : ''}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
              {filteredMsgs.length === 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2A4060', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{currentRoom?.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#445566', marginBottom: 4 }}>#{currentRoom?.name}</div>
                  <div style={{ fontSize: 13 }}>{searchQuery ? 'No messages match.' : 'No messages yet. Start the conversation.'}</div>
                </div>
              )}

              {msgGroups.map(group => (
                <div key={group.date}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 10px' }}>
                    <div style={{ flex: 1, height: 1, background: '#111D2E' }} />
                    <span style={{ fontFamily: 'monospace', color: '#2A4060', fontSize: 9, letterSpacing: '.1em', whiteSpace: 'nowrap' }}>{group.date}</span>
                    <div style={{ flex: 1, height: 1, background: '#111D2E' }} />
                  </div>

                  {group.msgs.map((msg, i) => {
                    const showHeader  = i === 0 || group.msgs[i-1].author_name !== msg.author_name;
                    const isOwn       = msg.author_name === displayName || msg.author_name === user?.name;
                    const reactions   = msg.reactions || {};
                    const hasReact    = Object.keys(reactions).some(k => (reactions[k] as string[]).length > 0);

                    return (
                      <div key={msg.id}
                        onMouseEnter={() => setHoveredMsg(msg.id)}
                        onMouseLeave={() => setHoveredMsg(null)}
                        style={{ display: 'flex', gap: 10, marginTop: showHeader ? (compactMode ? 6 : 14) : (compactMode ? 1 : 2), position: 'relative', padding: '2px 6px 2px 4px', background: hoveredMsg === msg.id ? 'rgba(255,255,255,.015)' : msg.pinned ? 'rgba(245,181,48,.025)' : 'transparent' }}>

                        {showHeader
                          ? <Avatar name={msg.author_name} color={msg.author_color} size={34} />
                          : <div style={{ width: 34, flexShrink: 0 }} />
                        }

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {showHeader && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                              <span style={{ color: msg.author_color, fontWeight: 700, fontSize: 13 }}>{msg.author_name}</span>
                              <span style={{ fontFamily: 'monospace', color: '#2A4060', fontSize: 9 }}>{msg.author_role}</span>
                              {showTs && <span style={{ fontFamily: 'monospace', color: '#2A4060', fontSize: 9 }}>{fmt(msg.created_at)}</span>}
                              {msg.pinned && <span style={{ fontSize: 10 }}>📌</span>}
                            </div>
                          )}

                          {editingId === msg.id ? (
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                              <input value={editText} onChange={e => setEditText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') saveEdit(msg.id); if (e.key === 'Escape') { setEditingId(null); setEditText(''); } }}
                                autoFocus style={{ flex: 1, background: BG3, border: '1px solid #00E87A', color: '#E2EAF4', padding: '8px 12px', fontSize: 14, outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }} />
                              <button onClick={() => saveEdit(msg.id)} style={{ background: '#00E87A', color: '#000', border: 'none', padding: '8px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>Save</button>
                              <button onClick={() => { setEditingId(null); setEditText(''); }} style={{ background: '#111D2E', color: '#8899AA', border: 'none', padding: '8px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>Cancel</button>
                            </div>
                          ) : msg.message_type === 'audio' && msg.audio_url ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: BG3, border: '1px solid #1A2E48', padding: '10px 14px', maxWidth: 320 }}>
                              <span style={{ color: '#00E87A', fontSize: 16 }}>🎤</span>
                              <audio controls src={msg.audio_url} style={{ height: 32, minWidth: 180 }} />
                            </div>
                          ) : (
                            <div style={{ color: '#C8D8E8', fontSize: 14, lineHeight: 1.65, wordBreak: 'break-word' }}>{msg.message}</div>
                          )}

                          {hasReact && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                              {Object.entries(reactions).map(([emoji, users]: [string, any]) =>
                                users.length > 0 && (
                                  <button key={emoji} onClick={() => addReaction(msg, emoji)} title={(users as string[]).join(', ')}
                                    style={{ background: (users as string[]).includes(displayName) ? 'rgba(0,232,122,.15)' : 'rgba(255,255,255,.05)', border: `1px solid ${(users as string[]).includes(displayName) ? 'rgba(0,232,122,.4)' : '#1A2E48'}`, color: '#E2EAF4', padding: '3px 8px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                                    {emoji} <span style={{ fontSize: 11, color: '#8899AA' }}>{(users as string[]).length}</span>
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        {/* Hover actions */}
                        {hoveredMsg === msg.id && editingId !== msg.id && (
                          <div data-menu style={{ position: 'absolute', right: 8, top: 0, display: 'flex', gap: 2, alignItems: 'center', background: BG2, border: '1px solid #1A2E48', padding: '3px 4px', zIndex: 20 }}>

                            {/* React */}
                            <div data-menu style={{ position: 'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setReactionMsgId(reactionMsgId === msg.id ? null : msg.id); setMenuMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 14, padding: '4px 6px' }}>😊</button>
                              {reactionMsgId === msg.id && (
                                <div data-menu onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 4px)', background: BG2, border: '1px solid #1A2E48', padding: '8px', display: 'flex', gap: 5, flexWrap: 'wrap', width: 188, zIndex: 30, boxShadow: '0 8px 24px rgba(0,0,0,.6)' }}>
                                  {REACTIONS.map(emoji => (
                                    <button key={emoji} onClick={() => addReaction(msg, emoji)}
                                      style={{ background: 'none', border: '1px solid #1A2E48', fontSize: 18, padding: '4px 5px', cursor: 'pointer' }}>
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Edit */}
                            {isOwn && msg.message_type === 'text' && (
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.message.replace(' ✎', '')); setMenuMsgId(null); setReactionMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 13, padding: '4px 6px' }}>✎</button>
                            )}

                            {/* More */}
                            <div data-menu style={{ position: 'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setMenuMsgId(menuMsgId === msg.id ? null : msg.id); setReactionMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#445566', cursor: 'pointer', fontSize: 16, padding: '4px 6px' }}>⋯</button>
                              {menuMsgId === msg.id && (
                                <div data-menu onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 4px)', background: BG2, border: '1px solid #1A2E48', minWidth: 210, zIndex: 30, boxShadow: '0 8px 32px rgba(0,0,0,.7)' }}>
                                  <div style={{ padding: '4px 0' }}>
                                    {[
                                      { icon: '📌', label: msg.pinned ? 'Unpin message' : 'Pin message', action: () => togglePin(msg), color: '#C8D8E8' },
                                      { icon: '📋', label: 'Copy text', action: () => { navigator.clipboard?.writeText(msg.message); setMenuMsgId(null); }, color: '#C8D8E8' },
                                    ].map(item => (
                                      <button key={item.label} onClick={item.action}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: item.color, fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                                        <span>{item.icon}</span>{item.label}
                                      </button>
                                    ))}
                                    <div style={{ height: 1, background: '#111D2E', margin: '4px 0' }} />
                                    <button onClick={() => deleteForMe(msg.id)}
                                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#8899AA', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                                      <span>🙈</span> Delete for me
                                    </button>
                                    {isOwn && (
                                      <button onClick={() => deleteForAll(msg.id)}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#FF5757', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
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

            {/* Typing */}
            {typing.length > 0 && (
              <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 4, height: 4, background: '#445566', borderRadius: '50%', animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                </div>
                <span style={{ color: '#445566', fontSize: 12, fontStyle: 'italic' }}>{typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing…</span>
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '10px 16px 12px', borderTop: '1px solid #111D2E', background: BG2, flexShrink: 0 }}>
              {uploading && <div style={{ fontFamily: 'monospace', color: '#00E87A', fontSize: 10, marginBottom: 8, letterSpacing: '.08em' }}>⬆ Uploading voice message…</div>}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
                  disabled={uploading} title="Hold to record voice message"
                  style={{ width: 40, height: 40, background: recording ? '#FF5757' : BG3, border: `1px solid ${recording ? '#FF5757' : '#1A2E48'}`, color: recording ? '#fff' : '#445566', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', userSelect: 'none' }}>
                  🎤
                </button>

                {recording ? (
                  <div style={{ flex: 1, background: BG3, border: '1px solid #FF5757', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 7, height: 7, background: '#FF5757', borderRadius: '50%', animation: 'pulse 1s ease-in-out infinite' }} />
                    <span style={{ color: '#FF5757', fontSize: 10, fontFamily: 'monospace' }}>REC</span>
                    <span style={{ color: '#E2EAF4', fontSize: 14, fontFamily: 'monospace' }}>{fmtSec(recordSecs)}</span>
                    <span style={{ color: '#445566', fontSize: 12 }}>Release to send</span>
                  </div>
                ) : (
                  <input ref={inputRef} value={input} onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={`Message #${currentRoom?.name}…`}
                    style={{ flex: 1, background: BG3, border: '1px solid #1A2E48', color: '#E2EAF4', padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'Space Grotesk, sans-serif' }} />
                )}

                <button onClick={sendMessage} disabled={!input.trim() || sending || recording}
                  style={{ width: 40, height: 40, background: input.trim() && !recording ? '#00E87A' : BG3, border: `1px solid ${input.trim() && !recording ? '#00E87A' : '#111D2E'}`, color: input.trim() && !recording ? '#000' : '#445566', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: input.trim() && !recording ? 'pointer' : 'default' }}>
                  →
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', color: '#2A4060', fontSize: 10, marginTop: 7, letterSpacing: '.04em' }}>
                ENTER to send · Hold 🎤 for voice · Hover message for actions
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}
