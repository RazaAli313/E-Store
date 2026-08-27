### PD-2 — Browse products with pagination

| Field | Value |
| :---- | :---- |
| Ticket ID | PD-2 |
| Ticket Name | Browse products with pagination |
| Status | To Be Done |
| Priority | P0 — Critical |
| Dependencies | PD-1 (foundation, constants, types, routes, guarded access) |
| Estimate | FE: 7h |
| Source References | Product Discovery spec; DummyJSON `/products`; planning-session pagination decisions |

**Description:** As a signed-in user, I want to see a responsive grid of products on the home page and page through the whole catalog with numbered pages, so that I can browse all products in manageable chunks with the page reflected in the URL — while loading, error, and empty states keep me informed.

**Acceptance Criteria:**

```gherkin
Feature: Paginated product listing

  Scenario: Listing renders a grid of product cards
    Given a signed-in user opens the listing route
    When the first page of products loads from DummyJSON
    Then up to 12 product cards are shown in a responsive grid
    And each card shows thumbnail, title, price, and rating
    And each card is a semantic article element
    And list requests fetch only the selected fields (title, price, thumbnail, rating, category)

  Scenario: Responsive grid across breakpoints
    Given the listing is displayed
    When the viewport is mobile, tablet, then desktop width
    Then the grid shows 1 column on mobile, 2 on tablet, and 3 to 4 on desktop
    And no horizontal overflow occurs at 320px, 768px, or 1280px

  Scenario: Numbered windowed pagination
    Given the catalog has 194 products at 12 per page
    When the pager renders
    Then it shows 17 total pages using a windowed layout with first, last, and an ellipsis
    And the current page is visually marked
    And Prev and Next controls are present

  Scenario: Prev and Next disable at the bounds
    Given the user is on the first page
    Then Prev is disabled
    When the user is on the last page
    Then Next is disabled
    And neither control can navigate outside the valid page range

  Scenario: Page lives in the URL
    Given the user clicks page 2
    When the listing updates
    Then the URL contains page=2
    And the request uses skip = (2-1) * 12
    And refreshing or deep-linking page=2 restores the same page

  Scenario: Smooth page transitions
    Given the user is viewing a page of results
    When they navigate to another page
    Then the previous grid stays visible until the next page arrives
    And there is no layout collapse or scroll jump
    And a subtle loading indicator shows while the next page is fetching

  Scenario: First-load spinner
    Given the listing is opening with no cached data
    When the first request is in flight
    Then a centered spinner is shown in the main content area

  Scenario: Error shows a toast and a retry
    Given a product request fails
    When the error is received
    Then a react-toastify error toast is shown
    And the main area shows a minimal inline fallback message
    And a retry action re-runs the request

  Scenario: Out-of-range page shows an empty state
    Given the URL is hand-edited to a page beyond the last valid page
    When the request returns no products
    Then a contextual empty message is shown
    And the app does not crash or redirect

  Scenario: Cards deep-link to detail
    Given products are displayed
    When the user clicks a product card
    Then they navigate to that product's detail route
    And the current listing page is preserved in the URL for the return trip
```

**Tests to be done:**

_Positive_
- First page renders up to 12 cards, each with thumbnail, title, price, and rating.
- Grid shows 1 / 2 / 3–4 columns at 320px / 768px / 1280px with no overflow.
- Windowed pager shows all 17 pages with first, last, ellipsis, and the current page marked.
- Clicking page 2 updates the URL to `page=2`, requests `skip=12`, and shows the correct products.
- `keepPreviousData` keeps the prior grid visible during a page fetch (no collapse/scroll jump).
- Deep-linking `/?page=2` restores page 2 on refresh.
- Clicking a card navigates to detail with the listing page preserved in the URL.

_Negative_
- On the first page, Prev is disabled and cannot navigate; on the last page, Next is disabled.
- Hand-edited `?page=999` (beyond range) returns no products and shows the empty state without crashing or redirecting.
- Non-numeric/zero/negative `page` values (`?page=abc`, `?page=0`) fall back to page 1 gracefully.
- A failed products request shows a react-toastify toast plus an inline fallback, and the retry action re-runs the request.
- The centered spinner shows only on first load; revisiting a cached page does not re-trigger it.
