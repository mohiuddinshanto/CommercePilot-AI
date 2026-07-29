# CommercePilot AI — Frontend

Modern, high-performance Next.js 16 (App Router) frontend for CommercePilot AI, featuring React 19, Tailwind CSS v4, TanStack Query, Recharts, and dynamic AI-powered commerce management interfaces.

**Live Application:** `https://commerce-pilot-ai-delta.vercel.app`

## Tech Stack

| Layer | Technology |
|---|---|
| Core Framework | Next.js 16 (App Router with `proxy.ts` security proxy) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Vanilla CSS Design System |
| Data Fetching & Cache | TanStack React Query (v5) |
| Data Visualizations | Recharts |
| Motion & Micro-interactions | Framer Motion |
| Notifications | React Hot Toast |
| Icons | Lucide React |

## Quick Start

```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL, etc.

# Run development server
npm run dev     # http://localhost:3000
```

## Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Start Next.js development server with hot module replacement |
| `npm run build` | `next build` | Build optimized production bundle with static & dynamic page generation |
| `npm start` | `next start` | Launch Next.js production server |
| `npm run lint` | `eslint` | Run ESLint static code analysis |

### Type Checking

To verify TypeScript code correctness without building:

```bash
npx tsc --noEmit
```

## Environment Variables

Create `.env.local` inside `frontend/`:

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | - | Backend Express API base URL (e.g. `https://commerce-pilot-aibackend-b63jib4i6.vercel.app`) |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Frontend application URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No | - | Google OAuth Client ID for social login button |

## Project Structure

```
frontend/
├── src/
│   ├── actions/
│   │   └── auth.ts              # Server Actions for authentication session
│   ├── api/                     # Next.js API handler bridges
│   ├── app/                     # App Router pages and layouts
│   │   ├── (auth)/              # Authentication routes (login, register)
│   │   ├── (dashboard)/         # Protected tenant dashboard routes
│   │   ├── about/               # About page
│   │   ├── admin/               # Super Admin portal routes
│   │   ├── ai/                  # AI Copilot chat routes
│   │   ├── analytics/           # Business intelligence & charts
│   │   ├── blog/                # Blog pages
│   │   ├── bundles/             # Product bundle management
│   │   ├── categories/          # Product categories CRUD
│   │   ├── contact/             # Contact page
│   │   ├── dashboard/           # Main store dashboard overview
│   │   ├── help/                # Help & support center
│   │   ├── inventory/           # Stock tracking, adjustments & alerts
│   │   ├── privacy/             # Privacy policy
│   │   ├── products/            # Product catalog & CRUD
│   │   ├── reports/             # Analytics & financial reports
│   │   ├── returns/             # Order returns & refund management
│   │   ├── sales/               # POS sales & invoice views
│   │   ├── settings/            # Store settings & subscription billing
│   │   ├── staff/               # Staff permission & user management
│   │   ├── error.tsx            # Global Error Boundary component
│   │   ├── loading.tsx          # Global loading skeleton loader
│   │   ├── not-found.tsx        # Custom 404 page
│   │   ├── page.tsx             # Public landing page
│   │   └── layout.tsx           # Root layout & providers wrapper
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Buttons, Modals, Cards, Badges, Inputs
│   │   ├── layout/              # Sidebar, Header, Navigation, Footer
│   │   └── charts/              # Recharts wrappers
│   ├── core/
│   │   ├── api-client.ts        # Central fetch client with automatic headers & 401 handling
│   │   └── better-auth-client.ts# Auth client integration
│   ├── features/                # Domain-driven feature modules
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities & TanStack Query client setup
│   ├── providers/               # Context providers (AuthProvider, QueryProvider)
│   ├── proxy.ts                 # Next.js 16 route security proxy
│   └── types/                   # TypeScript interfaces & types
├── public/                      # Static assets & public images
├── next.config.ts               # Next.js build config & CSP security headers
└── package.json
```

## Key Application Routes

### Public Routes
* `/` — Modern landing page with interactive feature showcases
* `/login` — Email/Password & Google OAuth authentication
* `/register` — Merchant onboarding registration
* `/about`, `/contact`, `/privacy`, `/help`, `/blog` — Public information pages

### Merchant Dashboard Routes (Protected)
* `/dashboard` — Store overview, KPI cards, low stock alerts & AI summaries
* `/products` — Product management, image uploads & SKU search
* `/categories` — Category creation and product hierarchy
* `/inventory` — Stock levels, movement logs & dead stock alerts
* `/sales` — Point-of-Sale (POS) cashier interface & sales history
* `/returns` — Processing customer returns & restock tracking
* `/bundles` — Product bundle packages & promotional pricing
* `/reports` — Financial reports (sales, profit, daily/monthly summaries)
* `/analytics` — Revenue trends, sales channels & growth charts
* `/ai` — Interactive AI Commerce Copilot assistant with history
* `/staff` — Team members & granular permission access controls
* `/settings` — Store details, currency, timezone & subscription management

### Super Admin Portal (Platform Operations)
* `/admin` — System metrics, total stores, server health & activity logs
* `/admin/stores` — Merchant store approval, suspension & detail inspect
* `/admin/users` — Merchant user status & account management
* `/admin/subscriptions` — SaaS plan subscriptions & billing management
* `/admin/activity` — Platform-wide action audit trail logs

## Security & Architecture

* **Route Guard (`proxy.ts`):** Enforces authentication checks using Next.js 16 conventions, seamlessly shielding protected dashboard paths from unauthorized visitors.
* **Unified API Client:** All requests are piped through `api-client.ts` with cross-origin credentials and standard response normalization.
* **Content Security Policy (CSP):** `next.config.ts` dynamically configures secure headers preventing XSS and injection vulnerabilities.

## Styling & Aesthetic Guidelines

* Built with a custom design system adhering to modern glassmorphism, dynamic animations, curated dark/light palettes, and Inter/Outfit Google typography.

## License

Private — CommercePilot AI Platform.
