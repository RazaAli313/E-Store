### PD-3 — Search products

| Field | Value |
| :---- | :---- |
| Ticket ID | PD-3 |
| Ticket Name | Search products |
| Status | To Be Done |
| Priority | P1 — High |
| Dependencies | PD-2 (listing grid, pagination, states) |
| Estimate | FE: 3h |
| Source References | Product Discovery spec; DummyJSON `/products/search`; planning-session search decisions |

**Description:** As a signed-in user, I want a search box in the header that filters products as I type, so that I can quickly find products by name without leaving the listing — with the search term reflected in the URL and results paginated the same way as the full catalog.

**Acceptance Criteria:**

```gherkin
Feature: Product search

  Scenario: Search box lives in the persistent header
    Given the user is anywhere in the product browsing area
    When the layout renders
    Then a labelled search input is shown in the header
    And its value is initialised from the q URL parameter

  Scenario: Typing filters results live on each keystroke
    Given the user types a query into the search box
    When each character is entered
    Then a search request is made for the current term on every keystroke (no debounce)
    And the grid updates to the matching products for the latest term
    And each term's results are cached so backspacing shows them instantly
    And out-of-order responses are ignored — the current term's results win

  Scenario: Search term lives in the URL and resets the page
    Given the user enters a search term
    When the URL updates
    Then it contains q with the entered term
    And page is reset to 1
    And deep-linking a q value restores the search on refresh

  Scenario: Pagination works within search results
    Given a search returns more than 12 matches
    When the user pages through the results
    Then pagination uses the search total to compute pages
    And skip is applied against the search endpoint
    And Prev/Next disable at the bounds as in the full listing

  Scenario: Clearing the search returns to the full catalog
    Given a search term is active
    When the user clears the search box
    Then q is removed from the URL
    And the full product listing is shown again from page 1

  Scenario: No matches shows a contextual empty state
    Given the user searches for a term with no matches
    When the response returns zero products
    Then a contextual empty message referencing the search term is shown
    And a way to clear the search is offered

  Scenario: Search reuses the shared loading and error treatment
    Given a search request is in flight or fails
    When the state updates
    Then a spinner (first load) or the previous results (transition) are shown
    And failures raise a react-toastify toast with a retry
```

**Tests to be done:**

_Positive_
- Each keystroke issues a search request for the current term and the grid updates to the matches.
- The search term is written to `?q=` and `page` resets to 1.
- Previously typed terms are served from React Query cache — backspacing shows results instantly with no refetch.
- Pagination within search results uses the search total and applies `skip` to the search endpoint.
- Deep-linking `?q=phone` restores the active search on refresh.

_Negative_
- Fast typing that produces out-of-order responses still shows the **latest** term's results (stale responses are ignored).
- A search with no matches shows a contextual empty message and a clear-search affordance.
- A whitespace-only or empty query is treated as "no search" (full listing), not an empty search request.
- A failed search request raises a react-toastify toast with a working retry.
- Special characters in the query are URL-encoded and do not break the request or the URL.
