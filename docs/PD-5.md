### PD-5 — View product detail

| Field | Value |
| :---- | :---- |
| Ticket ID | PD-5 |
| Ticket Name | View product detail |
| Status | To Be Done |
| Priority | P1 — High |
| Dependencies | PD-2 (listing cards link to detail) |
| Estimate | FE: 4h |
| Source References | Product Discovery spec; DummyJSON `/products/{id}`; planning-session detail-scope decision |

**Description:** As a signed-in user, I want to open a product's detail page from the listing, so that I can see its images, price, rating, availability, description, and reviews on a dedicated, deep-linkable page — and return to the listing with my previous filters intact.

**Acceptance Criteria:**

```gherkin
Feature: Product detail page

  Scenario: Detail route loads the full product
    Given the user opens a product detail route with a product id
    When the page loads
    Then it fetches the full product (not the trimmed list shape)
    And it is behind the auth guard and lazy-loaded like other pages

  Scenario: Core product information is shown
    Given a product detail has loaded
    When the page renders
    Then it shows an image gallery from the product images
    And it shows the title, brand, and category
    And it shows the price and any discount
    And it shows the rating and stock or availability status
    And it shows the full description
    And the layout uses semantic sections

  Scenario: Reviews are shown from the same response
    Given the product response includes reviews
    When the detail page renders
    Then the reviews are listed
    And no additional request is made to fetch them

  Scenario: Back link preserves listing filters
    Given the user arrived from a filtered or paged listing
    When they use the "Back to products" link
    Then they return to the listing
    And the previous search, category, and page are restored from the URL

  Scenario: First-load spinner on detail
    Given the detail page is opening with no cached data
    When the request is in flight
    Then a centered spinner is shown

  Scenario: Detail load failure shows a toast
    Given the product request fails
    When the error is received
    Then a react-toastify error toast is shown
    And a minimal inline fallback with a retry is available

  Scenario: Unknown product id is handled gracefully
    Given the user opens a detail route for a non-existent product id
    When the response indicates the product is not found
    Then a contextual not-found message is shown
    And a link back to the listing is offered
    And the app does not crash

  Scenario: Detail is responsive and accessible
    Given the detail page is displayed
    When the viewport changes from mobile to desktop
    Then the gallery and information reflow without overflow
    And gallery images have alt text
```

**Tests to be done:**

_Positive_
- Opening a detail route fetches the full product and shows gallery, title/brand/category, price+discount, rating, stock, and description.
- Reviews render from the same response with no additional request.
- The "Back to products" link restores the prior search, category, and page from the URL.
- Deep-linking a detail URL renders the correct product directly.
- The gallery and info reflow across mobile→desktop with no overflow and images have alt text.

_Negative_
- An unknown product id shows a contextual not-found message with a link back to the listing, without crashing.
- A non-numeric id in the URL is handled gracefully (treated as not-found).
- A failed detail request shows a react-toastify toast plus an inline fallback with a working retry.
- The first-load spinner shows while fetching; revisiting a cached product does not re-trigger it.
