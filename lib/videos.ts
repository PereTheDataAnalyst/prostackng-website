// ─────────────────────────────────────────────────────────────────────────────
// ProStack NG — Video Feed
// To update: replace the `id` values with real YouTube video IDs.
// YouTube video ID = the part after ?v= in any YouTube URL
// e.g. https://youtube.com/watch?v=dQw4w9WgXcQ → id: 'dQw4w9WgXcQ'
// ─────────────────────────────────────────────────────────────────────────────

export type VideoEntry = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  date: string;
  featured?: boolean;
};

// Replace these placeholder IDs with your real YouTube video IDs
export const VIDEOS: VideoEntry[] = [
  {
    id: 'LXb3EKWsInQ',  // ← REPLACE with real YouTube ID
    title: 'AutoReport: From Raw Data to Board-Ready PDF in 8 Seconds',
    desc: 'Watch a live demo of AutoReport processing 15,000 rows of sales data, generating 24 KPIs, building charts, and emailing a 6-page executive PDF — all in under 9 seconds.',
    tag: 'Product Demo',
    tagColor: '#FF5757',
    date: 'Mar 2026',
    featured: true,
  },
  {
    id: 'JTxsNm9IdYU',  // ← REPLACE
    title: 'ProTrackNG: Never Miss a Tender Deadline Again',
    desc: 'How ProTrackNG monitors 400+ government and corporate tender portals in real time, scoring and alerting your team to every relevant opportunity.',
    tag: 'Product Demo',
    tagColor: '#06B6D4',
    date: 'Mar 2026',
  },
  {
    id: 'hY7m5jjJ9mM',  // ← REPLACE
    title: 'NightOps: Running a Nightclub with Zero Manual Counting',
    desc: 'A Port Harcourt venue went from 2-hour nightly reconciliation to 5 minutes. Full walkthrough of NightOps in a live venue environment.',
    tag: 'Case Study',
    tagColor: '#A78BFA',
    date: 'Feb 2026',
  },
  {
    id: 'KgpclqP-LBA',  // ← REPLACE
    title: 'ProStack NG: Building Africa\'s Digital Infrastructure',
    desc: 'Our vision, our stack, our six-platform ecosystem, and why we\'re building in Port Harcourt. A 5-minute company overview for prospective clients and investors.',
    tag: 'Company',
    tagColor: '#2563EB',
    date: 'Jan 2026',
  },
  {
    id: 'GtL1huin9EE',  // ← REPLACE
    title: 'MyHarriet: The Marketplace Nigeria Has Been Waiting For',
    desc: 'Early product preview — how MyHarriet combines escrow payments, vendor ratings, and campus commerce into one platform.',
    tag: 'Coming Soon',
    tagColor: '#F5B530',
    date: 'Jan 2026',
  },
  {
    id: 'JHm679tyTiA',  // ← REPLACE
    title: 'SwiftRide: Reimagining Mobility in Rivers State',
    desc: 'Why Bolt and Uber aren\'t enough for the Niger Delta market, and how SwiftRide is being designed specifically for our roads, our riders, and our drivers.',
    tag: 'Roadmap',
    tagColor: '#38BDF8',
    date: 'Dec 2025',
  },
];

export const FEATURED = VIDEOS.find(v => v.featured) ?? VIDEOS[0];
export const SECONDARY = VIDEOS.filter(v => !v.featured).slice(0, 5);

// YouTube thumbnail URL helper
export const ytThumb = (id: string, quality: 'max' | 'hq' | 'mq' = 'hq') =>
  `https://img.youtube.com/vi/${id}/${quality === 'max' ? 'maxresdefault' : quality === 'hq' ? 'hqdefault' : 'mqdefault'}.jpg`;

// YouTube embed URL helper
export const ytEmbed = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
