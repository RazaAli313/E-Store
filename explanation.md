# Product Discovery Application — Beginner's Code Guide

This guide explains what the application does, how its folders are organized, and how data travels from a browser request to the screen.

## 1. What the application does

The project is a small product-discovery storefront. A user can:

- View products from DummyJSON.
- Search, filter by category, and move between pages.
- Open a product-detail page.
- View images, pricing, discount, stock, description, SKU, shipping, and reviews.
- Add products to a cart or wishlist.
- Open the cart drawer, remove items, see the subtotal, and start a demo checkout.

There is no project-owned backend or database. Products come from DummyJSON. Cart and wishlist data currently lives in React memory and resets after a full refresh.

## 2. Main tools used

### React

React builds the interface from components. A component is a function that returns JSX. JSX resembles HTML but can contain JavaScript values and logic.

### TypeScript

TypeScript describes expected data shapes and catches mistakes during development. For example, `ProductListItem` requires a numeric `id`, string `title`, and numeric `price`.

Types disappear from the production JavaScript. An interface does not validate an API response at runtime; it tells the compiler what shape we expect. Runtime validation would require additional code or a library such as Zod.

### React Router

React Router reads the browser URL and selects a page:

```text
/app                -> product listing
/app/products/7     -> details for product 7
/app?q=phone&page=2 -> listing with URL state
```

### TanStack React Query

React Query manages server data. It starts API requests, caches successful responses, and provides values such as `isLoading`, `isError`, and `data`.

### Axios

Axios performs the HTTP request. React Query manages when it should run; Axios sends it.

### React Context

Context shares client-owned state with distant components without passing props through every level:

- `AuthContext` shares the authentication token.
- `CommerceContext` shares cart and wishlist state.

### Tailwind CSS

Tailwind utility classes style the UI. For example, `bg-indigo-600` adds a background color and `px-4` adds horizontal padding.

## 3. Application startup

```text
index.html
  -> src/main.tsx
  -> src/App.tsx
  -> global providers
  -> RouterProvider
  -> matching page
  -> feature components
```

`src/main.tsx` finds `<div id="root">` and renders `<App />` inside it. `React.StrictMode` helps detect unsafe React behavior during development.

`src/App.tsx` creates this provider tree:

```text
ErrorBoundary
  AuthProvider
    CommerceProvider
      QueryClientProvider
        RouterProvider
```

The order matters: a component can use a provider only when rendered inside it.

- `ErrorBoundary` catches unexpected rendering errors.
- `AuthProvider` supplies authentication state.
- `CommerceProvider` supplies cart and wishlist state.
- `QueryClientProvider` enables React Query.
- `RouterProvider` displays the page matching the URL.
- `ToastContainer` displays notifications.
- `ReactQueryDevtools` helps inspect queries in development.

## 4. Two meanings of “request”

### Browser navigation request

When the browser visits `/app/products/7`, React Router reads the URL and selects the product-detail page. This is client-side routing.

### HTTP API request

After selecting that page, the application requests product data:

```http
GET https://dummyjson.com/products/7
```

The server returns JSON. React Query stores it, a hook exposes it, and React renders it.

## 5. Product-list request-to-response flow

Suppose the browser opens:

```text
/app?q=phone&category=smartphones&page=2
```

The complete flow is:

```text
1. React Router matches `/app`.
2. PrivateRoute checks the authentication token.
3. Products page renders ProductsList.
4. ProductsList calls useProducts.
5. useProductListParams reads q, category, and page from the URL.
6. useProducts selects the correct React Query hook.
7. The query hook calls performRequest.
8. Axios builds and sends the HTTP request.
9. DummyJSON returns JSON.
10. The Axios interceptor converts keys to camelCase.
11. performRequest returns response.data.
12. React Query caches the response and updates query state.
13. useProducts filters or paginates when needed.
14. ProductsList chooses loading, error, empty, or success UI.
15. ProductGrid maps products into ProductCard components.
16. React updates the browser DOM.
```

### How `useProducts` chooses the request

`src/hooks/products/useProducts.ts` coordinates three queries:

- No search/category: `useGetProducts`.
- Search only: `useSearchProducts`.
- Category selected: `useGetCategoryProducts`.
- Category plus search: fetch the category and filter its products in memory.

Only the relevant query is enabled, preventing three requests for one screen.

### Pagination

The UI displays 12 products per page. The API uses `skip` and `limit`:

```ts
skip = (page - 1) * 12;
```

Page 1 skips 0, page 2 skips 12, and page 3 skips 24.

## 6. URL state

`useProductListParams` treats the URL as the source of truth for search, category, and page. This means filters survive refresh, browser Back/Forward works, and a filtered URL can be shared.

URL values are strings because URLs are text. `/products/7` initially supplies `id` as `'7'`. `useProductDetail` converts and validates it:

```ts
const productId = Number(id);
```

The application checks that it is a finite positive number before starting the query.

## 7. Product-detail flow

```text
ProductCard Link
  -> /products/:id
  -> React Router
  -> ProductDetail page
  -> ProductDetail component
  -> useProductDetail
  -> useGetProduct
  -> GET /products/:id
  -> React Query cache
  -> detail UI
```

`useProductDetail` distinguishes loading, not-found, other error, and success states. The selected gallery image uses local `useState`; the product itself remains server state managed by React Query.

## 8. API layer

### Endpoints

`src/constants/apiEndpoints.ts` keeps endpoint strings in one place. Dynamic functions such as `productDetail(id)` generate URLs containing an ID.

### Query keys

`src/constants/queryKeys.ts` contains cache identifiers. A key such as `[PRODUCT_DETAIL, 7]` prevents product 7 and product 8 from sharing the same cache entry.

### Query files

`src/data/products/queries/` connects React Query to the API:

- `getProducts.ts`: a normal product page.
- `searchProducts.ts`: searched products.
- `getCategoryProducts.ts`: products in a category.
- `getCategoryList.ts`: category names.
- `getProduct.ts`: one product by ID.

These files communicate with the server; they do not render UI.

### Cancellation

React Query supplies an `AbortSignal`, passed to Axios as `config: { signal }`. A request can be cancelled when it is no longer needed.

### Shared request client

`src/services/apiClient.ts` wraps Axios. It accepts method, URL, query parameters, payload, and configuration, then returns `res.data` rather than the full Axios response.

`src/services/axiosInstance.ts` configures:

- Base URL from `VITE_BACKEND_BASE_URL`.
- JSON headers.
- Authorization header when a token exists.
- Request keys from camelCase to snake_case.
- Response keys from snake_case to camelCase.

Top-level arrays use `snakeArray`/`camelArray`; objects use `snakeKeys`/`camelKeys`. This prevents a category array from becoming an object and breaking `.map()`.

## 9. Authentication flow

`AuthContext` stores the token in React state and local storage. Development receives a fake token so protected pages can be studied without a login backend. `import.meta.env.DEV` is supplied by Vite, so production does not use this fake-token branch.

`PrivateRoute` behaves like this:

```text
token exists  -> render requested page
token missing -> redirect to unauthorized page
```

The Axios request interceptor reads the token and adds `Authorization: Bearer <token>`.

Frontend variables beginning with `VITE_` are included in browser JavaScript and must never contain private server secrets. Real authorization must always be enforced on the backend.

## 10. Cart and wishlist flow

Cart and wishlist are client state, so they use `CommerceContext`, not React Query:

```text
ProductDetail button
  -> useCommerce()
  -> addToCart(product) or toggleWishlist(id)
  -> CommerceProvider updates state
  -> subscribed components re-render
  -> navbar count and drawer update
```

Adding a new product creates `{ product, quantity: 1 }`. Adding it again increments the quantity. Removing filters it out by ID. `cartCount` sums quantities, while `subtotal` sums `price * quantity`.

The wishlist stores product IDs. `toggleWishlist` adds a missing ID or removes an existing one. `aria-pressed` communicates the selected state to assistive technology.

`useCallback` keeps action references stable. `useMemo` keeps the context value stable until its dependencies change. These reduce unnecessary context-consumer renders.

## 11. UI component responsibilities

- `ProductsList`: coordinates the listing screen and its states.
- `StoreHeader`: logo, search slot, cart button, and drawer mounting.
- `SearchBar`: controlled search input.
- `CategoryFilter`: selector and category query.
- `ProductGrid`: responsive layout.
- `ProductCard`: one product summary and detail link.
- `Pagination`: page navigation.
- `ProductDetail`: product information and commerce actions.
- `CartDrawer`: items, removal, subtotal, and demo checkout.
- `Spinner`: loading presentation.
- `StateMessage`: reusable empty/error presentation.

This follows the single-responsibility principle: each component has one main job.

## 12. UI states and errors

`ProductsList` handles:

```text
isLoading -> Spinner
isError   -> retry message
isEmpty   -> guidance or clear-filters action
success   -> ProductGrid and Pagination
```

Query states handle expected network failures. The application-level `ErrorBoundary` handles unexpected JavaScript/rendering errors.

## 13. Type organization

`src/types/products/product.types.ts` defines domain data:

- `ProductListItem`: card/list fields.
- `ProductDetailData`: list fields plus detail-only fields.
- `ProductReview`: one review.
- `ProductsResponse`: products and pagination metadata.
- `CategoryList`: array of category strings.

`src/types/products/api.types.ts` defines request parameters, query options, and hook return values. This separates “What is a product?” from “How does this query/hook operate?”

## 14. Folder structure

```text
frontend-boilerplate/
├── docs/                     Tickets and project context
├── mockups/                  Visual design reference
├── src/
│   ├── assets/               Images and SVG files
│   ├── components/           Rendered UI grouped by feature
│   │   └── products/         Product, search, cart, and state UI
│   ├── constants/            Routes, endpoints, keys, shared values
│   ├── context/              Authentication and commerce providers
│   ├── data/                 React Query server-data hooks
│   ├── hooks/                Coordination logic and helpers
│   ├── pages/                Thin route entry components
│   ├── routes/               Router and protected-route logic
│   ├── schemas/              Runtime form-validation schemas
│   ├── services/             Axios and request helpers
│   ├── types/                TypeScript types/interfaces
│   ├── utils/                Shared utility functions
│   ├── App.tsx               Providers and router mounting
│   ├── index.css             Global CSS/Tailwind setup
│   └── main.tsx              React entry point
├── .env                      Local ignored environment values
├── .env.example              Safe environment template
├── vite.config.ts            Build, plugins, aliases, dev server
└── package.json              Dependencies and scripts
```

## 15. Thin pages

`pages/Products.tsx` only renders `ProductsList`, and `pages/ProductDetail.tsx` only renders the detail feature. The router imports page entry points while reusable implementation remains under `components`.

## 16. Barrel files

A barrel is an `index.ts` that re-exports a folder's public items. It allows:

```ts
import { ProductDetail, ProductsList } from '#/components/products';
```

instead of separate deep imports. Barrels improve organization but should not grow into circular dependencies.

## 17. The `#/` import prefix

Vite maps `#` to `src` in `vite.config.ts`. Therefore:

```ts
import { ROUTES } from '#/constants';
```

means “import from `src/constants`.” It avoids paths like `../../../constants`. `#env` is another alias for the environment configuration module.

## 18. Four kinds of state

### Local state

Use when one component owns the value: selected gallery image or drawer open/closed.

### URL state

Use when refresh, navigation, and sharing should preserve it: search, category, and page.

### Context state

Use for client-owned values needed by distant components: authentication, cart, and wishlist.

### Server state

Use React Query for external data with loading, errors, caching, and refetching: products and categories.

## 19. Security ideas used

- Product descriptions render as text, not raw HTML.
- Image URLs accept only `http:` or `https:`.
- Product IDs are converted and validated before requests.
- Development token behavior uses `import.meta.env.DEV`.
- Request cancellation reduces outdated network work.
- No private API secret is placed in a product component.

A production system would still need backend authentication/authorization, runtime API validation, secure token design, payment integration, and server persistence.

## 20. Current limitations

- Cart and wishlist reset on refresh.
- Checkout is a demo notification only.
- There is no real login backend.
- TypeScript does not validate API data at runtime.
- Category-plus-search filtering happens in browser memory.
- No automated test runner is configured in `package.json`.

## 21. Recommended reading order

1. `src/main.tsx` — React startup.
2. `src/App.tsx` — global providers.
3. `src/routes/createBrowserRouter.tsx` — URL-to-page matching.
4. `src/routes/PrivateRoute.tsx` — route protection.
5. `src/pages/Products.tsx` — listing entry.
6. `src/components/products/ProductsList.tsx` — UI composition.
7. `src/hooks/products/useProductListParams.ts` — URL state.
8. `src/hooks/products/useProducts.ts` — query selection.
9. `src/data/products/queries/getProducts.ts` — React Query request.
10. `src/services/apiClient.ts` — shared request wrapper.
11. `src/services/axiosInstance.ts` — headers/interceptors.
12. `src/components/products/ProductGrid.tsx` and `ProductCard.tsx` — rendering lists.
13. `src/hooks/products/useProductDetail.ts` — route ID conversion.
14. `src/components/products/ProductDetail.tsx` — detail UI/actions.
15. `src/context/CommerceContext.tsx` — cart/wishlist state.
16. `src/components/products/CartDrawer.tsx` — shared state rendered.

## 22. One-sentence mental model

React Router chooses the page, custom hooks organize page logic, React Query manages API state, Axios sends HTTP requests, contexts share client state, and components turn all of that state into the interface the user sees.
