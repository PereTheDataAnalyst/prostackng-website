// ─────────────────────────────────────────────────────────────────────────────
// ProStack NG — Video Library
// HOW TO UPDATE:
//   1. Go to your YouTube video → copy the ID after ?v= in the URL
//      e.g. youtube.com/watch?v=ABC123xyz  →  id: 'ABC123xyz'
//   2. Replace the id value below
//   3. Save and redeploy — thumbnails and embeds update automatically
// ─────────────────────────────────────────────────────────────────────────────

export type VideoEntry = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  date: string;
  featured?: boolean;
  hasVideo?: boolean; // set false to show placeholder card instead of YouTube thumb
};

// ── CHANNEL VIDEOS (demos, walkthroughs, case studies) ──────────────────────
// Set hasVideo: false and leave id as '' until you upload to YouTube
export const CHANNEL_VIDEOS: VideoEntry[] = [
  {
    id: '',
    hasVideo: false,
    title: 'AutoReport: From Raw Data to Board-Ready PDF in 8 Seconds',
    desc: 'Live demo — 15,000 rows of sales data processed into a 6-page executive PDF and 7-sheet Excel in under 9 seconds.',
    tag: 'Product Demo',
    tagColor: '#FF5757',
    date: 'Coming soon',
    featured: true,
  },
  {
    id: '',
    hasVideo: false,
    title: 'ProTrackNG: Never Miss a Tender Deadline Again',
    desc: 'How ProTrackNG monitors 400+ portals in real time, scoring every opportunity against your business profile.',
    tag: 'Product Demo',
    tagColor: '#06B6D4',
    date: 'Coming soon',
  },
  {
    id: '',
    hasVideo: false,
    title: 'NightOps: Running a Nightclub with Zero Manual Counting',
    desc: 'A Port Harcourt venue went from 2-hour nightly reconciliation to 5 minutes. Full walkthrough.',
    tag: 'Case Study',
    tagColor: '#A78BFA',
    date: 'Coming soon',
  },
  {
    id: '',
    hasVideo: false,
    title: 'ProStack NG: Building Africa\'s Digital Infrastructure',
    desc: 'Company overview — our vision, our stack, our six-platform ecosystem, and why we\'re building in Port Harcourt.',
    tag: 'Company',
    tagColor: '#2563EB',
    date: 'Coming soon',
  },
];

// ── ADS (produced by ad team — short promotional clips) ──────────────────────
export const AD_VIDEOS: VideoEntry[] = [
  {
    id: '',
    hasVideo: false,
    title: 'AutoReport — 30s Brand Spot',
    desc: 'Your reports. Every morning. Zero effort.',
    tag: 'Ad',
    tagColor: '#FF5757',
    date: 'Coming soon',
  },
  {
    id: '',
    hasVideo: false,
    title: 'ProTrackNG — 30s Brand Spot',
    desc: 'Every tender. Every deadline. Never missed.',
    tag: 'Ad',
    tagColor: '#06B6D4',
    date: 'Coming soon',
  },
  {
    id: '',
    hasVideo: false,
    title: 'NightOps — 30s Brand Spot',
    desc: 'Your nightclub. Fully digital. Fully yours.',
    tag: 'Ad',
    tagColor: '#A78BFA',
    date: 'Coming soon',
  },
];

// YouTube helpers
export const ytThumb  = (id: string, q: 'max' | 'hq' | 'mq' = 'hq') =>
  `https://img.youtube.com/vi/${id}/${q === 'max' ? 'maxresdefault' : q === 'hq' ? 'hqdefault' : 'mqdefault'}.jpg`;

export const ytEmbed  = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

export const ytWatch  = (id: string) =>
  `https://youtube.com/watch?v=${id}`;

// Combined for /media page
export const ALL_VIDEOS = [...CHANNEL_VIDEOS, ...AD_VIDEOS];
