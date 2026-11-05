# wdio-mocha-chai-framework

## Task

Automate the scenarios written in Module 2 for this practical task:

1. **Build a framework** using WDIO and Mocha setup.
2. **Set up and use the Chai library** within your framework.
3. **Practice with assertion interfaces:** Use `assert`, `should`, and `expect` across tests.
4. **Understand the differences** between the mentioned interfaces.
5. **Push the code** to a remote repository and create a Merge Request.

---

## Assessment Criteria

> **Pass rate:** 70%

Actions that result in a reduction of the overall mark:

* **-70%:** WDIO, Mocha, or Chai was not set up within the Test Automation Framework.
* **-10% per missing interface:** One of the required interfaces (`assert`, `should`, `expect`) is not used in tests.

---

## Scenarios

```gherkin
Feature: Practice Software Testing Core Functionalities
  As a user of the Practice Software Testing application
  I want to be able to navigate, search, and manage products
  So that I can successfully place orders and manage my account

  Scenario: Search for an exact product by name
    Given the user is on the main product catalog page
    When the user searches for the exact product name "Pliers"
    Then the search results should display only the product "Pliers"
    And the product details should match the search query

  Scenario: Sort products by price in descending order
    Given the user views the main product catalog
    When the user applies the sort option "Price: High to Low"
    Then the products should be displayed in descending order of their price
    And the most expensive product should appear as the first item

  Scenario: Successful user sign in with valid credentials
    Given a registered user is on the authentication page
    When the user logs in with their valid account credentials
    Then the system should authenticate the user successfully
    And the user should be redirected to their profile dashboard

  Scenario: View detailed information on the product details page
    Given the user is exploring the product catalog
    When the user selects a specific product to view more details
    Then the application should display the detailed product page
    And the page must contain the product description, price, and stock status

  Scenario: Add a product to the shopping basket
    Given the user is on the product details page for an available product
    When the user adds the selected product to their shopping basket
    Then the shopping basket item count should increase by one
    And the basket should list the newly added product with the correct price

  Scenario: Add a product to the user's favorites list
    Given an authenticated user is on the main product page
    When the user marks a specific tool as a favorite product
    Then the selected tool should be added to the user's favorites list
    And the favorites counter should be updated to reflect the new addition

  Scenario: Complete the checkout process successfully
    Given the user has items ready in their shopping basket
    When the user completes the checkout flow with valid payment and shipping details
    Then the system should successfully process and place the order
    And the user should receive a finalized order confirmation number

  Scenario: Change the application interface language
    Given the user is on the application home page
    When the user selects Spanish from the language selector
    Then the application interface language should switch to Spanish
    And the main navigation menu items should be translated accordingly
