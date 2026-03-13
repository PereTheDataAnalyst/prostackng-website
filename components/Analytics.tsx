// ProStack NG — Analytics
// Using Umami (self-hosted, GDPR-clean, no cookie consent required)
// Set NEXT_PUBLIC_UMAMI_WEBSITE_ID in Vercel env vars once you deploy your Umami instance
// Free cloud option: https://umami.is — sign up, add your site, get your website ID

export default function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  // Umami cloud script URL — replace with your self-hosted URL if applicable
  const scriptSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? 'https://cloud.umami.is/script.js';

  if (!websiteId) return null; // silently skip if not configured

  return (
    <script
      defer
      src={scriptSrc}
      data-website-id={websiteId}
      // data-domains restricts tracking to production only
      data-domains="prostackng.com.ng,www.prostackng.com.ng"
    />
  );
}
