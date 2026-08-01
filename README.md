# Alaska Dream Vacation — Website (Astro)

Custom aurora-themed direct-booking site for Alaska Dream Vacation. Built with [Astro](https://astro.build).
Hostaway stays the booking/channel backend; this site is the custom front-end (Option B).

## What's here (Phase 1)

- **Homepage** (`/`) — hero + search, trust strip, why-book-direct, featured cabins, aurora experience, reviews, CTA, FAQ, SEO schema.
- **Cabin pages** (`/cabins/[slug]`) — gallery, description, amenities, sticky booking box. Data-driven.
- **Aurora Guide** (`/guide`) and **About/Contact** (`/about`) — content seeds for Phase 2.
- **SEO** — per-page titles/meta/canonical, JSON-LD LodgingBusiness, `/sitemap.xml`, `robots.txt`.
- **Data layer** — `src/lib/hostaway.js` renders from mock data now and **automatically switches to live Hostaway listings** once credentials are set.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Go live with Hostaway data

The site shows placeholder cabins until Hostaway credentials are present. To switch to live listings:

1. In Hostaway: **Settings → Hostaway API → Create** an API key. You get an **Account ID** and an **API Key (secret)**.
2. Create a `.env` file (copy `.env.example`):
   ```
   HOSTAWAY_ACCOUNT_ID=your_account_id
   HOSTAWAY_API_TOKEN=your_api_key_secret
   ```
3. `npm run build` — the site now pulls live listings, photos, pricing, and availability.

> ⚠️ **Never commit `.env`.** It's git-ignored. On Vercel, add these as Environment Variables instead (below).

The mock→live switch lives in `src/lib/hostaway.js` (`hasLiveCredentials()`), and the raw-listing → page-shape mapping is in `mapListing()` — we'll fine-tune that mapping against your real Hostaway fields on the first live build.

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo. Framework preset: **Astro** (auto-detected).
3. **Settings → Environment Variables**: add `HOSTAWAY_ACCOUNT_ID` and `HOSTAWAY_API_TOKEN`.
4. Deploy. Vercel gives you a `*.vercel.app` URL immediately.
5. **Domain:** register `alaskadreamvacation.com`, then in Vercel **Settings → Domains** add it and follow the DNS steps (SSL is automatic).

## Booking hand-off

On cabin pages, the **Reserve** button is wired to hand off to Hostaway (see the comment in `src/pages/cabins/[slug].astro`). We'll point it at each listing's Hostaway checkout URL, or embed the Hostaway calendar widget, on the first live pass — zero payment/PCI burden on this site.

## Next phases

- **Phase 2:** flesh out the Aurora Guide into an SEO content hub; GA4 + Search Console; local-SEO landing pages.
- **Phase 3:** pull real reviews, add live chat/WhatsApp, email capture (Mailchimp/Brevo).
- **Phase 4:** live aurora-forecast widget (NOAA/aurora API), optional own-Stripe checkout, guest CRM.
