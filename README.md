# Punctual Booking (Frontend)

A modern, type-safe React frontend for a multi-tenant appointment booking SaaS. Customers can book services with staff; admins and staff manage services, staff, bookings, and business settings.

---

## ✨ Features

- Authentication with roles: Customer, Staff, Admin
- Customer booking flow: Staff selection → Service selection → Date/Time → Confirmation → Success
- Admin/Staff portal: Dashboard, Services, Staff, Bookings, Staff Calendar, Settings
- Staff Calendar: day/week/month views with event tooltips and status coloring
- Internationalization: English and Portuguese out of the box
- Mockable data layer via feature flags for local development
- Strong UX: Shadcn UI + Radix primitives + TailwindCSS
- State and data:
  - TanStack Router (route guards, preloading)
  - TanStack Query (server cache, mutations)
  - Zustand (lightweight UI/domain state)
- Strict TypeScript, ESLint, Prettier

---

## 🧱 Tech Stack

- React 18, TypeScript, Vite
- TanStack Router, TanStack Query
- Zustand
- i18next (with HTTP backend + language detector)
- Shadcn UI components (locally generated) + Radix UI
- TailwindCSS (+ tailwind-merge) and utility helpers

---

## 📦 Project Structure (high-level)

```
src/
  components/
    admin/            # Admin views & modals
    customer/         # Customer-facing components
    ui/               # Shadcn-style UI primitives (local)
  hooks/              # React Query hooks, auth/appointments
  layouts/            # Admin & Customer layouts
  lib/                # i18n, query client, utilities
  pages/
    admin/            # Admin pages (Dashboard, Services, Staff, Bookings, Settings, StaffCalendar)
    user/             # Customer pages (Services, StaffSelection, Booking, Confirmation, Success, Dashboard)
  providers/          # App-wide providers (Theme, Query, Auth)
  router.tsx          # TanStack Router configuration & guards
  services/           # API services for auth, appointments, staff, services
  stores/             # Zustand stores (settings, staff, services, booking)
  types/              # Shared domain types & DTO mapping
  utils/              # Validation, formatting, helpers
public/locales/       # i18n translation JSONs (en, pt)
```

---

## 🔐 Authentication & Routing

- Tokens are stored in `localStorage` and read by `src/services/auth/*`.
- `AuthProvider` initializes user state and seeds React Query’s `['user']` cache.
- Route guards in `src/router.tsx` redirect by role:
  - Customer → `/user/dashboard`
  - Admin/Staff → `/admin/dashboard`
- Login stores tokens, then fetches `/api/user/me` to populate the user.

---

## 🔁 Data Layer & Mocks

- All remote calls live under `src/services/*`.
- Mocking is controlled via feature flags in `src/config.ts`:
  - `VITE_MOCK_AUTH`
  - `VITE_MOCK_APPOINTMENTS`
  - `VITE_MOCK_STAFF`
  - `VITE_MOCK_SERVICES`
- When enabled, services return deterministic mock data from `src/mocks/*`.

> Note: The repository currently defaults these flags to `true` in `src/config.ts` for local development. Set them to `false` in your `.env` when integrating with a real backend.

---

## 🌍 Internationalization

- i18n is configured in `src/lib/i18n.ts`.
- Translations are loaded from `public/locales/{en|pt}/common.json`.
- Use the `useTranslation()` hook and the `common` namespace for all strings.

---

## 🎨 UI System (Shadcn UI)

- UI components are generated locally under `src/components/ui/*`.
- Never import from a remote Shadcn package.
- To add a component:

```
yarn shadcn@latest add <component-name>
```

> Then import from `@/components/ui/<component>`.

---

## ⚙️ Environment Variables

Create a `.env` or `.env.local` in the project root:

```
# Backend base URL (used by most services)
VITE_API_URL=http://localhost:5000

# Alternative backend base URL (used by auth services)
# If you use this, align it with VITE_API_URL
VITE_BACKEND_URL=http://localhost:5000

# Business scoping
VITE_BUSINESS_ID=my-business-id

# Mock flags (set to false when you connect to a real backend)
VITE_MOCK_AUTH=true
VITE_MOCK_APPOINTMENTS=true
VITE_MOCK_STAFF=true
VITE_MOCK_SERVICES=true
```

Notes:

- Auth services read `VITE_BACKEND_URL` via `src/config/api.ts`.
- Other services read `VITE_API_URL` via `src/config.ts`.
- For consistency, set both to the same value for your backend.

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn (examples use npm)

### Install

```
npm install
```

### Run (dev)

```
npm run dev
```

### Build

```
npm run build
```

### Preview build

```
npm run preview
```

### Lint

```
npm run lint
```

---

## 📚 Key Scripts

- `dev`: Start Vite dev server
- `build`: Type-check and build production bundle
- `preview`: Preview the production build
- `lint`: Run ESLint

---

## 🧭 Core Flows

- Customer booking

  1. `/user/staff-selection`
  2. `/user/services`
  3. `/user/booking` (choose date/time)
  4. `/user/confirmation`
  5. `/user/booking-success`

- Admin & Staff
  - `/admin/dashboard`, `/admin/services`, `/admin/staff`, `/admin/bookings`, `/admin/settings`, `/admin/staff-calendar`

---

## 🧩 Architecture Notes

- `AuthProvider` runs once at startup, reads tokens, and caches the user in React Query.
- Hooks in `src/hooks/*` encapsulate server interactions and cache updates.
- DTOs from the API are mapped to client models (see `src/types/appointment.ts`).
- Zod is used for form validation across admin and customer flows.

---

## ✅ Quality

- TypeScript is set to `strict` mode (see `tsconfig.json`).
- ESLint + Prettier are configured and used in CI/CD recommendations.
- Follow the local `.cursorrules` (Full-Stack Engineer Rules) for contributions.

---

## 🧪 Testing (recommended setup)

> Coming soon. Suggested stack: Jest + React Testing Library + ts-jest.

- Test core business logic, hooks, and page flows.
- Add smoke tests for route guards and role redirects.

---

## 🚀 Deployment

- Ensure all environment variables are set for production
  - `VITE_API_URL` and (if used) `VITE_BACKEND_URL` should point to your API origin
  - Disable mocks: set all `VITE_MOCK_*` to `false`
- Build with `npm run build`, then serve `dist/` with your host of choice.

---

## 🗺️ Roadmap

- Wire real CRUD for Services, Staff, and Bookings (admin modals)
- Availability engine: time-slot generation, min/max notice, buffers, capacity, conflict checks
- Payments and invoicing
- Notifications: email/SMS reminders
- Test suite with CI

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Follow TypeScript strictness; no `any`
3. Keep components functional with hooks; use Shadcn UI primitives
4. Place all API calls under `src/services/*`
5. Add validations with Zod and keep UI accessible
6. Run `npm run lint` before pushing

---

## 📄 License

MIT © Punctual Booking
