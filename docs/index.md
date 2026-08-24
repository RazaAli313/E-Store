# Epic — Product Discovery & Catalog Platform

**Goal:** Build a web-first product browsing experience on top of the approved React + Vite boilerplate. A signed-in user can browse a paginated product catalog, search it, filter by category, and open a product detail page — all data served from DummyJSON through TanStack Query, styled with Tailwind, with URL-driven state and no new global stores. Each feature is a thin vertical slice that reuses the boilerplate's layering and auth rather than introducing new setup.

**Ticket prefix:** PD

**Suggested build order:** PD-1 (foundation) first — it wires DummyJSON, gets the app past the auth guard in dev, and lays down the shared constants, types, query keys, and routes every other ticket imports. Then PD-2 (browse + pagination), the backbone listing page. PD-3 (search) and PD-5 (detail) can proceed in parallel once PD-2 lands, since both build on the listing without depending on each other. PD-4 (category filter) comes after PD-3 because search and category **combine as a logical AND** — when both are active the category is fetched once and filtered by the term in-memory, since no single endpoint does both.

**Sources:** "Product Discovery & Catalog Platform" spec (React Learning for Web.md); the approved frontend boilerplate (layering, auth guard, `performRequest`/axios services); design decisions from the planning session (DummyJSON, combined search + category filtering as a logical AND, numbered pages @ limit 12, URL search-param state, keep the auth guard + dev-token seed, `keepPreviousData`, `select` on list payloads, Prev/Next disable at bounds, react-toastify errors, spinner loading, contextual empty states).

| ID | Name | Status | FE | PR Review |
| :---- | :---- | :---- | :---- | :---- |
| PD-1 | Foundation & guarded DummyJSON access | To Be Done | 2h | 0.5h |
| PD-2 | Browse products with pagination | To Be Done | 7h | 1h |
| PD-3 | Search products | To Be Done | 3h | 0.5h |
| PD-4 | Filter products by category | To Be Done | 2h | 0.5h |
| PD-5 | View product detail | To Be Done | 4h | 1h |
| — | Learning — React concepts + TanStack Query | Ongoing | 4h | — |
| **Total** |  |  | **22h** | **3.5h** |

## Data Source (DummyJSON)

Base URL `https://dummyjson.com`. All calls go through the boilerplate's `performRequest` → axios instance (auth header + snake/camel case conversion applied automatically).

| Purpose | Endpoint | Notes |
| :---- | :---- | :---- |
| Product listing | `GET /products?limit=&skip=&select=` | returns `{ products, total, skip, limit }`; `total` = 194 |
| Search | `GET /products/search?q=&limit=&skip=` | own endpoint; supports `skip` |
| Category products | `GET /products/category/{slug}?limit=&skip=` | own endpoint; supports `skip` |
| Category list | `GET /products/category-list` | 24 category slugs |
| Product detail | `GET /products/{id}` | full object incl. `images[]`, `reviews[]` |

**Key constraint:** there is **no endpoint that combines search + category**. When a category is active, the whole category is fetched once (`limit=0`, ≤30 items) and the search term is applied in-memory as a logical AND (see filtering guardrail).

## Architecture & Layering (from the boilerplate)

New `products` domain added alongside the untouched `home` demo, following the boilerplate's separation:

```
pages/<Products|ProductDetail>.tsx     thin route entries, lazy-loaded, wrapped in createPrivateRoute
components/products/*                   UI only (ProductsList, ProductDetail, ProductGrid, ProductCard,
                                        SearchBar, CategoryFilter, Pagination, Layout)
hooks/products/*                        business logic (view resolution, in-memory AND filter, skip math, totalPages)
data/products/queries/*                 React Query hooks (useQuery + keys + keepPreviousData + select)
services/                               performRequest + axiosInstance (unchanged)
constants/ types/products/              endpoints, query keys, routes, ProductListItem vs Product
```

## Scope Guardrails

- **Build on the boilerplate. No custom project setup or ad-hoc config.** Tailwind + React Query come from the boilerplate.
- **All server data via React Query.** Do **not** reuse the page-based `useInfiniteScrollQuery` / `getNextPageParamHelper` — they send a `page` param and read `data/items/results`, but DummyJSON needs `skip`/`limit` and returns `products`. Numbered pages use a plain `useQuery` mirroring `useGetPosts`, computing `skip = (page-1) * limit` in the `products` domain. Shared infra stays untouched.
- **Filtering (search + category combine as a logical AND):** category selected → fetch the whole category once (`/category/{slug}?limit=0`, ≤30 items) and, if `q` is also present, filter it in-memory to titles/brands/descriptions matching the term, paginating the filtered list client-side. No category, `q` present → server-side `/search`. Neither → `/products`. There is no request to the search endpoint while a category is active.
- **Pagination:** numbered pages, `limit = 12`, `totalPages = ceil(total/12)`. For server-side views (full catalog, search-only) `skip = (page-1)*12` is sent to the API; for a category view the whole category is fetched once and the page is sliced in-memory. Windowed pager (`« Prev 1 … 5 [6] 7 … 17 Next »`). **Prev disabled at page 1, Next disabled at the last page** — buttons cannot navigate out of range. `placeholderData: keepPreviousData` for flicker-free transitions.
- **State placement:** URL search params (`?q=&category=&page=`) are the single source of truth via `useSearchParams`. **No Context for page or API state.** Changing `q` or `category` resets `page=1`. Search fires **on each keystroke (no debounce)** — React Query caches results per term and ignores out-of-order responses so the current term always wins.
- **Payloads:** list/search/category use `select=title,price,thumbnail,rating,category`; the detail page fetches the full product.
- **UI states:** centered spinner on first load; **react-toastify** toast on query error (plus a minimal inline fallback + retry via `refetch`); contextual empty message with a "Clear filters" affordance.
- **Semantics & responsiveness:** semantic `header/main/section/article`; responsive grid 1 col (mobile) → 2 (tablet) → 3–4 (desktop); labelled controls and `alt` on images. Minimal custom CSS — Tailwind only.

## Roles & Access

There is **no role/designation system** — access is binary, based on the boilerplate's token-presence guard (`PrivateRoute`). All product routes sit behind it.

| Context | Access to product routes |
| :---- | :---- |
| Dev | A dev token is **auto-seeded** on mount so the guard passes with no friction (never runs in production builds). |
| Production | A real token must be set by a login flow (out of scope for this epic); without it, routes redirect to `/un-authorized`. |
