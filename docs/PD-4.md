### PD-4 — Filter products by category

| Field | Value |
| :---- | :---- |
| Ticket ID | PD-4 |
| Ticket Name | Filter products by category |
| Status | To Be Done |
| Priority | P1 — High |
| Dependencies | PD-2 (listing), PD-3 (search — for the precedence rule) |
| Estimate | FE: 2h |
| Source References | Product Discovery spec; DummyJSON `/products/category-list` and `/products/category/{slug}`; planning-session precedence decision |

**Description:** As a signed-in user, I want to filter the catalog by category from a dropdown, so that I can narrow products to a single category — understanding that an active search takes precedence over the category, since only one filter endpoint is used at a time.

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
    Then the listing fetches from that category's endpoint
    And the grid shows only products in that category
    And the category is written to the URL and page is reset to 1

  Scenario: Selecting "All categories" clears the filter
    Given a category filter is active
    When the user selects "All categories"
    Then category is removed from the URL
    And the full catalog is shown from page 1

  Scenario: Search takes precedence over category
    Given both a search term and a category are present in the URL
    When the listing resolves which endpoint to use
    Then the search endpoint is used and the category is ignored
    And this reflects that only one filter endpoint is active at a time

  Scenario: Category results are paginated
    Given a category has more than 12 products
    When the user pages through them
    Then pagination uses the category total to compute pages
    And skip is applied against the category endpoint
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
- Selecting a category fetches its endpoint, filters the grid, writes `?category=`, and resets `page` to 1.
- Selecting "All categories" removes `category` and restores the full catalog from page 1.
- Pagination within a category uses the category total and applies `skip` to the category endpoint.

_Negative_
- With both `q` and `category` present, the search endpoint wins and the category is ignored.
- Changing category while on page 3 resets to page 1 (no out-of-range page).
- A category that returns no products shows a contextual empty message and a clear-filter affordance.
- A hand-edited invalid category slug returns no products and shows the empty state without crashing.
- A failed category request raises a react-toastify toast with a working retry.
