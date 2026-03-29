import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConsultingEnquirySection from '@/components/ConsultingEnquirySection';

export const metadata: Metadata = {
  title: 'Digital Transformation Consulting — ProStack NG Technologies',
  description:
    'ProStack NG audits your business operations and delivers a clear digital transformation roadmap. Packages from ₦500,000. Targeting Rivers State businesses and Nigerian SMEs.',
  keywords: [
    'digital transformation consulting Nigeria',
    'business digitalisation Rivers State',
    'NITDA compliance Nigeria',
    'tech consulting Port Harcourt',
    'digital audit Nigeria',
    'ProStack NG consulting',
    'SME digitalisation Nigeria',
  ],
  openGraph: {
    title: 'Digital Transformation Consulting — ProStack NG',
    description:
      'We audit your operations, map your gaps, and deliver a transformation roadmap built for the Nigerian market. Packages from ₦500,000.',
    url: 'https://www.prostackng.com.ng/consulting',
    siteName: 'ProStack NG Technologies',
    type: 'website',
  },
  alternates: { canonical: 'https://www.prostackng.com.ng/consulting' },
};

/* ─── DATA ─────────────────────────────────────────────────────── */
const PACKAGES = [
  {
    name: 'Audit Only',
    price: '₦500,000',
    duration: '2 weeks',
    icon: '🔍',
    tagline: 'Know exactly where you stand.',
    description:
      'A structured audit of your current business operations — processes, tools, data handling, and digital readiness. You receive a plain-English report showing where inefficiencies exist and what digital solutions would address each one.',
    highlight: false,
    deliverables: [
      'Digital maturity assessment across 5 dimensions',
      'Process mapping — current state documented',
      'Technology gap analysis',
      'Risk & compliance review (NITDA, NDPR)',
      'Prioritised list of quick wins vs long-term fixes',
      'Executive summary report (PDF)',
      '60-minute debrief session',
    ],
    notIncluded: ['Roadmap document', 'Implementation support', 'Vendor recommendations'],
    cta: 'Book an Audit',
  },
  {
    name: 'Audit + Roadmap',
    price: '₦1,200,000',
    duration: '4 weeks',
    icon: '🗺',
    tagline: 'A clear plan, not just a diagnosis.',
    description:
      'Everything in the Audit, plus a detailed 12-month digital transformation roadmap — phased, prioritised, and costed. You leave with a document your board can approve and your team can execute against.',
    highlight: true,
    deliverables: [
      'Full digital maturity audit',
      'Current-state process maps',
      'Technology gap analysis',
      'NITDA & NDPR compliance review',
      'Recommended technology stack for your context',
      'Vendor shortlist with evaluation criteria',
      '12-month phased transformation roadmap',
      'Budget estimates per phase',
      'Change management framework',
      'Two executive presentation sessions',
      '30 days post-delivery email support',
    ],
    notIncluded: ['Hands-on implementation', 'Software development'],
    cta: 'Book Audit + Roadmap',
  },
  {
    name: 'Full Implementation',
    price: '₦3,000,000+',
    duration: 'Custom',
    icon: '⚙️',
    tagline: 'We don\'t just advise. We execute.',
    description:
      'We conduct the audit, build the roadmap, and then stay engaged to implement the transformation — procuring tools, configuring systems, training staff, and measuring outcomes. End-to-end ownership.',
    highlight: false,
    deliverables: [
      'Everything in Audit + Roadmap',
      'Dedicated ProStack NG implementation manager',
      'Vendor procurement & negotiation support',
      'System configuration & integration',
      'Staff training programme (all levels)',
      'Change management facilitation',
      'Progress dashboards & KPI tracking',
      'Monthly implementation reviews',
      'Post-go-live stabilisation (3 months)',
      'Quarterly check-ins for 12 months',
    ],
    notIncluded: [],
    cta: 'Discuss Full Implementation',
  },
];

const DIMENSIONS = [
  {
    icon: '⚙️',
    title: 'Operations & Processes',
    body: 'How work actually gets done today — manual steps, paper trails, communication bottlenecks, and repetitive tasks that technology can eliminate.',
  },
  {
    icon: '📊',
    title: 'Data & Reporting',
    body: 'How decisions are made — whether management has real-time visibility, or is running on outdated Excel files and gut feel.',
  },
  {
    icon: '👥',
    title: 'Customer Experience',
    body: 'How clients interact with your business — booking, payments, communication, complaints, and follow-up. Every friction point is a revenue leak.',
  },
  {
    icon: '🔐',
    title: 'Security & Compliance',
    body: 'NDPR compliance, data handling practices, staff access controls, and alignment with NITDA guidelines for Nigerian businesses.',
  },
  {
    icon: '💻',
    title: 'Technology Stack',
    body: 'What tools you currently use, what they cost, how well they talk to each other, and whether cheaper or better-fit alternatives exist.',
  },
];

const TARGET_SECTORS = [
  {
    sector: 'Rivers State Businesses',
    icon: '🛢',
    desc: 'Oil & gas service companies, logistics firms, hospitality, retail — Rivers State businesses being pushed to digitalise by regulatory requirements and client demands.',
    urgency: 'NITDA digital compliance pressure',
  },
  {
    sector: 'Nigerian SMEs',
    icon: '🏪',
    desc: 'Small and medium enterprises across Nigeria that know they need to modernise but don\'t know where to start, what to prioritise, or how much it will cost.',
    urgency: 'Growth ceiling without digitalisation',
  },
  {
    sector: 'Government & MDAs',
    icon: '🏛',
    desc: 'Ministries, departments, and agencies at state and federal level looking to digitalise service delivery, procurement, or internal operations.',
    urgency: 'Government digitalisation mandate',
  },
  {
    sector: 'Professional Services',
    icon: '⚖️',
    desc: 'Law firms, accounting practices, consulting firms, and healthcare providers that manage sensitive data and complex workflows on outdated systems.',
    urgency: 'NDPR data compliance requirements',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Discovery Call',
    body: 'Free 45-minute session. We listen, ask the right questions, and confirm whether a formal engagement makes sense for your situation.',
  },
  {
    step: '02',
    title: 'Stakeholder Interviews',
    body: 'We speak with your leadership, operations, and frontline staff — the people who know where the real friction is, not just what the org chart says.',
  },
  {
    step: '03',
    title: 'Process & Systems Audit',
    body: 'We map every key workflow, review your current tools, examine your data practices, and benchmark against NITDA and NDPR requirements.',
  },
  {
    step: '04',
    title: 'Report & Roadmap Delivery',
    body: 'You receive a clear, jargon-free document. Not a generic framework copy-pasted from a McKinsey template — a plan built for your specific business.',
  },
  {
    step: '05',
    title: 'Executive Presentation',
    body: 'We present findings and recommendations to your leadership team, answer every question, and walk through the prioritisation logic.',
  },
  {
    step: '06',
    title: 'Implementation (optional)',
    body: 'If you choose Full Implementation, we transition directly into execution — building, procuring, training, and measuring from the same engagement.',
  },
];

const NITDA_NOTE = {
  heading: 'NITDA & Nigerian Regulatory Context',
  body: `The National Information Technology Development Agency (NITDA) has been actively pushing Nigerian businesses — especially those handling citizen data — to adopt formal IT governance frameworks. The Nigeria Data Protection Regulation (NDPR) imposes obligations on how businesses collect, store, and process personal data.

Many Nigerian businesses are non-compliant not because they are negligent, but because nobody has walked them through what compliance actually requires in practical terms. Our audit explicitly covers NITDA alignment and NDPR obligations — not as a bureaucratic checkbox, but as a business risk you need to understand and manage.`,
};

export default function ConsultingPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section className="bg-grid" style={{
          position: 'relative', overflow: 'hidden',
          paddingTop: 'clamp(96px,12vw,140px)',
          paddingBottom: 'clamp(64px,8vw,96px)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,.18) 0%, transparent 65%)',
          }} />
          <div style={{
            maxWidth: 900, margin: '0 auto',
            padding: '0 clamp(16px,4vw,56px)',
            textAlign: 'center', position: 'relative',
          }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: 'center' }}>
              Digital Transformation Consulting
            </div>
            <h1 className="f-display" style={{
              fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800,
              letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 24,
            }}>
              We Audit Your Business.<br />
              <span style={{ color: 'var(--blue-hi)' }}>You Get a Real Plan.</span>
            </h1>
            <p className="f-body" style={{
              fontSize: 'clamp(15px,2vw,18px)', color: 'var(--sub)',
              maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.75,
            }}>
              ProStack NG audits your operations, identifies exactly where technology can reduce
              cost and increase output, and delivers a transformation roadmap your team can
              actually execute — built for the Nigerian business environment.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#packages" className="btn btn-primary" style={{ fontSize: 12 }}>
                View Packages →
              </a>
              <a href="#enquiry" className="btn-outline-border">
                Book a Discovery Call
              </a>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: 48, marginTop: 56, flexWrap: 'wrap',
            }}>
              {[
                { value: '₦500k',  label: 'Starting Package'     },
                { value: '5',      label: 'Audit Dimensions'      },
                { value: 'NITDA',  label: 'Compliance Covered'    },
                { value: 'Free',   label: 'Discovery Call'        },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div className="f-display" style={{
                    fontSize: 22, fontWeight: 800,
                    color: 'var(--blue-hi)', marginBottom: 4,
                  }}>{s.value}</div>
                  <div className="f-mono" style={{
                    fontSize: 10, letterSpacing: '.12em',
                    textTransform: 'uppercase', color: 'var(--muted)',
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TARGET SECTORS ──────────────────────────────────────── */}
        <section style={{
          background: 'var(--s1)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Who This Is For</div>
              <h2 className="f-display" style={{
                fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em',
              }}>
                Built for Nigerian Organisations
              </h2>
              <p className="f-body" style={{
                fontSize: 14, color: 'var(--sub)',
                marginTop: 10, maxWidth: 580, lineHeight: 1.8,
              }}>
                We specialise in the Nigerian business context — not generic transformation
                frameworks imported from the West and applied without adaptation.
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}>
              {TARGET_SECTORS.map(s => (
                <div key={s.sector} className="card-hover-blue" style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  padding: '28px',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
                  <h3 className="f-display" style={{
                    fontSize: 16, fontWeight: 700,
                    letterSpacing: '-.01em', marginBottom: 10,
                  }}>{s.sector}</h3>
                  <p className="f-body" style={{
                    fontSize: 13, color: 'var(--sub)',
                    lineHeight: 1.75, marginBottom: 16,
                  }}>{s.desc}</p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px',
                    background: 'rgba(37,99,235,.08)',
                    border: '1px solid rgba(37,99,235,.2)',
                  }}>
                    <span style={{ color: 'var(--blue)', fontSize: 6 }}>◆</span>
                    <span className="f-mono" style={{
                      fontSize: 9, letterSpacing: '.1em',
                      textTransform: 'uppercase', color: 'var(--blue-hi)',
                    }}>{s.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PACKAGES ────────────────────────────────────────────── */}
        <section id="packages" style={{
          padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Packages</div>
              <h2 className="f-display" style={{
                fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em',
              }}>
                Choose Your Engagement Level
              </h2>
              <p className="f-body" style={{
                fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 540,
              }}>
                Start where you are. Every package builds on the last.
                Most clients begin with Audit + Roadmap.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20, alignItems: 'start',
            }}>
              {PACKAGES.map(pkg => (
                <div key={pkg.name} style={{
                  background: pkg.highlight ? 'rgba(37,99,235,.07)' : 'var(--card)',
                  border: pkg.highlight ? '1px solid var(--blue-dim)' : '1px solid var(--border)',
                  padding: '32px 28px',
                  display: 'flex', flexDirection: 'column',
                  position: 'relative',
                }}>
                  {pkg.highlight && (
                    <div className="f-mono" style={{
                      position: 'absolute', top: -12, left: 28,
                      background: 'var(--blue)', color: '#fff',
                      fontSize: 9, letterSpacing: '.14em',
                      textTransform: 'uppercase', padding: '4px 12px',
                    }}>Most Popular</div>
                  )}

                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 12, marginBottom: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, background: 'var(--blue-lo)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 20,
                    }}>{pkg.icon}</div>
                    <div>
                      <h3 className="f-display" style={{
                        fontSize: 20, fontWeight: 800, letterSpacing: '-.02em',
                      }}>{pkg.name}</h3>
                      <span className="f-mono" style={{
                        fontSize: 9, color: 'var(--muted)',
                        letterSpacing: '.1em', textTransform: 'uppercase',
                      }}>{pkg.tagline}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: 6 }}>
                    <span className="f-display" style={{
                      fontSize: 36, fontWeight: 800, letterSpacing: '-.04em',
                      color: pkg.highlight ? 'var(--blue-hi)' : 'var(--text)',
                    }}>{pkg.price}</span>
                  </div>
                  <div className="f-mono" style={{
                    fontSize: 10, color: 'var(--muted)',
                    letterSpacing: '.1em', marginBottom: 16,
                  }}>⏱ {pkg.duration}</div>

                  <p className="f-body" style={{
                    fontSize: 13, color: 'var(--sub)',
                    lineHeight: 1.75, marginBottom: 24,
                  }}>{pkg.description}</p>

                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

                  <div className="f-mono" style={{
                    fontSize: 9, letterSpacing: '.14em',
                    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14,
                  }}>Deliverables</div>
                  <ul style={{ listStyle: 'none', marginBottom: pkg.notIncluded.length > 0 ? 20 : 28, flex: 1 }}>
                    {pkg.deliverables.map(item => (
                      <li key={item} className="f-body" style={{
                        fontSize: 13, color: 'var(--sub)', paddingLeft: 18,
                        position: 'relative', marginBottom: 8, lineHeight: 1.5,
                      }}>
                        <span style={{
                          position: 'absolute', left: 0, top: 5,
                          color: 'var(--blue)', fontSize: 7,
                        }}>◆</span>{item}
                      </li>
                    ))}
                  </ul>

                  {pkg.notIncluded.length > 0 && (
                    <>
                      <div className="f-mono" style={{
                        fontSize: 9, letterSpacing: '.14em',
                        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10,
                      }}>Not Included</div>
                      <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                        {pkg.notIncluded.map(item => (
                          <li key={item} className="f-body" style={{
                            fontSize: 12, color: 'var(--muted)', paddingLeft: 16,
                            position: 'relative', marginBottom: 6, lineHeight: 1.5,
                          }}>
                            <span style={{ position: 'absolute', left: 0, top: 4, fontSize: 9 }}>—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <a
                    href="#enquiry"
                    className={pkg.highlight ? 'btn btn-primary' : 'btn-outline-border'}
                    style={{ justifyContent: 'center', fontSize: 11, padding: '13px 24px' }}
                  >{pkg.cta} →</a>
                </div>
              ))}
            </div>

            <p className="f-mono" style={{
              fontSize: 10, color: 'var(--muted)',
              letterSpacing: '.08em', marginTop: 24, textAlign: 'center',
            }}>
              All prices in Nigerian Naira · Payment: 50% on engagement, 50% on delivery · Full Implementation priced after scoping
            </p>
          </div>
        </section>

        {/* ─── WHAT WE AUDIT ───────────────────────────────────────── */}
        <section style={{
          background: 'var(--s1)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>The Audit Framework</div>
              <h2 className="f-display" style={{
                fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em',
              }}>5 Dimensions We Assess</h2>
              <p className="f-body" style={{
                fontSize: 14, color: 'var(--sub)',
                marginTop: 10, maxWidth: 540, lineHeight: 1.8,
              }}>
                We score your business across five dimensions, each producing specific,
                actionable findings — not generic recommendations.
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 2,
            }}>
              {DIMENSIONS.map((d, idx) => (
                <div key={d.title} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  padding: '28px 26px', position: 'relative',
                  borderLeft: idx === 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
                  }}>
                    <div style={{
                      width: 36, height: 36, background: 'var(--blue-lo)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 16, flexShrink: 0,
                    }}>{d.icon}</div>
                    <div className="f-mono" style={{
                      fontSize: 9, letterSpacing: '.14em',
                      textTransform: 'uppercase', color: 'var(--blue-hi)',
                    }}>Dimension {idx + 1}</div>
                  </div>
                  <h3 className="f-display" style={{
                    fontSize: 16, fontWeight: 700,
                    letterSpacing: '-.01em', marginBottom: 10,
                  }}>{d.title}</h3>
                  <p className="f-body" style={{
                    fontSize: 13, color: 'var(--sub)', lineHeight: 1.75,
                  }}>{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── NITDA CALLOUT ───────────────────────────────────────── */}
        <section style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{
              background: 'rgba(37,99,235,.06)',
              border: '1px solid var(--blue-dim)',
              padding: 'clamp(32px,4vw,48px)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 200, height: 200, borderRadius: '50%',
                background: 'var(--blue-lo)', filter: 'blur(50px)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative' }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>
                  Regulatory Context
                </div>
                <h2 className="f-display" style={{
                  fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800,
                  letterSpacing: '-.03em', marginBottom: 20,
                }}>
                  {NITDA_NOTE.heading}
                </h2>
                {NITDA_NOTE.body.split('\n\n').map((para, i) => (
                  <p key={i} className="f-body" style={{
                    fontSize: 14, color: 'var(--sub)',
                    lineHeight: 1.85, marginBottom: 16,
                  }}>{para}</p>
                ))}
                <div style={{ marginTop: 24 }}>
                  <a
                    href="#enquiry"
                    className="btn btn-primary"
                    style={{ fontSize: 12 }}
                  >
                    Check Your Compliance Posture →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PROCESS ─────────────────────────────────────────────── */}
        <section style={{
          background: 'var(--s1)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>How It Works</div>
              <h2 className="f-display" style={{
                fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em',
              }}>From Discovery to Delivery</h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
            }}>
              {PROCESS.map((step, idx) => (
                <div key={step.step} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  padding: '28px 22px', position: 'relative',
                  borderLeft: idx === 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div className="f-display text-ghost" style={{
                    fontSize: 48, fontWeight: 800, letterSpacing: '-.04em',
                    lineHeight: 1, marginBottom: 16, userSelect: 'none',
                  }}>{step.step}</div>
                  <h3 className="f-display" style={{
                    fontSize: 15, fontWeight: 700,
                    letterSpacing: '-.01em', marginBottom: 8,
                  }}>{step.title}</h3>
                  <p className="f-body" style={{
                    fontSize: 12, color: 'var(--sub)', lineHeight: 1.75,
                  }}>{step.body}</p>
                  {idx < PROCESS.length - 1 && (
                    <div style={{
                      position: 'absolute', top: '50%', right: -14,
                      transform: 'translateY(-50%)',
                      color: 'var(--blue)', fontSize: 16, fontWeight: 700, zIndex: 2,
                    }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ENQUIRY SECTION ─────────────────────────────────────── */}
        <section id="enquiry" style={{
          padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Book a Consultation</div>
              <h2 className="f-display" style={{
                fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em',
              }}>Start with a Free Discovery Call</h2>
              <p className="f-body" style={{
                fontSize: 14, color: 'var(--sub)',
                marginTop: 10, maxWidth: 580, lineHeight: 1.8,
              }}>
                No commitment. 45 minutes. We listen to your situation, ask targeted questions,
                and tell you honestly whether a formal consulting engagement makes sense —
                and if so, which package fits.
              </p>
            </div>
            <ConsultingEnquirySection />
          </div>
        </section>

        {/* ─── BOTTOM CTA ──────────────────────────────────────────── */}
        <section style={{
          background: 'var(--s1)',
          borderTop: '1px solid var(--border)',
          padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)',
        }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 20, justifyContent: 'center' }}>
              Need Something Built, Not Advised?
            </div>
            <h2 className="f-display" style={{
              fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800,
              letterSpacing: '-.03em', marginBottom: 16,
            }}>
              We Also Build the Platform
            </h2>
            <p className="f-body" style={{
              fontSize: 14, color: 'var(--sub)', lineHeight: 1.8,
              marginBottom: 32, maxWidth: 520, margin: '0 auto 32px',
            }}>
              If your audit reveals specific platforms you need built, ProStack NG can design
              and deliver them — fixed-price, fixed-timeline, on the same stack powering
              our live products.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/build-with-us" className="btn btn-primary" style={{ fontSize: 12 }}>
                View Build Packages →
              </Link>
              <Link href="/managed-services" className="btn-outline-border">
                Managed Services
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
