// ─────────────────────────────────────────────────────────────────────────────
// ProStack NG — Blog / Insights
// To add a new post: copy a POSTS entry, give it a unique slug, write content
// ─────────────────────────────────────────────────────────────────────────────

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown-style, rendered as HTML
  category: string;
  categoryColor: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  featured?: boolean;
};

export const POSTS: Post[] = [
  {
    slug: 'why-nigerian-businesses-lose-money-manual-reporting',
    title: 'Why Nigerian Businesses Lose 3 Hours Every Morning to Manual Reporting',
    excerpt: 'The average Nigerian SME spends 3–4 hours per day copying data between Excel sheets and formatting reports. We built AutoReport to end that. Here\'s the full story.',
    category: 'Insight',
    categoryColor: '#FF5757',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'March 10, 2026',
    readTime: '6 min read',
    featured: true,
    content: `
<h2>The Problem Nobody Talks About</h2>
<p>Every Monday morning, across thousands of Nigerian businesses, the same ritual plays out. A finance officer opens Excel. They copy last week's sales data from one sheet. They paste it into another. They manually calculate totals, apply conditional formatting, build a chart, and then spend 45 minutes formatting a PDF to send to their MD by 9am.</p>
<p>This process — mundane, error-prone, and deeply familiar — is costing Nigerian businesses billions of naira in lost productivity every year. Not in some abstract economic sense. In real, observable time that could be spent on sales, strategy, or sleep.</p>

<h2>What We Found When We Started Looking</h2>
<p>Before we built AutoReport, we spent three months talking to business owners in Port Harcourt, Lagos, and Abuja. The pattern was identical across industries:</p>
<ul>
  <li>Oil & gas service companies spending 2–3 hours per day on operational reports</li>
  <li>Retail businesses running weekly sales summaries that took half a day to produce</li>
  <li>Hospitality groups whose "nightly reconciliation" started at midnight and finished at 2am</li>
</ul>
<p>The common thread wasn't laziness or lack of skill. It was the absence of any tool designed for how Nigerian businesses actually operate — with local data formats, local payment data, and local reporting expectations.</p>

<h2>The 8-Second Alternative</h2>
<p>AutoReport takes raw data — an Excel file, a CSV export, a database connection — and produces a fully formatted executive report in under 9 seconds. Not a template with gaps to fill. A complete, board-ready document with charts, KPIs, trend analysis, and executive commentary.</p>
<p>The same report that took your finance officer 3 hours now arrives in every inbox at 8am, automatically, every morning. Zero human effort after the initial setup.</p>

<h2>What This Actually Means for Your Business</h2>
<p>Three hours per day is 15 hours per week. That's 60 hours per month — an entire additional working week — that your team gets back. For a business paying ₦150,000/month for a finance officer, that's the equivalent of ₦90,000 in recovered labour time, every single month.</p>
<p>AutoReport costs ₦45,000/month to start. The maths speaks for itself.</p>

<h2>Getting Started</h2>
<p>We offer a free 14-day trial and a live demo where we process your actual data and show you the output before you commit to anything. Book a session and see it for yourself.</p>
    `,
  },
  {
    slug: 'tender-intelligence-nigerian-oil-gas',
    title: 'How Oil & Gas Companies in Nigeria Are Using AI to Win More Tenders',
    excerpt: 'Tender intelligence isn\'t new in Europe. In Nigeria, it\'s still being done by hand — spreadsheets, WhatsApp forwards, and missed deadlines. ProTrackNG changes that.',
    category: 'Industry',
    categoryColor: '#06B6D4',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Feb 28, 2026',
    readTime: '8 min read',
    content: `
<h2>The Nigerian Tender Landscape</h2>
<p>Nigeria publishes thousands of tenders every month — from NNPCL and its subsidiaries, from the Nigerian Ports Authority, from NIMASA, from state governments, from private oil majors operating under DPR licences. The value of publicly advertised contracts runs into hundreds of billions of naira annually.</p>
<p>The companies that win the most of these tenders aren't always the best qualified. They're often simply the ones who knew about the opportunity first.</p>

<h2>How Most Companies Currently Track Tenders</h2>
<p>When we surveyed 40 Nigerian oil and gas service companies before building ProTrackNG, we found that 87% of them relied primarily on three sources for tender intelligence:</p>
<ul>
  <li>WhatsApp groups where someone forwards a newspaper clipping</li>
  <li>Manually checking 4–5 government portals every few days</li>
  <li>Relationships with procurement officers who occasionally call</li>
</ul>
<p>This is not intelligence. This is hope. And it means that for every tender you learn about in time to bid, there are likely three more you never heard of — or heard about after the deadline.</p>

<h2>What Real Tender Intelligence Looks Like</h2>
<p>ProTrackNG monitors over 400 tender portals, company procurement pages, government bulletin boards, and news sources in real time. When a relevant tender appears, you receive an alert — on WhatsApp, by email, or both — within minutes of publication, not days.</p>
<p>More importantly, our AI scoring engine evaluates each tender against your company profile: your registration categories, your past bid history, your geographic reach, your technical capacity. You don't get a flood of irrelevant opportunities. You get a scored, ranked list of tenders that are actually worth your time.</p>

<h2>The Competitive Advantage</h2>
<p>In a market where most competitors learn about a tender from a WhatsApp forward three days after publication, being the first to review the requirements, prepare questions, and assemble your bid team is an enormous advantage. Procurement officers notice which companies engage early and professionally.</p>
<p>Our clients have consistently reported improved bid success rates within the first 90 days — not because they became better at writing bids, but because they stopped missing opportunities and started competing on the ones that matched their capabilities.</p>
    `,
  },
  {
    slug: 'nightlife-economy-port-harcourt',
    title: 'Port Harcourt\'s Nightlife Economy Is Bigger Than You Think — And Almost Entirely Undigitised',
    excerpt: 'The entertainment and nightlife sector in Rivers State generates hundreds of millions of naira per weekend. Almost none of it is tracked, analysed, or optimised. NightOps is changing that.',
    category: 'Industry',
    categoryColor: '#A78BFA',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Feb 14, 2026',
    readTime: '5 min read',
    content: `
<h2>A Sector Running Blind</h2>
<p>On any Friday night in Port Harcourt, dozens of nightclubs, lounges, and entertainment venues are collectively processing millions of naira in cash and card transactions. By Sunday morning, most venue owners have only a rough sense of how much they made — and almost no insight into why.</p>
<p>Which tables spent the most? Which bartender had the highest variance between stock consumed and revenue recorded? Which artist night drove the best average spend per head? For most venues, these questions go unanswered — not because they don't matter, but because the tools to answer them either don't exist or weren't designed for the Nigerian market.</p>

<h2>What NightOps Changes</h2>
<p>NightOps is a complete operating system for nightlife venues — POS, inventory management, staff tracking, table management, and executive reporting — built specifically for how Nigerian venues actually operate.</p>
<p>When a venue deploys NightOps, the nightly reconciliation that used to start at midnight and finish at 2am takes five minutes. Every transaction is recorded in real time. Stock variances are flagged automatically. The MD receives a full financial summary before they leave for the night.</p>

<h2>The Bigger Picture</h2>
<p>Digitisation isn't just about efficiency. It's about legitimacy. Venues that can demonstrate clean, auditable financial records are better positioned for bank financing, investor conversations, and expansion. The nightlife sector in Rivers State has historically been dismissed as informal and unscalable. NightOps makes the case that it doesn't have to be.</p>
    `,
  },
  {
    slug: 'building-africa-platform-not-product',
    title: 'Why We\'re Building a Platform, Not a Product — And Why It Matters for Africa',
    excerpt: 'Most African tech startups build one product and try to make it work. We\'re building six — on shared infrastructure. Here\'s why that\'s the right bet for this market.',
    category: 'Company',
    categoryColor: '#2563EB',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Jan 30, 2026',
    readTime: '7 min read',
    content: `
<h2>The Single-Product Trap</h2>
<p>The default playbook for African tech is to find one problem, build one solution, and scale it through aggressive growth until you can raise a Series A. Paystack did payments. Flutterwave did payments. Andela did developer talent. The model works — for the right product in the right category.</p>
<p>But for every Paystack, there are hundreds of startups that built a genuinely useful single product and couldn't find the growth trajectory required to justify venture capital. Their product works. Their customers value it. They just can't 10x.</p>

<h2>The Platform Alternative</h2>
<p>When we designed ProStack NG, we made a deliberate decision to build a platform from day one. This means that every product we build — AutoReport, ProTrackNG, NightOps, MyHarriet, SwiftRide, StakeX — runs on the same underlying infrastructure:</p>
<ul>
  <li>Unified authentication — one identity, every product</li>
  <li>Shared payment rails — Paystack integration built once, used everywhere</li>
  <li>Common notification system — WhatsApp and email delivery across all products</li>
  <li>Central analytics — cross-product data, single dashboard</li>
</ul>
<p>The first product cost us full engineering effort. The second was cheaper. The third cheaper still. By product six, we're deploying new platforms in weeks, not months, because the hard infrastructure work is already done.</p>

<h2>Why This Matters for Africa Specifically</h2>
<p>African markets are characterised by high infrastructure costs, limited reliable third-party services, and consumers who are already over-subscribed on apps. A platform model lets us amortise our infrastructure investment across multiple products while giving clients a unified experience — one login, one relationship, multiple tools.</p>
<p>We believe this is the architecture that builds durable, defensible businesses in African tech. Not virality. Not growth hacking. Infrastructure, compounded.</p>
    `,
  },
  {
    slug: 'series-a-what-investors-should-know',
    title: 'What Investors Should Know About ProStack NG Before Our Series A',
    excerpt: 'We\'re building toward a $500K–$2M raise. Before we pitch anyone, here\'s an honest account of where we are, what we\'ve proven, and what we still need to figure out.',
    category: 'Investor',
    categoryColor: '#F5B530',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Jan 15, 2026',
    readTime: '10 min read',
    content: `
<h2>The Honest Version</h2>
<p>Most investor-facing content is optimised for persuasion rather than truth. This post is an attempt to do something different: tell you exactly where ProStack NG stands, what we've proven, and what remains uncertain, before we start formal fundraising conversations.</p>

<h2>What We've Proven</h2>
<p>Three products — AutoReport, ProTrackNG, and NightOps — are live and generating revenue from real clients. We built all three without outside capital. This isn't just a traction story; it's a proof of execution. We ship.</p>
<p>Our shared infrastructure model is working. Each new product we build takes less time and costs less to deploy than the one before it. The unit economics improve with every product we add.</p>

<h2>What We're Still Figuring Out</h2>
<p>Customer acquisition at scale. Our current clients came through relationships and direct outreach. We haven't yet cracked a scalable inbound channel — that's what the Series A marketing budget is for.</p>
<p>Enterprise sales cycles. Some of our most valuable potential clients — large oil and gas companies, government agencies — have procurement processes that take 6–18 months. We need the runway to survive those cycles.</p>

<h2>The Ask and the Plan</h2>
<p>We're targeting $500K–$2M. The money goes into three things: engineering (more products faster), sales and marketing (scalable acquisition), and working capital for enterprise client onboarding.</p>
<p>If you're an investor who believes in African digital infrastructure and platform business models, we'd like to talk. Book a session through our website or reach out directly.</p>
    `,
  },
];

export const FEATURED_POST = POSTS.find(p => p.featured) ?? POSTS[0];
export const CATEGORIES = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))];
