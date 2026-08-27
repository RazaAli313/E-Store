# Product Discovery React Training — Project Context

## Purpose

This repository is the approved React + Vite boilerplate used for the **Product Discovery & Catalog Platform** exercise described in [`React Learning for Web.md`](../React%20Learning%20for%20Web.md). The exercise is intended to teach React's web mental model through a realistic catalog: component composition, correct state placement, effects, Context boundaries, TanStack Query server state, semantic HTML, responsive Tailwind styling, and loading/error/empty states.

This note reconciles three primary sources as of 2026-08-24:

1. The root learning brief, `React Learning for Web.md`.
2. The detailed tickets in `docs/index.md` and `docs/PD-1.md` through `docs/PD-5.md`.
3. Claude's implementation handoff at `/Users/cogent/.claude/plans/vectorized-sleeping-horizon.md`.

## Where the requirements live

- `React Learning for Web.md` is the high-level curriculum and product brief. Its project section requires DummyJSON product listing/detail/search/category APIs, responsive UI, semantic HTML, React Query for server data, Tailwind, clear page/data/UI separation, no unnecessary global state, and no Context for API or page state.
- `docs/index.md` is the product-discovery epic and the best concise source for cross-ticket architecture and decisions.
- `docs/PD-1.md` — foundation, DummyJSON environment, development-only auth token, shared product constants/types/routes.
- `docs/PD-2.md` — responsive product grid, URL-driven numbered pagination, loading/error/empty states, detail links.
- `docs/PD-3.md` — per-keystroke search, URL `q`, search pagination and cache behavior.
- `docs/PD-4.md` — category filter and the combined search + category logical-AND behavior.
- `docs/PD-5.md` — full product detail, gallery/reviews, error/not-found states, and return-navigation state.
- `mockups/product-discovery.html` is identified by the handoff as the visual baseline. It is currently untracked, so it is supporting design material rather than committed requirements.

All ticket tables currently say **To Be Done**. Git history supports that status: the current branch is `docs/product-discovery-tickets`, with commits for the initial ticket set and the later change from search/category precedence to logical AND.

## Agreed product behavior

The detailed tickets and Claude handoff are aligned on these decisions:

- `/` becomes the guarded product listing; `/products/:id` becomes the guarded, lazy-loaded detail route.
- DummyJSON (`https://dummyjson.com`) replaces JSONPlaceholder as the backend.
- A token is auto-seeded only in development so learners can enter guarded routes; production remains closed without a real token.
- URL search parameters `q`, `category`, and `page` are the single source of listing state. Context remains auth-only.
- Page size is 12. Full-list and search views paginate on the server with `skip`; category views fetch the complete category and paginate locally.
- Search fires on every keystroke without debounce and uses a term-specific React Query cache.
- Search and category combine as logical AND. Because DummyJSON has no combined endpoint, an active category takes precedence in query selection: fetch that category once, then match the term against title, brand, and description in memory. No search-endpoint request should run while a category is active.
- Server-backed page changes retain previous results while fetching. First loads use a centered spinner; failures use a toast plus inline retry; no-results states are contextual.
- Product cards are responsive semantic `article` elements and link to detail while preserving the listing query string for the return trip.
- Product detail uses one full-product response, including reviews, and handles invalid/nonexistent IDs separately from retryable failures.
- Cart, wishlist, and checkout elements in the mockup are explicitly out of scope.

## Intended code shape

The handoff extends the boilerplate's existing layers rather than introducing a new architecture:

```text
pages/Products.tsx, ProductDetail.tsx
  -> components/products/*
    -> hooks/products/*
      -> data/products/queries/*
        -> services/apiClient.ts (performRequest)
          -> services/axiosInstance.ts
```

Shared endpoints, query keys, routes, page size, and select strings belong in `src/constants/`. Product list/detail/response types belong in `src/types/products/`. The existing home demo stays on disk but is removed from routing. Existing services, storage helpers, app providers, base styling, and the shared button are not meant to be rewritten.

The intended build order is PD-1, PD-2, PD-3, PD-4, then PD-5. The epic notes that PD-3 and PD-5 can be developed independently after PD-2, but the handoff gives the sequential ticket order above.

## Current implementation versus intended work

No Product Discovery feature is implemented in the current checked-out source tree.

| Area | Intended | Current repository state |
| --- | --- | --- |
| Backend | `https://dummyjson.com` | `.env` and `.env.example` still use `https://jsonplaceholder.typicode.com/` |
| Domain | Product constants, types, data hooks, feature hooks, UI, and pages | No `products` domain exists under `src/` |
| Home route | Guarded product listing | Still lazy-loads the original posts `Home` page |
| Detail route | Guarded `/products/:id` | Route and page do not exist |
| Auth convenience | Development-only seeded token | `AuthContext` only reads/writes the existing token; no seed exists |
| API/query constants | Product endpoints and query keys | Only `POSTS` exists |
| URL state | `q`, `category`, `page` via `useSearchParams` | No listing URL-state hook exists |
| Product querying | Full/search/category/detail TanStack Query hooks | Only the home posts query/mutation example exists |
| Product UI states | Grid, pager, spinner, retry, empty/not-found, detail | None exist |

The existing boilerplate already supplies the foundations the exercise expects: React 19, React Router, TanStack Query, Tailwind v4, axios through `performRequest`, auth Context and private routing, toast notifications, Sentry/error boundary integration, import aliases, and lint/format conventions. In other words, this is an implementation gap, not a setup gap.

## Important guardrails for implementation

- Treat the ticket documents as acceptance criteria and Claude's file manifest as a handoff plan, not evidence that code already exists.
- Preserve the existing layering and route guard; do not fetch directly from UI components.
- Use `performRequest`, centralized HTTP/constants/routes/query keys, `import type`, and `#/` aliases.
- Keep auth in Context, server data in React Query, and listing state in the URL.
- Do not add a global store or reuse the boilerplate's page-oriented infinite-scroll helper for DummyJSON's `skip`/`limit` contract.
- Keep the home demo files present but unrouted, as agreed.
- Do not edit `services/*`, `utils/localStorage.ts`, `env.mjs`, `Button.tsx`, `index.css`, `App.tsx`, existing docs, or the mockup unless requirements change.
- Verification currently has no automated test runner. The handoff calls for `yarn lint` with zero warnings, a production build, and a manual browser walkthrough of routing, URL restoration, pagination bounds, query selection, responsive states, errors, and 404s.

## Bottom line

The product has been specified in detail but not built on this branch. The next implementation should begin with PD-1 and use the committed tickets as the authoritative acceptance criteria, with the external Claude plan as the detailed implementation map and `mockups/product-discovery.html` as the visual reference.
