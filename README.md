# ProStack NG — Full-Stack Website Deployment Guide

## Stack Summary
| Layer       | Service        | Cost    | Why                                           |
|-------------|----------------|---------|-----------------------------------------------|
| Frontend    | Next.js 14     | Free    | SSR, SEO, API routes — one codebase          |
| Hosting     | Vercel         | Free    | Auto-deploys from GitHub, built for Next.js  |
| Database    | Supabase       | Free    | PostgreSQL, **never deletes your data**       |
| Protection  | Cloudflare     | Free    | DDoS, CDN, SSL, sits in front of Vercel      |
| Analytics   | Umami          | Free    | Self-hosted, GDPR-clean, no limits           |
| Email       | Resend         | Free    | 3,000 emails/month free                       |

---

## STEP 1 — Set Up Supabase (5 minutes)

1. Go to **supabase.com** → Create account → New project
2. Name it: `prostackng-website`  
3. Choose region: **West Europe** (closest free region to Nigeria)
4. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
5. Go to **Settings → API**  
   Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**never expose this publicly**)

---

## STEP 2 — Set Up Resend (email, 2 minutes)

1. Go to **resend.com** → Sign up
2. Add your domain: `prostackng.com`  
   Add the DNS records they give you to Cloudflare
3. Create an API key → copy it → `RESEND_API_KEY`
4. Verify `contact@prostackng.com` as your sending address

---

## STEP 3 — Set Up Umami Analytics (10 minutes)

Umami is self-hosted analytics — no data sold, no limits, GDPR-clean.

1. Go to **umami.is** → Deploy on Railway (free) OR deploy to Vercel  
   Easiest: **Railway** → New project → Deploy from template → search "Umami"
2. It will give you a URL like `umami-xxx.railway.app`
3. Log in → Add website → `prostackng.com`
4. Copy the Website ID → `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
5. Set `NEXT_PUBLIC_UMAMI_URL` to your Umami Railway URL  
   (Later point this to `analytics.prostackng.com` via Cloudflare CNAME)

---

## STEP 4 — Deploy to GitHub + Vercel

### 4a. Push to GitHub
```powershell
# In the prostackng-website folder
git init
git add .
git commit -m "Initial commit — ProStack NG v2 full-stack site"
git branch -M main
git remote add origin https://github.com/PereTheDataAnalyst/prostackng-website.git
git push -u origin main
```

### 4b. Connect to Vercel
1. Go to **vercel.com** → Import project → select your GitHub repo
2. Framework: **Next.js** (auto-detected)
3. Add all environment variables from `.env.example` with real values
4. Click Deploy → done

### 4c. Add custom domain on Vercel
1. Vercel dashboard → your project → Settings → Domains
2. Add: `prostackng.com` and `www.prostackng.com`
3. Vercel gives you DNS records to add

---

## STEP 5 — Set Up Cloudflare (10 minutes)

Cloudflare sits **in front of** Vercel and adds DDoS protection, CDN, and SSL.

1. Go to **cloudflare.com** → Add site → `prostackng.com`
2. Change your domain nameservers at your registrar (Whogohost) to Cloudflare's nameservers
3. In Cloudflare DNS, add:
   ```
   CNAME   @     cname.vercel-dns.com    Proxied ✓
   CNAME   www   cname.vercel-dns.com    Proxied ✓
   ```
4. SSL/TLS → set to **Full (Strict)**
5. Speed → Optimization → Enable **Auto Minify** (HTML, CSS, JS)
6. Security → set to **Medium**

That's it. Cloudflare now sits in front of everything.

---

## STEP 6 — Update Environment Variables on Vercel

In Vercel dashboard → your project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = your-anon-key
SUPABASE_SERVICE_ROLE_KEY       = your-service-role-key
RESEND_API_KEY                  = re_xxxx
CONTACT_EMAIL                   = contact@prostackng.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID    = your-umami-id
NEXT_PUBLIC_UMAMI_URL           = https://analytics.prostackng.com
NEXT_PUBLIC_SITE_URL            = https://prostackng.com
```

---

## Future Deploys (once set up)

```powershell
git add .
git commit -m "describe your changes"
git push origin main
# Vercel auto-deploys in ~45 seconds. Done.
```

---

## Viewing Contact Form Submissions

All form submissions are saved permanently in Supabase:
- Go to **supabase.com** → your project → Table Editor → `contact_submissions`
- Every submission is there forever, queryable, exportable

---

## Adding a New Product to the Site

1. Open `lib/data.ts`
2. Add the product to the `PRODUCTS` array with all fields
3. `git add . && git commit -m "Add [ProductName]" && git push`
4. Vercel auto-deploys in ~45 seconds

---

## Local Development

```powershell
# Copy env template
cp .env.example .env.local
# Fill in your real values in .env.local

npm install
npm run dev
# Visit http://localhost:3000
```
