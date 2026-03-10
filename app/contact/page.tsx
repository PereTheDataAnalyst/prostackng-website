'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/lib/data';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', type:'', message:'' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error,  setError]  = useState('');
  const set = (k:string, v:string) => setForm(f => ({...f, [k]:v}));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in name, email, and message.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const inputStyle = {
    background:'#080C12', border:'1px solid #111D2E', color:'#E2EAF4',
    padding:'13px 16px', fontFamily:'Space Grotesk, sans-serif', fontSize:14,
    outline:'none', width:'100%', transition:'border-color 0.2s',
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 md:py-20 pb-20 md:pb-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">

            {/* Left — info */}
            <div>
              <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>CONTACT</p>
              <h1 className="font-display font-black text-text mb-6"
                style={{ fontSize:'clamp(38px,5vw,64px)', letterSpacing:'-.04em', lineHeight:1.0 }}>
                Let's talk about<br /><span className="text-accent">your project.</span>
              </h1>
              <p className="text-sub mb-14" style={{ fontSize:16, lineHeight:1.9 }}>
                First consultation is always free. No sales scripts — just an honest conversation about what you want built and whether we're the right team to build it.
              </p>

              {[
                { icon:'📍', label:'Location',          value:'Port Harcourt, Rivers State, Nigeria' },
                { icon:'📧', label:'Email',              value:'hello@prostackng.com' },
                { icon:'📱', label:'Phone / WhatsApp',   value:'+234 705 944 9360' },
                { icon:'⚡', label:'Response Time',      value:'Within 2 business hours' },
              ].map((c,i) => (
                <div key={i} className="flex gap-4 mb-7">
                  <div className="w-11 h-11 flex items-center justify-center text-lg shrink-0 border"
                    style={{ background:'rgba(0,232,122,.06)', borderColor:'rgba(0,232,122,.16)' }}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-mono text-accent mb-1" style={{ fontSize:9.5, letterSpacing:'.12em' }}>{c.label}</div>
                    <div className="text-text" style={{ fontSize:15 }}>{c.value}</div>
                  </div>
                </div>
              ))}

              <div className="bg-card border border-border mt-8" style={{ padding:32 }}>
                <div className="font-mono text-accent mb-4" style={{ fontSize:9.5, letterSpacing:'.12em' }}>FREE CONSULTATION INCLUDES</div>
                {[
                  '45-minute strategy call',
                  'Technical audit of your current systems',
                  'Written architecture recommendations',
                  'Fixed-price project quote — no obligation',
                ].map((item,i) => (
                  <div key={i} className="flex gap-3 items-start mb-3">
                    <span className="text-accent font-bold mt-0.5" style={{ fontSize:12 }}>✓</span>
                    <span className="text-sub" style={{ fontSize:13.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-card border border-border relative" style={{ padding:52 }}>
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background:'linear-gradient(90deg,#00E87A,#00C8FF,transparent)' }} />

              {status === 'success' ? (
                <div className="text-center" style={{ padding:'80px 0' }}>
                  <div style={{ fontSize:56, marginBottom:24 }}>✅</div>
                  <h3 className="font-display font-black text-accent mb-4" style={{ fontSize:28 }}>Message Received!</h3>
                  <p className="text-sub leading-relaxed">
                    Thanks, <strong className="text-text">{form.name.split(' ')[0]}</strong>.<br />
                    You'll hear from us within 2 business hours.<br />
                    Check your email for a confirmation.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-bold text-text mb-8" style={{ fontSize:22 }}>Start a Conversation</h3>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[
                      { ph:'Full Name *',    type:'text',  key:'name'  },
                      { ph:'Email Address *',type:'email', key:'email' },
                    ].map(f => (
                      <input key={f.key} placeholder={f.ph} type={f.type} value={(form as any)[f.key]}
                        onChange={e => set(f.key, e.target.value)}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor='#00E87A')}
                        onBlur={e  => (e.target.style.borderColor='#111D2E')} />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input placeholder="WhatsApp Number" value={form.phone} onChange={e=>set('phone',e.target.value)}
                      style={inputStyle}
                      onFocus={e=>(e.target.style.borderColor='#00E87A')}
                      onBlur={e=>(e.target.style.borderColor='#111D2E')} />
                    <select value={form.type} onChange={e=>set('type',e.target.value)}
                      style={{ ...inputStyle, color:form.type?'#E2EAF4':'#445566', appearance:'none' }}>
                      <option value="">Enquiry Type</option>
                      <option>New Project / Build</option>
                      <option>IT Consulting</option>
                      <option>Product Demo — ProTrackNG</option>
                      <option>Product Demo — NightOps</option>
                      <option>Product Demo — AutoReport</option>
                      <option>Partnership</option>
                      <option>Investment</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <textarea rows={5}
                    placeholder="Describe your project — what problem are you solving? The more detail, the better. *"
                    value={form.message} onChange={e=>set('message',e.target.value)}
                    style={{ ...inputStyle, resize:'vertical', marginBottom:24 }}
                    onFocus={e=>(e.target.style.borderColor='#00E87A')}
                    onBlur={e=>(e.target.style.borderColor='#111D2E')} />

                  {error && (
                    <p className="text-red-400 mb-4 font-mono" style={{ fontSize:12 }}>⚠ {error}</p>
                  )}

                  <button
                    onClick={submit}
                    disabled={status==='loading'}
                    className="w-full font-display font-bold transition-all duration-200"
                    style={{
                      background: status==='loading'?'#00b860':'#00E87A',
                      color:'#000', padding:'16px 0', fontSize:14,
                      letterSpacing:'.05em', textTransform:'uppercase', border:'none', cursor:'pointer',
                    }}>
                    {status==='loading' ? 'Sending…' : 'Send Message →'}
                  </button>
                  <p className="font-mono text-muted text-center mt-3" style={{ fontSize:10.5 }}>
                    🔒 Your information is confidential and never shared.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

