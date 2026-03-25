# RetailBricks LMS

Custom LMS platform — **learn.retailbricks.com**

## Stack
- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth + DB**: Supabase SSR
- **Payments**: Stripe Checkout (one-time per course, AUD)
- **Email**: EmailIt
- **Hosting**: Railway (GitHub auto-deploy)

## Quick Start (Local)

```bash
cp .env.example .env.local
# Fill in your env vars
npm install
npm run dev
# → http://localhost:3000
```

## Environment Variables

See `.env.example` for all required vars.

## Database Setup

1. Open Supabase SQL Editor
2. Run `supabase/schema.sql`
3. Run `supabase/seed.sql`
4. Set your admin role:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

## Supabase Auth Settings

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://learn.retailbricks.com`
- **Redirect URLs**: `https://learn.retailbricks.com/auth/callback`

## Stripe Webhook

Add endpoint in Stripe Dashboard:
- **URL**: `https://learn.retailbricks.com/api/stripe/webhook`
- **Events**: `checkout.session.completed`

## Railway Deploy

1. Create new project → Deploy from GitHub repo
2. Set all env vars from `.env.example`
3. Add custom domain: `learn.retailbricks.com`
4. Copy Railway CNAME → add to retailbricks.com DNS

## Admin Panel

Visit `/admin` when signed in with an admin account.
- Add/update courses (ZIP upload or external URL)
- View users and enrolments

## Course Content

Two options:
1. **External URL** — paste any URL (Notion, Google Slides, hosted HTML). Students are redirected after enrolment.
2. **ZIP Upload** — upload HTML course content. Served via secure proxy.
