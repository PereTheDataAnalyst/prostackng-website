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
  { id: 'announcements', name: 'Announcements', icon: '📢', desc: 'Company-wide announcements', readOnly: true },
  { id: 'general',       name: 'General',       icon: '◈', desc: 'Company-wide updates',     readOnly: false },
  { id: 'engineering',   name: 'Engineering',   icon: '⬡', desc: 'Dev team channel',          readOnly: false },
  { id: 'boardroom',     name: 'BoardRoom',     icon: '▦', desc: 'Executive meetings',        readOnly: false },
  { id: 'ops',           name: 'Operations',    icon: '◎', desc: 'Day-to-day ops',            readOnly: false },
  { id: 'random',        name: 'Random',        icon: '⟁', desc: 'Non-work chat',             readOnly: false },
];

const REACTIONS = ['👍','❤️','😂','🔥','👏','✅','💡','⚡'];

type User = { name: string; role: string; color: string; token: string; displayName?: string; avatarUrl?: string };
type Message = {
  id: number; room_id: string;
  author_name: string; author_role: string; author_color: string;
  message: string; message_type: string; audio_url: string | null;
  reactions: Record<string, string[]> | null;
  pinned: boolean;
  reply_to_id: number | null;
  seen_by: string[];
  created_at: string;
};
type Peer = { peerId: string; name: string; color: string; stream: MediaStream | null; audioOnly: boolean };

const EMOJI_LIST = ['😀','😂','😍','🥰','😎','🤔','😅','🤣','❤️','🔥','👍','👎','🙌','🎉','💯','🚀','✅','⚡','💡','🎯','💪','🤝','👀','😮','😢','😡','🙏','💰','🌍','⭐','📊','📈','🏆','⚠️','🔒','📌','💬','📞','📧','🖥'];

export default function BoardroomPage() {
  const [screen, setScreen]             = useState<'login'|'app'>('login');
  const [tokenInput, setTokenInput]     = useState('');
  const [tokenError, setTokenError]     = useState('');
  const [authLoading, setAuthLoading]   = useState(false);
  const [failCount, setFailCount]       = useState(() => {
    try { return parseInt(localStorage.getItem('psn_br_fails') || '0', 10); } catch { return 0; }
  });
  const [lockUntil, setLockUntil]       = useState<number>(() => {
    try { return parseInt(localStorage.getItem('psn_br_lock') || '0', 10); } catch { return 0; }
  });
  const [lockSecs, setLockSecs]         = useState(0);
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
  const [incomingCall, setIncomingCall] = useState<{from:string;fromColor:string;fromToken:string;mode:'audio'|'video';room:string}|null>(null);
  const [callModal, setCallModal]       = useState<'audio'|'video'|null>(null);
  const [callTargets, setCallTargets]   = useState<string[]>([]);
  const [onlineStaff, setOnlineStaff]   = useState<{token:string;name:string;color:string;role:string}[]>([]);
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
  const imageInputRef                   = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // ── Thread / reply state ───────────────────────────────
  const [replyingTo, setReplyingTo]   = useState<Message|null>(null);
  const [threadParent, setThreadParent] = useState<Message|null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [showThread, setShowThread]   = useState(false);
  const [threadInput, setThreadInput] = useState('');
  const [threadSending, setThreadSending] = useState(false);
  const fileAttachRef                 = useRef<HTMLInputElement>(null);


  const bottomRef                       = useRef<HTMLDivElement>(null);
  const scrollContainerRef              = useRef<HTMLDivElement>(null);
  const inputRef                        = useRef<HTMLInputElement>(null);

  const BG  = theme === 'darker' ? '#020305' : '#04050A';
  const BG2 = theme === 'darker' ? '#060810' : '#07080F';
  const BG3 = theme === 'darker' ? '#080C14' : '#0D0F1E';

  // ── Mobile detection ───────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Lockout countdown ─────────────────────────────────
  useEffect(() => {
    if (lockUntil <= Date.now()) { setLockSecs(0); return; }
    const t = setInterval(() => {
      const rem = Math.ceil((lockUntil - Date.now()) / 1000);
      if (rem <= 0) { setLockSecs(0); clearInterval(t); } else { setLockSecs(rem); }
    }, 1000);
    setLockSecs(Math.ceil((lockUntil - Date.now()) / 1000));
    return () => clearInterval(t);
  }, [lockUntil]);

  const switchRoom = (roomId: string) => {
    setActiveRoom(roomId);
    setPanel('chat');
    setSearchOpen(false);
    setSidebarOpen(false);
    // Always jump to bottom when entering a new room
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'auto' }), 80);
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

  // Smart auto-scroll: only pull to bottom if user is already near the bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 120) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-menu]')) {
        setMenuMsgId(null); setReactionMsgId(null); setShowEmojiPicker(false);
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

  const startCall = useCallback(async (mode: 'audio'|'video', targets?: string[]) => {
    if (!user) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: mode === 'video' ? { width: 1280, height: 720 } : false });
      setLocalStream(stream); setCallActive(true); setCallMode(mode); setCallRoom(activeRoom);
      setTimeout(() => { if (localVideoRef.current) { localVideoRef.current.srcObject = stream; localVideoRef.current.muted = true; localVideoRef.current.play().catch(() => {}); } }, 100);

      // Send invite only to selected targets via their personal incoming channel
      const invitePayload = { from: user.displayName || user.name, fromColor: user.color, fromToken: user.token, fromId: myPeerId.current, mode, room: activeRoom };
      if (targets && targets.length > 0) {
        // Targeted: ring each selected staff on their personal channel
        for (const targetToken of targets) {
          const targetCh = supabase.channel(`incoming-${targetToken}`);
          targetCh.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              targetCh.send({ type: 'broadcast', event: 'call_invite', payload: invitePayload });
              setTimeout(() => supabase.removeChannel(targetCh), 3000);
            }
          });
        }
      }

      const ch = getSignalChannel(activeRoom).subscribe(async (status: string) => {
        if (status !== 'SUBSCRIBED') return;
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
    const { from, fromColor, fromToken, mode, room } = incomingCall;
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

  // ── Presence — track who is online in boardroom ───────────
  useEffect(() => {
    if (screen !== 'app' || !user) return;
    const presenceChannel = supabase.channel('boardroom-presence', {
      config: { presence: { key: user.token } },
    });
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const staff = Object.values(state).flat().map((p: any) => ({
          token: p.token, name: p.name, color: p.color, role: p.role,
        })).filter((s: any) => s.token !== user.token);
        setOnlineStaff(staff as any);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            token: user.token,
            name:  user.displayName || user.name,
            color: user.color,
            role:  user.role,
          });
        }
      });
    return () => { supabase.removeChannel(presenceChannel); };
  }, [screen, user]);

  // ── Thread subscription ─────────────────────────────────
  useEffect(() => {
    if (!showThread || !threadParent || screen !== 'app') return;
    const ch = supabase.channel(`thread-${threadParent.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'boardroom_messages', filter: `reply_to_id=eq.${threadParent.id}` }, (payload) => {
        setThreadMessages(p => [...p, payload.new as Message]);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [showThread, threadParent, screen]);

  // ── Mark room seen when messages load ───────────────────
  useEffect(() => {
    if (messages.length > 0 && user) markRoomSeen(messages);
  }, [activeRoom]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ── Image upload ──────────────────────────────────────
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return; }
    setImageUploading(true);
    const ext = file.name.split('.').pop() || 'jpg';
    const { data, error } = await supabase.storage.from('voice-messages').upload(
      `${activeRoom}/img-${Date.now()}.${ext}`, file, { contentType: file.type, upsert: false }
    );
    if (!error && data) {
      const { data: u } = supabase.storage.from('voice-messages').getPublicUrl(data.path);
      await supabase.from('boardroom_messages').insert({
        room_id: activeRoom, author_name: user.displayName || user.name,
        author_role: user.role, author_color: user.color,
        message: '📷 Image', message_type: 'image', audio_url: u.publicUrl,
        reactions: {}, pinned: false,
      });
    } else if (error) {
      alert('Upload failed. Check storage bucket permissions.');
    }
    setImageUploading(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  
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

  // ── Thread replies ─────────────────────────────────────
  const openThread = useCallback(async (msg: Message) => {
    setThreadParent(msg);
    setShowThread(true);
    const { data } = await supabase.from('boardroom_messages').select('*')
      .eq('reply_to_id', msg.id).order('created_at', { ascending: true });
    setThreadMessages(data || []);
  }, []);

  const sendThreadReply = async () => {
    if (!threadInput.trim() || !user || threadSending || !threadParent) return;
    setThreadSending(true);
    const text = threadInput.trim(); setThreadInput('');
    await supabase.from('boardroom_messages').insert({
      room_id: activeRoom, author_name: user.displayName || user.name,
      author_role: user.role, author_color: user.color,
      message: text, message_type: 'text', audio_url: null,
      reactions: {}, pinned: false, reply_to_id: threadParent.id,
    });
    setThreadSending(false);
  };

  // ── File attachment ─────────────────────────────────────
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 20 * 1024 * 1024) { alert('File must be under 20MB.'); return; }
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const { data, error } = await supabase.storage.from('voice-messages').upload(
      `${activeRoom}/files-${Date.now()}-${safeName}`, file, { contentType: file.type, upsert: false }
    );
    if (!error && data) {
      const { data: u } = supabase.storage.from('voice-messages').getPublicUrl(data.path);
      await supabase.from('boardroom_messages').insert({
        room_id: activeRoom, author_name: user.displayName || user.name,
        author_role: user.role, author_color: user.color,
        message: `📎 ${file.name}`, message_type: 'file', audio_url: u.publicUrl,
        reactions: {}, pinned: false,
      });
    } else if (error) { alert('File upload failed. Check storage bucket permissions.'); }
    setUploading(false);
    if (fileAttachRef.current) fileAttachRef.current.value = '';
  };

  // ── Read receipts ───────────────────────────────────────
  const markRoomSeen = useCallback(async (msgs: Message[]) => {
    if (!user) return;
    const name = user.displayName || user.name;
    // Only mark last 20 messages to limit DB calls
    const recent = msgs.slice(-20).filter(m => m.author_name !== name && !(m.seen_by || []).includes(name));
    if (recent.length === 0) return;
    await Promise.all(recent.map(m =>
      supabase.from('boardroom_messages').update({ seen_by: [...(m.seen_by || []), name] }).eq('id', m.id)
    ));
  }, [user]);

  // ── Auth ───────────────────────────────────────────────
  const handleLogin = async () => {
    if (!tokenInput.trim()) return;
    // Check lockout
    if (lockUntil > Date.now()) return;
    setAuthLoading(true); setTokenError('');
    try {
      const res  = await fetch('/api/boardroom/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tokenInput }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Success — clear fail count
      try { localStorage.removeItem('psn_br_fails'); localStorage.removeItem('psn_br_lock'); } catch {}
      setFailCount(0); setLockUntil(0);
      setUser(data.user); await loadProfile(data.user); setScreen('app');
    } catch (err: any) {
      const newFails = failCount + 1;
      setFailCount(newFails);
      try { localStorage.setItem('psn_br_fails', String(newFails)); } catch {}
      if (newFails >= 5) {
        const until = Date.now() + 5 * 60 * 1000; // 5 min lockout
        setLockUntil(until);
        try { localStorage.setItem('psn_br_lock', String(until)); } catch {}
        setTokenError('Too many failed attempts. Locked for 5 minutes.');
      } else {
        setTokenError(`Invalid token. ${5 - newFails} attempt${5 - newFails === 1 ? '' : 's'} remaining.`);
      }
    }
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
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #131526', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="36" height="30" viewBox="0 0 52 44" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#1E3A8A" opacity=".5"/>
              <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#1D4ED8" opacity=".75"/>
              <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
              <path d="M0 10 L30 10" stroke="#93C5FD" strokeWidth="1.5" opacity=".7"/>
            </svg>
          <div>
            <div style={{ color: '#EEF0FF', fontWeight: 700, fontSize: 13 }}>ProStack NG</div>
            <div style={{ color: '#2563EB', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.08em' }}>● WORKSPACE</div>
          </div>
        </div>
        {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#636687', fontSize: 24, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</button>}
      </div>

      {callActive && (
        <div style={{ margin: '8px 10px 0', background: 'rgba(139,92,246,.07)', border: '1px solid rgba(37,99,235,.2)', padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ color: '#2563EB', fontSize: 9, fontFamily: 'monospace' }}>● {callMode?.toUpperCase()} · #{callRoom}</div>
            <div style={{ color: '#272A45', fontSize: 10, marginTop: 1 }}>{peers.length} participant{peers.length !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={endCall} style={{ background: '#FF5757', border: 'none', color: '#fff', padding: '3px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>End</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <div style={{ padding: '4px 16px 6px', fontFamily: 'monospace', color: '#272A45', fontSize: 9, letterSpacing: '.12em' }}>CHANNELS</div>
        {ROOMS.map(room => (
          <button key={room.id} onClick={() => switchRoom(room.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: activeRoom === room.id ? 'rgba(37,99,235,.08)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: activeRoom === room.id ? '2px solid #2563EB' : '2px solid transparent', fontFamily: 'Instrument Sans, sans-serif' }}>
            <span style={{ color: activeRoom === room.id ? '#2563EB' : '#272A45', fontSize: 14, flexShrink: 0 }}>{room.icon}</span>
            <span style={{ color: activeRoom === room.id ? '#EEF0FF' : '#636687', fontSize: 13, fontWeight: activeRoom === room.id ? 600 : 400, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.name}</span>
          </button>
        ))}
        {pinned.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ padding: '4px 16px 6px', fontFamily: 'monospace', color: '#272A45', fontSize: 9, letterSpacing: '.12em' }}>PINNED · {pinned.length}</div>
            <button onClick={() => setShowPinned(!showPinned)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: showPinned ? 'rgba(245,181,48,.06)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: showPinned ? '2px solid #F5B530' : '2px solid transparent', fontFamily: 'Instrument Sans, sans-serif' }}>
              <span style={{ color: '#F5B530', fontSize: 13 }}>📌</span>
              <span style={{ color: '#636687', fontSize: 13 }}>Pinned Messages</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid #131526', flexShrink: 0 }}>
        <button onClick={() => { setPanel(p => p === 'settings' ? 'chat' : 'settings'); setSidebarOpen(false); }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: panel === 'settings' ? 'rgba(37,99,235,.06)' : 'transparent', border: 'none', cursor: 'pointer', borderLeft: panel === 'settings' ? '2px solid #2563EB' : '2px solid transparent', fontFamily: 'Instrument Sans, sans-serif' }}>
          <span style={{ fontSize: 14, color: panel === 'settings' ? '#2563EB' : '#272A45', flexShrink: 0 }}>⚙</span>
          <span style={{ color: panel === 'settings' ? '#EEF0FF' : '#636687', fontSize: 13 }}>Settings</span>
        </button>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #131526' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={30} />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, background: '#2563EB', border: `2px solid ${BG2}`, borderRadius: '50%' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#EEF0FF', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
            <div style={{ color: '#272A45', fontSize: 10, fontFamily: 'monospace' }}>{user!.role}</div>
          </div>
          <button onClick={() => { endCall(); setScreen('login'); setUser(null); }} style={{ background: 'none', border: 'none', color: '#272A45', cursor: 'pointer', fontSize: 15, flexShrink: 0 }}>⎋</button>
        </div>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ minHeight: '100dvh', background: '#04050A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Sans, sans-serif', backgroundImage: 'linear-gradient(rgba(139,92,246,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.025) 1px,transparent 1px)', backgroundSize: '60px 60px', padding: 16 }}>
      <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(37,99,235,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="62" height="52" viewBox="0 0 52 44" fill="none" style={{ marginBottom: 14 }}>
            <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#1E3A8A" opacity=".5"/>
            <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#1D4ED8" opacity=".75"/>
            <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
            <path d="M0 10 L30 10" stroke="#93C5FD" strokeWidth="1.5" opacity=".7"/>
          </svg>
          <div style={{ color: '#EEF0FF', fontWeight: 800, fontSize: 20, fontFamily: 'Syne, sans-serif', letterSpacing: '-.02em' }}>ProStack BoardRoom</div>
          <div style={{ color: '#272A45', fontSize: 10, marginTop: 6, fontFamily: 'monospace', letterSpacing: '.14em' }}>STAFF ACCESS ONLY · v4.0</div>
        </div>
        <div style={{ background: '#0D0F1E', border: '1px solid #131526', padding: '36px 28px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#2563EB,#EC4899,#3B82F6,transparent)' }} />
          <div style={{ fontFamily: 'monospace', color: '#272A45', fontSize: 10, letterSpacing: '.15em', marginBottom: 8 }}>STAFF ACCESS TOKEN</div>
          <div style={{ color: '#EEF0FF', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Enter your token</div>
          <div style={{ color: '#636687', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>Each staff member has a unique token. Contact your administrator if you don't have one.</div>
          {lockSecs > 0 && (
            <div style={{ background: 'rgba(255,87,87,.08)', border: '1px solid rgba(255,87,87,.3)', padding: '10px 14px', marginBottom: 16, fontFamily: 'monospace', fontSize: 12, color: '#FF5757', letterSpacing: '.06em' }}>
              🔒 Too many attempts — locked for {Math.floor(lockSecs / 60)}:{String(lockSecs % 60).padStart(2, '0')}
            </div>
          )}
          <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !lockSecs && handleLogin()} placeholder="Enter your access token" autoFocus disabled={lockSecs > 0}
            style={{ width: '100%', background: '#07080F', border: `1px solid ${tokenError ? '#FF5757' : '#1B1E35'}`, color: '#EEF0FF', padding: '13px 16px', fontSize: 15, fontFamily: 'monospace', letterSpacing: '.1em', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
          {tokenError && <div style={{ color: '#FF5757', fontSize: 12, fontFamily: 'monospace', marginBottom: 12 }}>⚠ {tokenError}</div>}
          <button onClick={handleLogin} disabled={authLoading || lockSecs > 0}
            style={{ width: '100%', background: '#2563EB', color: '#000', border: 'none', padding: '14px 0', fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>
            {authLoading ? 'Verifying…' : 'Enter BoardRoom →'}
          </button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href="/" style={{ fontFamily: 'monospace', fontSize: 10, color: '#272A45', letterSpacing: '.1em', textDecoration: 'none', textTransform: 'uppercase' }}>
              ← Back to prostackng.com.ng
            </a>
          </div>
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #131526', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[{ icon: '💬', label: 'Real-time chat' }, { icon: '🎤', label: 'Voice notes' }, { icon: '📞', label: 'P2P Calls' }, { icon: '🖥', label: 'Screen share' }].map(f => (
              <div key={f.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontFamily: 'monospace', color: '#131526', fontSize: 9, letterSpacing: '.08em' }}>{f.label}</div>
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
    <div style={{ position: 'fixed', inset: 0, display: 'flex', background: BG, fontFamily: 'Instrument Sans, sans-serif', overflow: 'hidden', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' } as any}>

      {/* ── MOBILE SIDEBAR (fixed, outside flex flow) ── */}
      {isMobile && (
        <>
          {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 98, backdropFilter: 'blur(2px)' }} />
          )}
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: 240,
            background: BG2, borderRight: '1px solid #131526',
            display: 'flex', flexDirection: 'column',
            zIndex: 99,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
            boxShadow: sidebarOpen ? '8px 0 32px rgba(0,0,0,.5)' : 'none',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          } as any}>
            <SidebarContent />
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR (in flex flow) ── */}
      {!isMobile && (
        <div style={{ width: 228, background: BG2, borderRight: '1px solid #131526', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <SidebarContent />
        </div>
      )}

      {/* ── INCOMING CALL ── */}
      {/* ── Call target selector modal ── */}
      {callModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,7,9,.92)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: 16 }}>
          <div style={{ background: '#0D0F1E', border: '1px solid #1B1E35', padding: '32px 24px', maxWidth: 380, width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#2563EB,#EC4899,transparent)' }} />
            <div style={{ fontFamily: 'monospace', color: '#2563EB', fontSize: 10, letterSpacing: '.14em', marginBottom: 12 }}>
              {callModal.toUpperCase()} CALL — SELECT PARTICIPANTS
            </div>
            <p style={{ color: '#636687', fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>
              Select who you want to call. Only selected staff will receive a ring.
              {onlineStaff.length === 0 && ' No other staff currently online.'}
            </p>

            {onlineStaff.length === 0 ? (
              <div style={{ padding: '16px', background: '#07080F', border: '1px solid #131526', marginBottom: 20 }}>
                <p style={{ color: '#272A45', fontSize: 12, fontFamily: 'monospace', letterSpacing: '.08em', margin: 0 }}>
                  No other staff online right now. Start the call anyway to wait for others to join.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {onlineStaff.map(s => (
                  <label key={s.token} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: callTargets.includes(s.token) ? 'rgba(37,99,235,.1)' : '#07080F', border: `1px solid ${callTargets.includes(s.token) ? '#2563EB' : '#131526'}`, cursor: 'pointer', transition: 'all .15s' }}>
                    <input type="checkbox" checked={callTargets.includes(s.token)}
                      onChange={e => setCallTargets(prev => e.target.checked ? [...prev, s.token] : prev.filter(t => t !== s.token))}
                      style={{ accentColor: '#2563EB', width: 14, height: 14, flexShrink: 0 }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}80` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#EEF0FF', fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ color: '#272A45', fontSize: 10, fontFamily: 'monospace', letterSpacing: '.08em' }}>{s.role}</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,.6)' }} />
                  </label>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setCallModal(null); setCallTargets([]); }}
                style={{ flex: 1, background: 'transparent', border: '1px solid #1B1E35', color: '#636687', padding: '12px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Instrument Sans, sans-serif' }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  const mode = callModal;
                  const targets = callTargets.length > 0 ? callTargets : undefined;
                  setCallModal(null); setCallTargets([]);
                  startCall(mode, targets);
                }}
                style={{ flex: 2, background: '#2563EB', border: 'none', color: '#000', padding: '12px 0', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Instrument Sans, sans-serif' }}>
                {callModal === 'video' ? '📹' : '🎙'} {callTargets.length > 0 ? `Call ${callTargets.length} person${callTargets.length > 1 ? 's' : ''}` : 'Start call (no ring)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {incomingCall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,7,9,.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: 16 }}>
          <div style={{ background: BG2, border: '1px solid #1B1E35', padding: '40px 28px', textAlign: 'center', maxWidth: 360, width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${incomingCall.fromColor},transparent)` }} />
            <div style={{ fontSize: 44, marginBottom: 14 }}>{incomingCall.mode === 'video' ? '📹' : '🎙'}</div>
            <div style={{ fontFamily: 'monospace', color: '#2563EB', fontSize: 10, letterSpacing: '.12em', marginBottom: 10 }}>INCOMING {incomingCall.mode.toUpperCase()} CALL</div>
            <div style={{ color: '#EEF0FF', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{incomingCall.from}</div>
            <div style={{ color: '#272A45', fontSize: 13, marginBottom: 32 }}>calling in #{incomingCall.room}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setIncomingCall(null)} style={{ flex: 1, background: '#FF5757', border: 'none', color: '#fff', padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>📵 Decline</button>
              <button onClick={acceptCall} style={{ flex: 1, background: '#2563EB', border: 'none', color: '#000', padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>📞 Accept</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MAIN — takes all space after sidebar ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, width: 0 }}>

        {/* HEADER */}
        <div style={{ height: 50, display: 'flex', alignItems: 'center', borderBottom: '1px solid #131526', background: BG2, flexShrink: 0, padding: '0 10px', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#636687', fontSize: 20, cursor: 'pointer', padding: '2px 4px', flexShrink: 0 }}>☰</button>
            )}
            <span style={{ color: '#2563EB', fontSize: 14, flexShrink: 0 }}>{currentRoom?.icon}</span>
            <span style={{ color: '#EEF0FF', fontWeight: 700, fontSize: 14, flexShrink: 0, whiteSpace: 'nowrap' }}>{currentRoom?.name}</span>
            {!isMobile && <span style={{ color: '#272A45', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentRoom?.desc}</span>}
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(s => !s)}
              style={{ width: 32, height: 32, background: searchOpen ? 'rgba(37,99,235,.07)' : 'transparent', border: `1px solid ${searchOpen ? '#2563EB' : '#1B1E35'}`, color: searchOpen ? '#2563EB' : '#636687', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔍</button>
            <button onClick={() => !callActive && setCallModal('audio')} disabled={callActive}
              style={{ height: 32, padding: isMobile ? '0 8px' : '0 10px', background: 'transparent', border: '1px solid #1B1E35', color: callActive ? '#131526' : '#2563EB', cursor: callActive ? 'default' : 'pointer', fontWeight: 600, fontSize: 12, fontFamily: 'Instrument Sans, sans-serif', flexShrink: 0 }}>
              {isMobile ? '🎙' : '🎙 Audio'}
            </button>
            <button onClick={() => !callActive && setCallModal('video')} disabled={callActive}
              style={{ height: 32, padding: isMobile ? '0 8px' : '0 10px', background: callActive ? '#1B1E35' : '#2563EB', color: callActive ? '#131526' : '#000', border: 'none', cursor: callActive ? 'default' : 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Instrument Sans, sans-serif', flexShrink: 0 }}>
              {isMobile ? '📹' : '📹 Video'}
            </button>
          </div>
        </div>

        {/* Search */}
        {searchOpen && (
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #131526', background: BG2, display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search messages…" autoFocus
              style={{ flex: 1, background: BG3, border: '1px solid #1B1E35', color: '#EEF0FF', padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'Instrument Sans, sans-serif', minWidth: 0 }} />
            {searchQuery && <span style={{ color: '#272A45', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>{filteredMsgs.length} found</span>}
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: '#272A45', cursor: 'pointer', fontSize: 20, flexShrink: 0 }}>×</button>
          </div>
        )}

        {/* Call panel */}
        {callActive && (
          <div style={{ borderBottom: '1px solid #131526', background: '#000', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 3, padding: 6, height: callMode === 'video' ? (isMobile ? 170 : 230) : 68 }}>
              <div style={{ flex: 1, background: '#0A0A0A', border: '1px solid #1B1E35', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {callMode === 'video'
                  ? <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                  : <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={34} />
                }
                <div style={{ position: 'absolute', bottom: 4, left: 6, background: 'rgba(0,0,0,.75)', padding: '2px 6px', fontFamily: 'monospace', color: '#2563EB', fontSize: 9 }}>{muted ? '🔇' : '🎙'} You</div>
              </div>
              {peers.map(peer => (
                <div key={peer.peerId} style={{ flex: 1, background: '#0A0A0A', border: '1px solid #1B1E35', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {peer.stream && !peer.audioOnly
                    ? <video autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} ref={el => { if (el && peer.stream) { el.srcObject = peer.stream; el.play().catch(() => {}); } }} />
                    : <div><Avatar name={peer.name} color={peer.color} size={34} />{peer.stream && <audio autoPlay ref={el => { if (el && peer.stream) { el.srcObject = peer.stream; el.play().catch(() => {}); } }} />}</div>
                  }
                  <div style={{ position: 'absolute', bottom: 4, left: 6, background: 'rgba(0,0,0,.75)', padding: '2px 6px', fontFamily: 'monospace', color: peer.color, fontSize: 9 }}>{peer.name}</div>
                </div>
              ))}
              {peers.length === 0 && <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#131526', fontSize: 11, fontFamily: 'monospace', textAlign: 'center' }}>Waiting for others…</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: '5px 8px 7px', borderTop: '1px solid #131526', flexWrap: 'wrap' }}>
              {[
                { label: muted ? '🔇 Unmute' : '🎙 Mute', action: toggleMute, active: muted },
                ...(callMode === 'video' ? [{ label: camOff ? '📷 On' : '📷 Off', action: toggleCamera, active: camOff }] : []),
                { label: sharing ? '🖥 Stop' : '🖥 Share', action: toggleScreenShare, active: sharing },
                { label: '📵 End', action: endCall, danger: true },
              ].map((btn: any) => (
                <button key={btn.label} onClick={btn.action}
                  style={{ background: btn.danger ? '#FF5757' : btn.active ? 'rgba(37,99,235,.1)' : BG3, border: `1px solid ${btn.danger ? '#FF5757' : btn.active ? '#2563EB' : '#1B1E35'}`, color: btn.danger ? '#fff' : btn.active ? '#2563EB' : '#636687', padding: '5px 11px', cursor: 'pointer', fontSize: 11, fontFamily: 'Instrument Sans, sans-serif', fontWeight: btn.danger ? 700 : 400, whiteSpace: 'nowrap' }}>
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
              <div style={{ fontFamily: 'monospace', color: '#2563EB', fontSize: 10, letterSpacing: '.15em', marginBottom: 4 }}>WORKSPACE SETTINGS</div>
              <h2 style={{ color: '#EEF0FF', fontWeight: 800, fontSize: 20, margin: '0 0 4px' }}>Settings</h2>
              <div style={{ color: '#272A45', fontSize: 13, marginBottom: 22 }}>Manage your profile and preferences</div>

              <div style={{ background: BG2, border: '1px solid #131526', padding: 18, marginBottom: 10, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#2563EB,#EC4899,transparent)' }} />
                <div style={{ fontFamily: 'monospace', color: '#272A45', fontSize: 9, letterSpacing: '.12em', marginBottom: 14 }}>YOUR PROFILE</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar name={displayName} color={user!.color} url={user?.avatarUrl} size={58} />
                    <button onClick={() => fileInputRef.current?.click()}
                      style={{ position: 'absolute', bottom: -3, right: -3, width: 22, height: 22, background: '#2563EB', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11 }}>
                      {avatarUploading ? '…' : '📷'}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#EEF0FF', fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                    <div style={{ color: '#3B82F6', fontFamily: 'monospace', fontSize: 11, marginTop: 2 }}>{user!.role}</div>
                    <div style={{ color: '#131526', fontFamily: 'monospace', fontSize: 10, marginTop: 3 }}>{user!.token}</div>
                    {avatarUploading && <div style={{ color: '#2563EB', fontSize: 11, marginTop: 3, fontFamily: 'monospace' }}>Uploading…</div>}
                  </div>
                </div>
                <div style={{ color: '#272A45', fontSize: 10, fontFamily: 'monospace', marginBottom: 6, letterSpacing: '.08em' }}>DISPLAY NAME</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your display name"
                    style={{ flex: 1, minWidth: 0, background: BG3, border: '1px solid #1B1E35', color: '#EEF0FF', padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Instrument Sans, sans-serif' }} />
                  <button onClick={saveProfile} disabled={profileSaving}
                    style={{ background: '#2563EB', border: 'none', color: '#000', padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif', flexShrink: 0 }}>
                    {profileSaving ? '…' : 'Save'}
                  </button>
                </div>
              </div>

              <div style={{ background: BG2, border: '1px solid #131526', padding: 18, marginBottom: 10 }}>
                <div style={{ fontFamily: 'monospace', color: '#272A45', fontSize: 9, letterSpacing: '.12em', marginBottom: 12 }}>PREFERENCES</div>
                {[
                  { label: 'Notification sounds', desc: 'Tone when a message arrives', val: notifSound, set: setNotifSound },
                  { label: 'Compact view', desc: 'Reduce spacing between messages', val: compactMode, set: setCompact },
                  { label: 'Show timestamps', desc: 'Time next to each message', val: showTs, set: setShowTs },
                ].map((item, idx, arr) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: idx < arr.length - 1 ? '1px solid #0D1525' : 'none' }}>
                    <div style={{ paddingRight: 10 }}>
                      <div style={{ color: '#EEF0FF', fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ color: '#272A45', fontSize: 12, marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <button onClick={() => item.set(!item.val)}
                      style={{ width: 44, height: 24, background: item.val ? '#2563EB' : '#131526', borderRadius: 12, position: 'relative', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
                      <div style={{ position: 'absolute', top: 3, left: item.val ? 23 : 3, width: 18, height: 18, background: item.val ? '#000' : '#272A45', borderRadius: '50%', transition: 'left .2s' }} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ background: BG2, border: '1px solid #131526', padding: 18, marginBottom: 10 }}>
                <div style={{ fontFamily: 'monospace', color: '#272A45', fontSize: 9, letterSpacing: '.12em', marginBottom: 12 }}>APPEARANCE</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['dark','darker'] as const).map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      style={{ flex: 1, padding: '12px 8px', background: t === 'dark' ? '#07080F' : '#020305', border: `2px solid ${theme === t ? '#2563EB' : '#1B1E35'}`, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>
                      <div style={{ color: theme === t ? '#2563EB' : '#272A45', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{t}</div>
                      <div style={{ color: '#131526', fontSize: 11, marginTop: 3 }}>{t === 'dark' ? 'Default' : 'Extra dark'}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: BG2, border: '1px solid #2A1515', padding: 18 }}>
                <div style={{ fontFamily: 'monospace', color: '#FF5757', fontSize: 9, letterSpacing: '.12em', marginBottom: 12 }}>ACCOUNT</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ color: '#EEF0FF', fontSize: 13, fontWeight: 600 }}>Sign out</div>
                    <div style={{ color: '#272A45', fontSize: 12, marginTop: 2 }}>You'll need your token to sign back in</div>
                  </div>
                  <button onClick={() => { endCall(); setScreen('login'); setUser(null); }}
                    style={{ background: 'rgba(255,87,87,.1)', border: '1px solid #FF5757', color: '#FF5757', padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
              <div style={{ borderBottom: '1px solid #131526', background: 'rgba(245,181,48,.04)', padding: '8px 14px', maxHeight: 110, overflowY: 'auto', flexShrink: 0 }}>
                <div style={{ fontFamily: 'monospace', color: '#F5B530', fontSize: 9, letterSpacing: '.12em', marginBottom: 6 }}>📌 PINNED</div>
                {pinned.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 5, height: 5, background: '#F5B530', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
                    <span style={{ color: '#F5B530', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{msg.author_name}: </span>
                    <span style={{ color: '#636687', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message.slice(0,80)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── MESSAGES with wallpaper directly on container ── */}
            <div ref={scrollContainerRef} style={{
              flex: 1, overflowY: 'auto', overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              padding: '10px 12px', display: 'flex', flexDirection: 'column',
              position: 'relative',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Crect width='60' height='60' fill='%23050507'/%3E%3Ccircle cx='30' cy='30' r='1.2' fill='%232563EB' opacity='0.13'/%3E%3Ccircle cx='0' cy='0' r='0.9' fill='%232563EB' opacity='0.09'/%3E%3Ccircle cx='60' cy='0' r='0.9' fill='%232563EB' opacity='0.09'/%3E%3Ccircle cx='0' cy='60' r='0.9' fill='%232563EB' opacity='0.09'/%3E%3Ccircle cx='60' cy='60' r='0.9' fill='%232563EB' opacity='0.09'/%3E%3Ccircle cx='30' cy='0' r='0.6' fill='%2300C8FF' opacity='0.07'/%3E%3Ccircle cx='0' cy='30' r='0.6' fill='%2300C8FF' opacity='0.07'/%3E%3Ccircle cx='60' cy='30' r='0.6' fill='%2300C8FF' opacity='0.07'/%3E%3Ccircle cx='30' cy='60' r='0.6' fill='%2300C8FF' opacity='0.07'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23p)'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
              backgroundRepeat: 'repeat',
            }}>
              {/* Stack logo watermark — centered, faint, non-interactive */}
              <div style={{ position: 'sticky', top: 0, height: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 0, display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', opacity: 0.028 }}>
                  <svg width="340" height="286" viewBox="0 0 52 44" fill="none">
                    <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#2563EB" opacity=".5"/>
                    <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#2563EB" opacity=".75"/>
                    <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
                    <path d="M0 10 L30 10" stroke="#93C5FD" strokeWidth="1.5" opacity=".7"/>
                  </svg>
                </div>
              </div>

              {filteredMsgs.length === 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#131526', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>{currentRoom?.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#272A45', marginBottom: 4 }}>#{currentRoom?.name}</div>
                  <div style={{ fontSize: 13 }}>{searchQuery ? 'No messages match.' : 'No messages yet. Say hello!'}</div>
                </div>
              )}

              {msgGroups.map(group => (
                <div key={group.date} style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 10px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.05)' }} />
                    <span style={{ fontFamily: 'monospace', color: '#272A45', fontSize: 9, letterSpacing: '.1em', whiteSpace: 'nowrap', background: BG, padding: '2px 10px', border: '1px solid #131526' }}>{group.date}</span>
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
                              <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{msg.author_name}</span>
                              <span style={{ fontFamily: 'monospace', color: '#3A5070', fontSize: 9 }}>{msg.author_role}</span>
                              {showTs && <span style={{ fontFamily: 'monospace', color: '#3A5070', fontSize: 9 }}>{fmt(msg.created_at)}</span>}
                              {msg.pinned && <span>📌</span>}
                            </div>
                          )}

                          {editingId === msg.id ? (
                            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                              <input value={editText} onChange={e => setEditText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') saveEdit(msg.id); if (e.key === 'Escape') { setEditingId(null); setEditText(''); } }}
                                autoFocus style={{ flex: 1, minWidth: 100, background: BG3, border: '1px solid #2563EB', color: '#EEF0FF', padding: '7px 10px', fontSize: 13, outline: 'none', fontFamily: 'Instrument Sans, sans-serif' }} />
                              <button onClick={() => saveEdit(msg.id)} style={{ background: '#2563EB', color: '#000', border: 'none', padding: '7px 12px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>Save</button>
                              <button onClick={() => { setEditingId(null); setEditText(''); }} style={{ background: '#131526', color: '#636687', border: 'none', padding: '7px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>✕</button>
                            </div>
                          ) : msg.message_type === 'audio' && msg.audio_url ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(12,18,32,0.9)', border: '1px solid #1B1E35', padding: '8px 12px', maxWidth: '100%' }}>
                              <span style={{ color: '#2563EB', fontSize: 15, flexShrink: 0 }}>🎤</span>
                              <audio controls src={msg.audio_url} style={{ height: 28, maxWidth: 'calc(100vw - 180px)' }} />
                            </div>
                          ) : msg.message_type === 'image' && msg.audio_url ? (
                            <div style={{ display: 'inline-block', maxWidth: isMobile ? '85vw' : 360, background: 'rgba(12,18,32,0.9)', border: '1px solid #1B1E35', padding: 6, cursor: 'pointer' }}
                              onClick={() => window.open(msg.audio_url!, '_blank')}>
                              <img src={msg.audio_url} alt="shared image" style={{ width: '100%', display: 'block', maxHeight: 320, objectFit: 'contain' }} />
                              <div style={{ color: '#272A45', fontSize: 10, fontFamily: 'monospace', padding: '4px 2px 0' }}>🖼 Click to open full size</div>
                            </div>
                          ) : msg.message_type === 'file' && msg.audio_url ? (
                            <a href={msg.audio_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(12,18,32,0.9)', border: '1px solid #1B1E35', padding: '10px 14px', textDecoration: 'none', maxWidth: isMobile ? '85vw' : 360 }}>
                              <span style={{ fontSize: 22, flexShrink: 0 }}>
                                {msg.message.includes('.pdf') ? '📄' : msg.message.includes('.doc') ? '📝' : msg.message.includes('.xl') || msg.message.includes('.csv') ? '📊' : msg.message.includes('.zip') || msg.message.includes('.rar') ? '🗜' : '📎'}
                              </span>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ color: '#D0E0F0', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '60vw' : 260 }}>{msg.message.replace('📎 ', '')}</div>
                                <div style={{ color: '#2563EB', fontSize: 10, fontFamily: 'monospace', marginTop: 2 }}>Click to download →</div>
                              </div>
                            </a>
                          ) : (
                            <>
                              {/* Reply-to quote */}
                              {msg.reply_to_id && (() => {
                                const parent = messages.find(m => m.id === msg.reply_to_id);
                                return parent ? (
                                  <div style={{ borderLeft: `2px solid ${parent.author_color}`, paddingLeft: 8, marginBottom: 5, opacity: .65, cursor: 'pointer' }} onClick={() => openThread(parent)}>
                                    <div style={{ color: parent.author_color, fontSize: 11, fontWeight: 600 }}>{parent.author_name}</div>
                                    <div style={{ color: '#636687', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '60vw' : 340 }}>{parent.message.slice(0, 80)}</div>
                                  </div>
                                ) : null;
                              })()}
                            <div style={{
                              display: 'inline-block', maxWidth: '85%',
                              background: isOwn ? 'rgba(139,92,246,.09)' : 'rgba(12,18,32,0.82)',
                              border: `1px solid ${isOwn ? 'rgba(139,92,246,.18)' : 'rgba(255,255,255,.05)'}`,
                              padding: '7px 12px', wordBreak: 'break-word',
                              color: '#D0E0F0', fontSize: 14, lineHeight: 1.6,
                            }}>
                              {msg.message}
                            </div>
                            </>
                          )}

                          {hasReact && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                              {Object.entries(reactions).map(([emoji, users]: [string, any]) =>
                                (users as string[]).length > 0 && (
                                  <button key={emoji} onClick={() => addReaction(msg, emoji)} title={(users as string[]).join(', ')}
                                    style={{ background: (users as string[]).includes(displayName) ? 'rgba(37,99,235,.1)' : 'rgba(12,18,32,.8)', border: `1px solid ${(users as string[]).includes(displayName) ? 'rgba(37,99,235,.35)' : '#1B1E35'}`, color: '#EEF0FF', padding: '2px 7px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Instrument Sans, sans-serif' }}>
                                    {emoji} <span style={{ fontSize: 11, color: '#636687' }}>{(users as string[]).length}</span>
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          {/* Thread reply count */}
                          {!msg.reply_to_id && (() => {
                            const replyCount = messages.filter(m => m.reply_to_id === msg.id).length;
                            return replyCount > 0 ? (
                              <button onClick={() => openThread(msg)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 11, cursor: 'pointer', padding: '3px 0', fontFamily: 'Instrument Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                                💬 {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                              </button>
                            ) : null;
                          })()}

                          {/* Read receipts — only on own messages */}
                          {isOwn && (msg.seen_by || []).filter((n: string) => n !== displayName).length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                              <span style={{ color: '#2563EB', fontSize: 10 }}>✓✓</span>
                              <span style={{ color: '#272A45', fontSize: 10, fontFamily: 'monospace' }}>
                                Seen by {(msg.seen_by || []).filter((n: string) => n !== displayName).join(', ')}
                              </span>
                            </div>
                          )}

                          {/* Mobile actions */}
                          {isMobile && (
                            <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                              <button data-menu onClick={e => { e.stopPropagation(); setReactionMsgId(reactionMsgId === msg.id ? null : msg.id); setMenuMsgId(null); }}
                                style={{ background: 'rgba(12,18,32,.8)', border: '1px solid #1B1E35', color: '#272A45', cursor: 'pointer', fontSize: 12, padding: '3px 7px' }}>😊</button>
                              <button onClick={() => openThread(msg)}
                                style={{ background: 'rgba(12,18,32,.8)', border: '1px solid #1B1E35', color: '#272A45', cursor: 'pointer', fontSize: 12, padding: '3px 7px' }}>↩</button>
                              {isOwn && msg.message_type === 'text' && (
                                <button onClick={() => { setEditingId(msg.id); setEditText(msg.message.replace(' ✎','')); }}
                                  style={{ background: 'rgba(12,18,32,.8)', border: '1px solid #1B1E35', color: '#272A45', cursor: 'pointer', fontSize: 12, padding: '3px 7px' }}>✎</button>
                              )}
                              <button data-menu onClick={e => { e.stopPropagation(); setMenuMsgId(menuMsgId === msg.id ? null : msg.id); setReactionMsgId(null); }}
                                style={{ background: 'rgba(12,18,32,.8)', border: '1px solid #1B1E35', color: '#272A45', cursor: 'pointer', fontSize: 12, padding: '3px 7px' }}>⋯</button>
                            </div>
                          )}

                          {reactionMsgId === msg.id && (
                            <div data-menu onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 4, flexWrap: 'wrap', background: BG2, border: '1px solid #1B1E35', padding: 8, marginTop: 5, width: 'fit-content', zIndex: 30, boxShadow: '0 4px 20px rgba(0,0,0,.6)' }}>
                              {REACTIONS.map(emoji => <button key={emoji} onClick={() => addReaction(msg, emoji)} style={{ background: 'none', border: '1px solid #1B1E35', fontSize: 18, padding: '4px 5px', cursor: 'pointer' }}>{emoji}</button>)}
                            </div>
                          )}

                          {menuMsgId === msg.id && (
                            <div data-menu onClick={e => e.stopPropagation()} style={{ background: BG2, border: '1px solid #1B1E35', width: 196, zIndex: 30, boxShadow: '0 8px 24px rgba(0,0,0,.7)', marginTop: 4 }}>
                              <div style={{ padding: '4px 0' }}>
                                <button onClick={() => togglePin(msg)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>📌 {msg.pinned ? 'Unpin' : 'Pin message'}</button>
                                <button onClick={() => { navigator.clipboard?.writeText(msg.message); setMenuMsgId(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>📋 Copy text</button>
                                <div style={{ height: 1, background: '#131526', margin: '4px 0' }} />
                                <button onClick={() => deleteForMe(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#636687', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>🙈 Delete for me</button>
                                {isOwn && <button onClick={() => deleteForAll(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', background: 'none', border: 'none', color: '#FF5757', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>🗑 Delete for everyone</button>}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Desktop hover actions */}
                        {!isMobile && hoveredMsg === msg.id && editingId !== msg.id && (
                          <div data-menu style={{ position: 'absolute', right: 6, top: 0, display: 'flex', gap: 2, background: BG2, border: '1px solid #1B1E35', padding: '3px 4px', zIndex: 20, boxShadow: '0 2px 12px rgba(0,0,0,.5)' }}>
                            <div data-menu style={{ position: 'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setReactionMsgId(reactionMsgId === msg.id ? null : msg.id); setMenuMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#272A45', cursor: 'pointer', fontSize: 14, padding: '4px 6px' }}>😊</button>
                              {reactionMsgId === msg.id && (
                                <div data-menu style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 4px)', background: BG2, border: '1px solid #1B1E35', padding: 8, display: 'flex', gap: 5, flexWrap: 'wrap', width: 188, zIndex: 30, boxShadow: '0 8px 24px rgba(0,0,0,.6)' }}>
                                  {REACTIONS.map(emoji => <button key={emoji} onClick={() => addReaction(msg, emoji)} style={{ background: 'none', border: '1px solid #1B1E35', fontSize: 18, padding: '4px 5px', cursor: 'pointer' }}>{emoji}</button>)}
                                </div>
                              )}
                            </div>
                            <button onClick={() => { openThread(msg); setMenuMsgId(null); setReactionMsgId(null); }}
                              title="Reply in thread"
                              style={{ background: 'none', border: 'none', color: '#272A45', cursor: 'pointer', fontSize: 13, padding: '4px 6px' }}>↩</button>
                            {isOwn && msg.message_type === 'text' && (
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.message.replace(' ✎','')); setMenuMsgId(null); setReactionMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#272A45', cursor: 'pointer', fontSize: 13, padding: '4px 6px' }}>✎</button>
                            )}
                            <div data-menu style={{ position: 'relative' }}>
                              <button onClick={e => { e.stopPropagation(); setMenuMsgId(menuMsgId === msg.id ? null : msg.id); setReactionMsgId(null); }}
                                style={{ background: 'none', border: 'none', color: '#272A45', cursor: 'pointer', fontSize: 16, padding: '4px 6px' }}>⋯</button>
                              {menuMsgId === msg.id && (
                                <div data-menu style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 4px)', background: BG2, border: '1px solid #1B1E35', minWidth: 200, zIndex: 30, boxShadow: '0 8px 32px rgba(0,0,0,.7)' }}>
                                  <div style={{ padding: '4px 0' }}>
                                    <button onClick={() => togglePin(msg)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>📌 {msg.pinned ? 'Unpin' : 'Pin message'}</button>
                                    <button onClick={() => { navigator.clipboard?.writeText(msg.message); setMenuMsgId(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#C8D8E8', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>📋 Copy text</button>
                                    <div style={{ height: 1, background: '#131526', margin: '4px 0' }} />
                                    <button onClick={() => deleteForMe(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#636687', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>🙈 Delete for me</button>
                                    {isOwn && <button onClick={() => deleteForAll(msg.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', color: '#FF5757', fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif' }}>🗑 Delete for everyone</button>}
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
                  {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, background: '#272A45', borderRadius: '50%', animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                </div>
                <span style={{ color: '#272A45', fontSize: 12, fontStyle: 'italic' }}>{typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing…</span>
              </div>
            )}

            {/* Input bar */}
            <div style={{ padding: '8px 10px 10px', borderTop: '1px solid #131526', background: BG2, flexShrink: 0, position: 'relative' }}>
              {(uploading || imageUploading) && <div style={{ fontFamily: 'monospace', color: '#2563EB', fontSize: 10, marginBottom: 6 }}>⬆ {imageUploading ? 'Uploading image…' : 'Uploading file…'}</div>}

              {/* Announcements channel — read-only for non-CEO */}
              {currentRoom?.readOnly && user?.role !== 'CEO' ? (
                <div style={{ background: 'rgba(245,181,48,.04)', border: '1px solid rgba(245,181,48,.15)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📢</span>
                  <span style={{ color: '#636687', fontSize: 13 }}>Only admins can post in <strong style={{ color: '#F5B530' }}>#Announcements</strong>.</span>
                </div>
              ) : (
                <>
              {/* Emoji picker */}
              {showEmojiPicker && (
                <div data-menu style={{ position: 'absolute', bottom: '100%', left: 10, right: 10, background: BG2, border: '1px solid #1B1E35', padding: 12, zIndex: 50, boxShadow: '0 -8px 32px rgba(0,0,0,.6)', marginBottom: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: 4 }}>
                    {EMOJI_LIST.map(emoji => (
                      <button key={emoji}
                        data-menu
                        type="button"
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setInput(p => p + emoji); setShowEmojiPicker(false); setTimeout(() => { const el = inputRef.current; if (el) { el.focus(); const len = el.value.length; el.setSelectionRange(len, len); } }, 0); }}
                        style={{ background: 'none', border: '1px solid #131526', fontSize: 22, padding: '5px', cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%', minWidth: 0 }}>
                {/* Emoji button */}
                <button data-menu onClick={() => setShowEmojiPicker(p => !p)}
                  style={{ width: 36, height: 36, background: showEmojiPicker ? 'rgba(37,99,235,.07)' : BG3, border: `1px solid ${showEmojiPicker ? '#2563EB' : '#1B1E35'}`, color: showEmojiPicker ? '#2563EB' : '#272A45', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>😊</button>

                {/* Image upload */}
                <input ref={imageInputRef} type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
                <button onClick={() => imageInputRef.current?.click()} disabled={imageUploading}
                  title="Send image"
                  style={{ width: 36, height: 36, background: BG3, border: '1px solid #1B1E35', color: '#272A45', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>🖼</button>

                {/* File attachment */}
                <input ref={fileAttachRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.zip,.rar" onChange={uploadFile} style={{ display: 'none' }} />
                <button onClick={() => fileAttachRef.current?.click()} disabled={uploading}
                  title="Attach file (PDF, Word, Excel…)"
                  style={{ width: 36, height: 36, background: BG3, border: '1px solid #1B1E35', color: '#272A45', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>📎</button>

                {/* Voice */}
                <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
                  disabled={uploading} title="Hold to record"
                  style={{ width: 36, height: 36, background: recording ? '#FF5757' : BG3, border: `1px solid ${recording ? '#FF5757' : '#1B1E35'}`, color: recording ? '#fff' : '#272A45', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}>🎤</button>

                {recording ? (
                  <div style={{ flex: 1, background: BG3, border: '1px solid #FF5757', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <div style={{ width: 6, height: 6, background: '#FF5757', borderRadius: '50%', animation: 'pulse 1s ease-in-out infinite', flexShrink: 0 }} />
                    <span style={{ color: '#FF5757', fontSize: 9, fontFamily: 'monospace', flexShrink: 0 }}>REC</span>
                    <span style={{ color: '#EEF0FF', fontSize: 13, fontFamily: 'monospace', flexShrink: 0 }}>{fmtSec(recordSecs)}</span>
                    <span style={{ color: '#272A45', fontSize: 11 }}>Release to send</span>
                  </div>
                ) : (
                  <input ref={inputRef} value={input} onChange={e => { handleInputChange(e.target.value); }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={currentRoom?.readOnly ? `Post to #Announcements…` : `Message #${currentRoom?.name}…`}
                    style={{ flex: 1, background: BG3, border: '1px solid #1B1E35', color: '#EEF0FF', padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'Instrument Sans, sans-serif', minWidth: 0 }} />
                )}
                <button onClick={sendMessage} disabled={!input.trim() || sending || recording}
                  style={{ width: 36, height: 36, background: input.trim() && !recording ? '#2563EB' : BG3, border: `1px solid ${input.trim() && !recording ? '#2563EB' : '#131526'}`, color: input.trim() && !recording ? '#000' : '#272A45', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: input.trim() && !recording ? 'pointer' : 'default' }}>→</button>
              </div>
              {!isMobile && <div style={{ fontFamily: 'monospace', color: '#131526', fontSize: 10, marginTop: 5 }}>ENTER to send · 😊 emoji · 🖼 image · 📎 file · Hold 🎤 for voice · Hover for actions · ↩ reply</div>}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* ══ THREAD PANEL ══ */}
      {showThread && threadParent && (
        <div style={{
          width: isMobile ? '100%' : 320, background: BG2,
          borderLeft: '1px solid #131526',
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
          ...(isMobile ? { position: 'fixed', inset: 0, zIndex: 90 } : {}),
        }}>
          {/* Thread header */}
          <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderBottom: '1px solid #131526', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#2563EB', fontSize: 13 }}>↩</span>
              <span style={{ color: '#EEF0FF', fontWeight: 700, fontSize: 14 }}>Thread</span>
              <span style={{ color: '#272A45', fontSize: 12 }}>#{currentRoom?.name}</span>
            </div>
            <button onClick={() => setShowThread(false)} style={{ background: 'none', border: 'none', color: '#272A45', fontSize: 22, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</button>
          </div>

          {/* Parent message */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #131526', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 28, height: 28, background: threadParent.author_color + '20', border: `1.5px solid ${threadParent.author_color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: threadParent.author_color, fontWeight: 700, flexShrink: 0 }}>
                {threadParent.author_name.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ color: threadParent.author_color, fontWeight: 700, fontSize: 12 }}>{threadParent.author_name}</span>
                  <span style={{ fontFamily: 'monospace', color: '#272A45', fontSize: 9 }}>{fmt(threadParent.created_at)}</span>
                </div>
                <div style={{ color: '#C8D8E8', fontSize: 13, lineHeight: 1.55, wordBreak: 'break-word' }}>{threadParent.message}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, fontFamily: 'monospace', color: '#272A45', fontSize: 9, letterSpacing: '.1em' }}>
              {threadMessages.length} {threadMessages.length === 1 ? 'REPLY' : 'REPLIES'}
            </div>
          </div>

          {/* Thread messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {threadMessages.length === 0 && (
              <div style={{ color: '#272A45', fontSize: 13, textAlign: 'center', marginTop: 24 }}>No replies yet. Be the first.</div>
            )}
            {threadMessages.map(msg => {
              const isOwn = msg.author_name === displayName || msg.author_name === user?.name;
              return (
                <div key={msg.id} style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 28, height: 28, background: msg.author_color + '20', border: `1.5px solid ${msg.author_color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: msg.author_color, fontWeight: 700, flexShrink: 0 }}>
                    {msg.author_name.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ color: isOwn ? '#A78BFA' : '#EEF0FF', fontWeight: 600, fontSize: 12 }}>{msg.author_name}</span>
                      <span style={{ fontFamily: 'monospace', color: '#272A45', fontSize: 9 }}>{fmt(msg.created_at)}</span>
                    </div>
                    <div style={{ background: isOwn ? 'rgba(139,92,246,.09)' : 'rgba(12,18,32,.8)', border: `1px solid ${isOwn ? 'rgba(139,92,246,.18)' : 'rgba(255,255,255,.05)'}`, padding: '7px 11px', color: '#D0E0F0', fontSize: 13, lineHeight: 1.55, wordBreak: 'break-word' }}>
                      {msg.message}
                    </div>
                    {/* Seen indicator */}
                    {isOwn && (msg.seen_by || []).filter((n:string) => n !== displayName).length > 0 && (
                      <div style={{ color: '#2563EB', fontSize: 9, fontFamily: 'monospace', marginTop: 2 }}>✓✓ Seen</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thread input */}
          <div style={{ padding: '8px 10px 10px', borderTop: '1px solid #131526', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={threadInput}
                onChange={e => setThreadInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendThreadReply(); } }}
                placeholder="Reply to thread…"
                style={{ flex: 1, background: BG3, border: '1px solid #1B1E35', color: '#EEF0FF', padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'Instrument Sans, sans-serif', minWidth: 0 }}
              />
              <button
                onClick={sendThreadReply}
                disabled={!threadInput.trim() || threadSending}
                style={{ width: 36, height: 36, background: threadInput.trim() ? '#2563EB' : BG3, border: `1px solid ${threadInput.trim() ? '#2563EB' : '#131526'}`, color: threadInput.trim() ? '#000' : '#272A45', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: threadInput.trim() ? 'pointer' : 'default' }}>
                {threadSending ? '…' : '→'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1B1E35; border-radius: 2px; }
        audio { max-width: 100%; }
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #04050A; }
        input, button { -webkit-tap-highlight-color: transparent; }
        @supports (-webkit-touch-callout: none) {
          /* iOS Safari: fill-available prevents address-bar resize jank */
          body { height: -webkit-fill-available; }
        }
        /* Prevent iOS rubber-band bounce scrolling leaking outside boardroom */
        html { overscroll-behavior: none; }
        /* Prevent text size adjustment on rotation */
        body { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
      `}</style>
    </div>
  );
}
