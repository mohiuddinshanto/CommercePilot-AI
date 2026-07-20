# CommercePilot AI — Frontend

Next.js 16 (App Router) + React 19 SPA with TanStack Query, Tailwind CSS v4, and AI-powered dashboard.

**Live Site:** https://commerce-pilot-ai-delta.vercel.app

## Tech Stack

- Next.js 16 (App Router with `proxy.ts` route protection)
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Query (server state management)
- Recharts (charts)
- Framer Motion (animations)
- React Hot Toast (notifications)
- Lucide React (icons)

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local (see Environment Variables below)
npm run dev    # http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_APP_URL` | No | Frontend URL (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No | Google OAuth client ID (for sign-in button) |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login, Register, Forgot Password pages
│   │   ├── (dashboard)/      # Protected dashboard layout + all pages
│   │   ├── (public)/         # Public pages (landing, /items, /items/[id])
│   │   ├── layout.tsx        # Root layout
│   │   └── not-found.tsx
│   ├── core/
│   │   ├── api-client.ts     # Centralized fetch wrapper with auth + 401 redirect
│   │   └── better-auth-client.ts  # Better Auth client + data extraction (data.data)
│   ├── features/
│   │   ├── auth/             # Login, Register, Forgot Password forms + API
│   │   ├── dashboard/        # Dashboard page + summary hooks
│   │   ├── products/         # Products table, form, detail page, hooks
│   │   ├── categories/       # Categories table, form, hooks
│   │   ├── inventory/        # Inventory table, adjustments, alerts
│   │   ├── sales/            # Sales table, form, detail page
│   │   ├── returns/          # Returns table, form
│   │   ├── customers/        # Customers table, form, detail page
│   │   ├── bundles/          # Bundles table, form
│   │   ├── reports/          # Report pages (sales, inventory, profit, etc.)
│   │   ├── analytics/        # Analytics dashboard with charts
│   │   ├── ai/               # AI chat interface, conversation history
│   │   ├── settings/         # Store settings, profile, staff management
│   │   ├── admin/            # Super admin dashboard, user/store management
│   │   ├── subscriptions/    # Subscription plans, pricing cards
│   │   └── public-products/  # Public storefront (server-side data fetching)
│   ├── components/
│   │   ├── layout/           # Sidebar, header, footer
│   │   └── ui/               # Reusable UI components (button, card, dialog, etc.)
│   ├── providers/
│   │   ├── auth-provider.tsx  # Auth context + session management
│   │   └── query-provider.tsx # TanStack Query provider
│   ├── actions/
│   │   └── auth.ts           # Server actions (getSession)
│   ├── lib/
│   │   └── query-client.ts   # TanStack Query client
│   ├── types/
│   │   └── user.ts           # User, Session types
│   └── proxy.ts              # Route protection (Next.js 16 convention)
├── public/                    # Static assets (images, icons)
├── next.config.ts            # CSP headers, transpile packages
├── middleware.ts              # Empty (deprecated — use proxy.ts)
└── package.json
```

## Pages

### Public

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Email/Google login with demo button |
| `/register` | Email registration |
| `/forgot-password` | Password reset |
| `/items` | Public product catalog with search/filter |
| `/items/[id]` | Public product detail page |

### Dashboard (Protected)

| Route | Description |
|-------|-------------|
| `/dashboard` | Sales overview, KPIs, charts, AI insights |
| `/dashboard/products` | Products list + CRUD |
| `/dashboard/products/new` | Create product |
| `/dashboard/products/[id]` | Product detail |
| `/dashboard/categories` | Categories list + CRUD |
| `/dashboard/inventory` | Inventory stock tracking |
| `/dashboard/inventory/adjustments` | Stock adjustments history |
| `/dashboard/inventory/alerts` | Low stock + dead stock alerts |
| `/dashboard/inventory/dead-stock` | Dead stock detection |
| `/dashboard/sales` | Sales list + create |
| `/dashboard/sales/[id]` | Sale detail / invoice |
| `/dashboard/returns` | Returns list + process |
| `/dashboard/customers` | Customers list + CRUD |
| `/dashboard/customers/[id]` | Customer detail |
| `/dashboard/bundles` | Product bundles list + CRUD |
| `/dashboard/bundles/[id]` | Bundle detail |
| `/dashboard/reports/sales` | Sales report |
| `/dashboard/reports/inventory` | Inventory report |
| `/dashboard/reports/profit` | Profit report |
| `/dashboard/reports/top-products` | Top products report |
| `/dashboard/reports/daily` | Daily report |
| `/dashboard/reports/weekly` | Weekly report |
| `/dashboard/reports/monthly` | Monthly report |
| `/dashboard/analytics` | Revenue, profit, growth charts |
| `/dashboard/ai` | AI Commerce Copilot chat |
| `/dashboard/ai/history` | Conversation history |
| `/dashboard/ai/history/[id]` | Past conversation |
| `/dashboard/settings` | Store settings |
| `/dashboard/profile` | User profile |
| `/dashboard/staff` | Staff management (owner only) |
| `/dashboard/activity` | Activity logs (owner only) |
| `/dashboard/subscriptions` | Subscription plans |

### Super Admin (Protected)

| Route | Description |
|-------|-------------|
| `/super-admin` | Admin dashboard |
| `/super-admin/users` | User management |
| `/super-admin/stores` | Store management |
| `/super-admin/analytics` | Platform analytics |
| `/super-admin/activity` | All activity logs |
| `/super-admin/ai-usage` | AI usage stats |
| `/super-admin/subscription-plans` | Subscription plan management |
| `/super-admin/reports` | Platform reports |

## Authentication

Uses Better Auth with two providers:
- Email/Password
- Google OAuth (optional)

Session is managed via `AuthProvider` which reads cookies server-side and exposes session via React context.

Route protection is handled in `proxy.ts` (Next.js 16 convention — replaces deprecated `middleware.ts`).

## API Communication

All API calls go through `api-client.ts`:

```typescript
// Automatic auth headers + 401 redirect
import { apiClient } from '@/core/api-client';
const data = await apiClient<Product[]>('/products');
```

Better Auth endpoints use `better-auth-client.ts` which extracts `data.data` from responses.

## Deployment

### Vercel

Deployed automatically on push to `main`.

Environment variables to set in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` — your backend API URL
- `NEXT_PUBLIC_APP_URL` — your frontend URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — (optional) Google OAuth client ID

### CSP Headers

Content Security Policy is configured in `next.config.ts` and dynamically reads `NEXT_PUBLIC_API_URL` for `connect-src` and `img-src` directives. Supports comma-separated `CLIENT_URL` values for multiple origins.

## Data Fetching

Uses TanStack Query with hooks:

```typescript
// Example hook pattern
export const useProducts = (params: ProductFilters) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiClient<PaginatedResponse<Product>>('/products', { params }),
  });
};
```

Mutations use `useMutation` with automatic cache invalidation on success.

## Styling

- Tailwind CSS v4 (utility-first)
- Custom theme tokens for colors, spacing, typography
- Responsive design — mobile, tablet, desktop
- Skeleton loaders for loading states
- Framer Motion for page transitions and animations
