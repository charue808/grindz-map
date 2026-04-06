# Grindz Map 🗺️🍱

AI-powered Hawaii food discovery platform that ingests YouTube food review videos, extracts restaurant data, and displays results on an interactive map.

## How It Works

1. **Share a YouTube video** from your phone via Android's share sheet → hits an n8n webhook
2. **n8n pipeline** extracts video metadata, sends to Gemini AI to pull out restaurant names, food items, vibe scores, and review summaries
3. **Mapbox Geocoding** validates and geocodes restaurant addresses
4. **Supabase** stores all restaurant and review data
5. **SvelteKit app** displays restaurants on a public Mapbox map with an admin panel for data cleanup

## Tech Stack

- **Frontend:** SvelteKit, Mapbox GL JS
- **Backend:** SvelteKit (server routes), Supabase
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (magic link)
- **AI:** Gemini AI (via n8n)
- **Automation:** n8n (self-hosted on Hetzner VPS)
- **Env Management:** Varlock
- **Runtime:** Bun
- **Deployment:** Netlify

## Project Structure

```
grindz-map/
├── src/
│   ├── lib/
│   │   ├── supabase.ts              # Browser Supabase client
│   │   └── server/
│   │       └── supabase-server.ts   # Server-side Supabase client
│   ├── routes/
│   │   ├── +page.svelte             # Public map
│   │   ├── +page.server.ts          # Load restaurants for map
│   │   ├── api/
│   │   │   └── geocode/+server.ts   # Mapbox geocoding proxy
│   │   ├── auth/
│   │   │   ├── login/+page.svelte   # Magic link login
│   │   │   └── callback/+server.ts  # Auth callback
│   │   └── admin/
│   │       ├── +layout.server.ts    # Auth guard
│   │       ├── +layout.svelte       # Admin shell
│   │       ├── +page.server.ts      # Restaurant list loader
│   │       ├── +page.svelte         # Restaurant dashboard
│   │       └── restaurant/
│   │           └── [id]/
│   │               ├── +page.server.ts  # Load/update restaurant
│   │               └── +page.svelte     # Edit form + map preview
│   ├── hooks.server.ts              # Auth session middleware
│   └── app.d.ts                     # Type definitions
├── .env.schema                      # Varlock env schema (committed)
├── .env                             # Local env values (gitignored)
├── svelte.config.js
└── vite.config.ts
```

## Database Schema

**restaurants**
- `id`, `name`, `neighborhood`, `island`, `address`
- `latitude`, `longitude`, `mapbox_id`
- `vibe_score`, `review_count`
- `created_at`

**reviews**
- `id`, `restaurant_id` (FK → restaurants)
- `video_url`, `food_items` (jsonb), `sentiment`
- `vibe_score`, `review_summary`, `actual_quote`
- `status` (pending/approved/published)
- `created_at`

## Features

### Completed

- [x] n8n pipeline: YouTube video → Gemini AI extraction → Supabase insert
- [x] Android share-to-webhook flow (HTTP Shortcuts app)
- [x] Supabase schema with restaurants and reviews tables
- [x] SvelteKit project scaffolding with Bun
- [x] Supabase Auth with magic link login
- [x] Auth-guarded admin panel
- [x] Admin restaurant list with missing data indicators
- [x] Admin restaurant edit page with form
- [x] Mapbox geocoding proxy (server-side, token not exposed)
- [x] Address validation with Mapbox Geocoding v6
- [x] Map preview on edit page with pin confirmation
- [x] Public map with restaurant pins and info popups
- [x] Varlock env variable management and schema
- [x] Row Level Security policies

### Next Up

- [ ] Style admin panel and public map (Tailwind)
- [ ] Public restaurant detail page (`/restaurant/[id]`)
- [ ] Filter/search on public map (by neighborhood, food type)
- [ ] Review approval flow in admin (pending → approved → published)
- [ ] Aggregate vibe scores on restaurant level
- [ ] YouTube Shorts support in n8n pipeline
- [ ] Channels table with creator profiles and social links
- [ ] Channel search/browse page
- [ ] Food tags table for filtering (poke, malasadas, plate lunch, etc.)
- [ ] Map clustering for dense areas
- [ ] Mobile-responsive layout
- [ ] Netlify deployment

## Getting Started

```bash
# Install dependencies
bun install

# Set up env variables
cp .env.example .env  # add your keys
bunx varlock load     # validate env schema

# Run dev server
bun run dev
```

## Environment Variables

See `.env.schema` for the full list with types and validation. Key variables:

- `PUBLIC_SUPABASE_URL` — Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-only)
- `PUBLIC_MAPBOX_ACCESS_TOKEN` — Mapbox public token (client-side map)