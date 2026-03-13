export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
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
    title: 'Why Nigerian Businesses Lose Hours Every Morning to Manual Reporting',
    excerpt: 'Across Nigerian businesses, the same ritual plays out every morning — a finance officer opens Excel, copies data, builds a chart, formats a PDF. We built AutoReport to end that.',
    category: 'Insight',
    categoryColor: '#FF5757',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'March 10, 2026',
    readTime: '6 min read',
    featured: true,
    content: `
<h2>The Problem Nobody Talks About</h2>
<p>Every Monday morning, across thousands of Nigerian businesses, the same ritual plays out. A finance officer opens Excel. They copy last week's sales data from one sheet, paste it into another, manually calculate totals, apply formatting, build a chart, and spend 30–45 minutes producing a PDF to send to management.</p>
<p>This process — manual, error-prone, and deeply familiar — consumes time that could be spent on actual analysis, sales, or strategy. The problem is not laziness. It is the absence of any tool designed for how Nigerian businesses actually operate.</p>

<h2>What We Found When We Started Looking</h2>
<p>Before building AutoReport, we spent time talking to business owners in Port Harcourt, Lagos, and Abuja. The pattern was consistent across sectors:</p>
<ul>
  <li>Oil and gas service companies spending 2–3 hours per day on operational reports</li>
  <li>Retail businesses running weekly sales summaries that took half a day to produce</li>
  <li>Hospitality operators whose end-of-night reconciliation stretched past midnight</li>
</ul>
<p>The common thread was not the size of the business or the skill of the team. It was the absence of automation — specifically, automation calibrated to local data formats, local payment structures, and local reporting expectations.</p>

<h2>The Automated Alternative</h2>
<p>AutoReport takes raw data — an Excel file, a CSV export, or a database connection — and produces a fully formatted executive report automatically. Not a template with gaps to fill. A complete, consistently formatted document with charts, KPIs, and trend analysis, delivered to every relevant inbox on a schedule.</p>
<p>The same output that took hours now happens without anyone touching it. Setup takes one session. After that, it runs itself.</p>

<h2>What This Actually Means for Your Business</h2>
<p>Two hours per day is ten hours per week — effectively an extra quarter-time employee, consumed entirely by a task a computer can do in seconds. Redirecting that time toward actual decision-making is not a marginal improvement. It changes what your team can do.</p>
<p>AutoReport starts at ₦45,000 per month. We offer a free demo using your actual data before you commit to anything.</p>
    `,
  },
  {
    slug: 'tender-intelligence-nigerian-oil-gas',
    title: 'How Oil & Gas Companies in Nigeria Are Losing Tenders They Should Be Winning',
    excerpt: 'The companies that win the most government and private sector tenders in Nigeria are not always the best-qualified. They are often simply the ones who found out first.',
    category: 'Industry',
    categoryColor: '#06B6D4',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Feb 28, 2026',
    readTime: '8 min read',
    content: `
<h2>The Nigerian Tender Landscape</h2>
<p>Nigeria publishes a significant volume of tenders every month — from NNPCL and its subsidiaries, from the Nigerian Ports Authority, from NIMASA, from state governments, and from private oil majors. The companies that win the most of these opportunities are not always the best-qualified. They are often simply the ones who knew about the opportunity first and had time to prepare a thorough response.</p>

<h2>How Most Companies Currently Track Tenders</h2>
<p>When we spoke to oil and gas service companies in Port Harcourt before building ProTrackNG, the picture was consistent. Most relied on a combination of manually checking government portals every few days, WhatsApp groups where someone occasionally forwarded a relevant notice, and personal relationships with procurement contacts.</p>
<p>This is not a systematic process. It is reactive, and it means that for every tender a team learns about in time to bid competitively, there are likely others that were missed entirely or found too late to submit a strong response.</p>

<h2>What a Structured Approach Looks Like</h2>
<p>ProTrackNG monitors tender portals, government procurement pages, and relevant news sources and sends alerts when relevant opportunities appear — by email, WhatsApp, or both. Alerts arrive close to the time of publication, not days later.</p>
<p>Beyond the alert, the platform keeps the full pipeline organised: documents attached to each tender, deadlines tracked, bid stages logged, and a management view showing live status across all active opportunities.</p>

<h2>The Practical Difference</h2>
<p>In a competitive market, being the first team to review the requirements, prepare questions for the procuring authority, and begin assembling your bid is a genuine advantage. Procurement officers notice which companies engage early and which scramble at the last minute.</p>
<p>Our clients report better pipeline visibility and fewer missed deadlines from the first month. The competitive advantage compounds the longer the system is in use.</p>
    `,
  },
  {
    slug: 'nightlife-economy-port-harcourt',
    title: "Port Harcourt's Nightlife Economy Is Almost Entirely Undigitised",
    excerpt: 'Entertainment venues across Rivers State process significant revenue every weekend. Most of it is tracked on paper, reconciled manually at 2am, and never properly analysed.',
    category: 'Industry',
    categoryColor: '#A78BFA',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Feb 14, 2026',
    readTime: '5 min read',
    content: `
<h2>A Sector Running Without Data</h2>
<p>On any Friday night in Port Harcourt, dozens of nightclubs, lounges, and entertainment venues are collectively processing substantial cash and card transactions. By Sunday morning, most venue owners have only an approximate sense of how much they made — and almost no insight into why.</p>
<p>Which tables spent the most? Which bartender had the highest variance between stock consumed and revenue recorded? Which entertainment format drove the best average spend per guest? For most venues, these questions go unanswered — not because they do not matter, but because the tools to answer them have not been available for the Nigerian market.</p>

<h2>What NightOps Changes</h2>
<p>NightOps is an operational platform built specifically for nightlife venues — covering POS, inventory management, staff tracking, table management, and executive reporting. When a venue deploys it, the nightly reconciliation process that previously stretched past midnight takes minutes. Every transaction is recorded in real time. Stock variances are flagged automatically. The owner or manager has a full financial summary before they leave for the night.</p>

<h2>The Bigger Picture</h2>
<p>Digitalisation is not just about efficiency. Venues that can demonstrate clean, auditable financial records are better positioned for bank financing, investor conversations, and multi-venue expansion. The nightlife sector in Rivers State has historically been seen as informal and difficult to scale. NightOps provides the operational infrastructure to change that.</p>
    `,
  },
  {
    slug: 'building-africa-platform-not-product',
    title: "Why We're Building a Platform, Not Six Separate Products",
    excerpt: 'Most African tech startups build one product and try to make it work. We are building six on shared infrastructure. The economics and the logic behind that decision.',
    category: 'Company',
    categoryColor: '#2563EB',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Jan 30, 2026',
    readTime: '7 min read',
    content: `
<h2>The Single-Product Model and Its Limits</h2>
<p>The standard playbook for African tech is to find one problem, build one solution, and scale it aggressively. Paystack did payments. Flutterwave did payments. Andela did developer talent. The model works — for the right product in the right category with the right growth dynamics.</p>
<p>For products that solve real but more contained problems, a single-product strategy often creates a ceiling. The product works. Customers value it. But the growth curve required to justify external investment or support a large team is difficult to achieve from a narrow base.</p>

<h2>The Platform Decision</h2>
<p>When we designed ProStack NG, we made a deliberate decision to build a platform from the start. This means every product — AutoReport, ProTrackNG, NightOps, MyHarriet, SwiftRide, StakeX — runs on the same underlying infrastructure:</p>
<ul>
  <li>Unified authentication — one identity across every product</li>
  <li>Shared payment integration — Paystack built once, used everywhere</li>
  <li>Common notification layer — email and WhatsApp delivery across all products</li>
  <li>Central analytics — cross-product visibility from a single dashboard</li>
</ul>
<p>The first product required full engineering effort. Each subsequent product is cheaper and faster to build because the foundation is already in place. By the time we launch a sixth product, the marginal cost of adding it to the platform is a fraction of what it would be if we were starting fresh each time.</p>

<h2>Why This Matters for the African Market</h2>
<p>African markets present high infrastructure costs, unreliable third-party services, and consumers who are already managing multiple apps. A platform model lets us amortise infrastructure investment across multiple products while giving clients a unified experience — one login, one support relationship, multiple tools. We believe this is a more defensible position than six separate single-product companies competing independently.</p>
    `,
  },
  {
    slug: 'series-a-what-investors-should-know',
    title: 'What Investors Should Know About ProStack NG',
    excerpt: "We're building toward a ₦75M–₦150M raise. Before we pitch anyone, here's an honest account of where we are, what we've proven, and what remains to be figured out.",
    category: 'Investor',
    categoryColor: '#F5B530',
    author: 'Fubara',
    authorRole: 'CEO, ProStack NG',
    date: 'Jan 15, 2026',
    readTime: '10 min read',
    content: `
<h2>The Honest Version</h2>
<p>Most investor-facing content is optimised for persuasion. This post is an attempt to do something different: tell you exactly where ProStack NG stands, what we have proven, and what remains uncertain — before we begin formal fundraising conversations.</p>

<h2>What We've Proven</h2>
<p>Three products — AutoReport, ProTrackNG, and NightOps — are live and generating revenue from real clients. We built all three without outside capital. This is not just a traction story; it is a proof of execution. We ship working products, we find paying clients, and we do it without burning through a funding round first.</p>
<p>Our shared infrastructure model is working in practice. Each product we have built has taken less time and cost less to deploy than the one before it. The unit economics improve with each product added to the platform.</p>

<h2>What We're Still Figuring Out</h2>
<p>Scalable client acquisition. Our current clients came through relationships and direct outreach. We have not yet built a repeatable inbound channel that works without significant personal involvement from the founders. That is what part of the raise is for.</p>
<p>Enterprise sales cycles. Some of our highest-value potential clients — larger oil and gas companies, government agencies — have procurement processes that take months. We need the runway to engage those cycles properly without revenue pressure forcing shortcuts.</p>

<h2>The Ask and the Plan</h2>
<p>We are targeting ₦75M–₦150M in a seed / pre-Series A raise. The allocation is roughly: engineering (more products, faster), sales and marketing (scalable acquisition channels), and working capital for enterprise client onboarding.</p>
<p>If you are an investor who believes in African digital infrastructure and platform business models, we would like to talk. Book a session through our website or reach out directly at contact@prostackng.com.</p>
    `,
  },
];

export const FEATURED_POST = POSTS.find(p => p.featured) ?? POSTS[0];
export const CATEGORIES = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))];
