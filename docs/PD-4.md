### PD-4 — Filter products by category

| Field | Value |
| :---- | :---- |
| Ticket ID | PD-4 |
| Ticket Name | Filter products by category |
| Status | To Be Done |
| Priority | P1 — High |
| Dependencies | PD-2 (listing), PD-3 (search — combines with the category filter) |
| Estimate | FE: 2h |
| Source References | Product Discovery spec; DummyJSON `/products/category-list` and `/products/category/{slug}`; planning-session combined-filter (AND) decision |

**Description:** As a signed-in user, I want to filter the catalog by category from a dropdown and keep searching within it, so that I can narrow products to a single category and, when I also type a search term, see only the products in that category that match my term (a logical AND). Because DummyJSON has no endpoint that combines search and category, when a category is active the whole category is fetched once and the search term, matching, and pagination are applied in-memory.

**Acceptance Criteria:**

```gherkin
Feature: Category filtering

  Scenario: Category dropdown is populated from the category list
    Given the listing is displayed
    When the category filter renders
    Then it is a labelled select with an "All categories" option first
    And its options come from the DummyJSON category list
    And its value is initialised from the category URL parameter

  Scenario: Selecting a category filters the grid
    Given no search term is active
    When the user selects a category
    Then the listing fetches the whole category (limit=0) from that category's endpoint
    And the grid shows only products in that category
    And the category is written to the URL and page is reset to 1

  Scenario: Selecting "All categories" clears the filter
    Given a category filter is active
    When the user selects "All categories"
    Then category is removed from the URL
    And the full catalog is shown from page 1

  Scenario: Search and category combine as a logical AND
    Given both a search term and a category are present in the URL
    When the listing resolves the results
    Then the whole selected category is fetched once (limit=0)
    And it is filtered in-memory to products whose title, brand, or description match the search term
    And only products that satisfy both the category and the term are shown
    And no request is made to the search endpoint while a category is active

  Scenario: Category with an active search that matches nothing
    Given a category and a search term are both active
    When no product in that category matches the term
    Then a contextual empty message is shown
    And a way to clear the search or the category is offered

  Scenario: Category results are paginated in-memory
    Given a category (with or without a search term) has more than 12 matching products
    When the user pages through them
    Then pagination is computed from the filtered in-memory list
    And the visible page is sliced client-side (no per-page request)
    And Prev/Next disable at the bounds

  Scenario: Empty category shows a contextual empty state
    Given a selected category returns no products
    When the response is received
    Then a contextual empty message is shown
    And a way to clear the filter is offered

  Scenario: Changing the filter resets pagination
    Given the user is on page 3 of one category
    When they select a different category
    Then page is reset to 1
    And the new category's first page is shown
```

**Tests to be done:**

_Positive_
- The dropdown is populated from the category list with "All categories" first.
- Selecting a category fetches the whole category (`limit=0`), filters the grid, writes `?category=`, and resets `page` to 1.
- Selecting "All categories" removes `category` and restores the full catalog from page 1.
- With both `q` and `category` present, the category is fetched once and filtered in-memory to products matching the term (AND) — the search endpoint is not called.
- Pagination within a category (with or without a search term) is computed from the filtered list and sliced client-side.

_Negative_
- A category + search combination that matches nothing shows a contextual empty message with affordances to clear the search or the category.
- Changing category while on page 3 resets to page 1 (no out-of-range page).
- A category that returns no products shows a contextual empty message and a clear-filter affordance.
- A hand-edited invalid category slug returns no products and shows the empty state without crashing.
- A failed category request raises a react-toastify toast with a working retry.
