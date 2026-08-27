### PD-1 — Foundation & guarded DummyJSON access

| Field | Value |
| :---- | :---- |
| Ticket ID | PD-1 |
| Ticket Name | Foundation & guarded DummyJSON access |
| Status | To Be Done |
| Priority | P0 — Critical |
| Dependencies | Boilerplate (services `performRequest`/axios, `AuthContext`, router). None other — can start immediately. |
| Estimate | FE: 2h |
| Source References | Product Discovery spec (React Learning for Web.md); boilerplate services/constants/types; planning-session decisions |

**Description:** As a developer, I want the boilerplate pointed at DummyJSON, the app reachable past the auth guard in dev, and the shared `products` constants, types, query keys, and routes in place, so that every feature ticket can be built as a thin vertical slice without redoing setup or touching shared infrastructure.

**Acceptance Criteria:**

```gherkin
Feature: Foundation for the products domain

  Scenario: Backend points at DummyJSON
    Given the app environment is configured
    When VITE_BACKEND_BASE_URL is read
    Then it resolves to https://dummyjson.com
    And .env.example documents the same value
    And a performRequest GET to /products returns product data in dev

  Scenario: Dev token seeds so the guard passes in development
    Given a fresh browser with no stored access token
    When the app mounts in a development build
    Then a dev token is set via the auth context so PrivateRoute passes
    And the user lands on the listing route, not /un-authorized
    And this seeding never runs in a production build

  Scenario: Production keeps the guard closed
    Given a production build with no stored token
    When the app mounts
    Then no dev token is seeded
    And protected product routes redirect to /un-authorized

  Scenario: Shared product constants exist and are the single source
    Given the products domain is scaffolded
    When any code needs an endpoint, query key, page size, or route
    Then it imports them from the constants barrel
    And product endpoints, query keys, and PRODUCTS_PAGE_LIMIT (12) are
        defined once, not hardcoded per feature

  Scenario: Product types separate the card shape from the detail shape
    Given the products domain is scaffolded
    When product data is typed
    Then a ProductListItem type covers the selected list fields
    And a Product type covers the full detail object including reviews
    And the paginated response type covers products, total, skip, and limit
    And types are imported with `import type`

  Scenario: Routes and page wrappers are registered behind the guard
    Given the router configuration
    When the products and product-detail routes are added
    Then each is lazy-loaded and wrapped in createPrivateRoute with Suspense
    And the existing /un-authorized route is unchanged
    And the home demo remains present but is not routed over the product routes

  Scenario: Lint and type gate stays green
    Given the foundation changes are complete
    When yarn lint runs
    Then it passes with zero warnings and correct import ordering
```

**Tests to be done:**

_Positive_
- With a valid `.env`, the app boots and a `performRequest` GET `/products` returns products.
- A dev build with no stored token auto-seeds and lands on the listing route.
- Products constants, query keys, types, and routes import cleanly from their barrels; `yarn lint` passes with zero warnings.
- A production build with a valid token renders the guarded product routes.

_Negative_
- A missing or malformed `VITE_BACKEND_BASE_URL` fails env validation at boot with a descriptive error (app does not silently start).
- A production build with no token does **not** seed a token and redirects protected routes to `/un-authorized`.
- The dev-seed effect does **not** run in a production build (no token is written).
- Deep-linking a product route in production with no token redirects to `/un-authorized` instead of rendering the page.
