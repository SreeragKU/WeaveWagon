Feature: Place Order
  As a customer
  I want to place an order for products
  So that I can receive them at my address

  Scenario: Place an order
    Given I am on the homepage
    When I click on the cart button in the navbar
    Then I should be on the cart page
    When I click on the proceed to checkout button
    Then I should be on the shipping page
    When I input my fullname, address, city, postalcode, and country
    And I click on the next button
    Then I should be on the payment page
    When I click on the next button again
    Then I should be on the place order page
    When I click on the Place Order button
    Then I should be on the order confirmation page
