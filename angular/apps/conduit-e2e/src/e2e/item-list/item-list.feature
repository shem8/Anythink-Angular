Feature: Items List

  As a user,
  I want to be able view the list of the available items,
  so that I can click on them and navigate to a specific item.

  Background:
    Given I am logged in to the system so I can test the items list page
    And I am on Home page
    And I select the Global feed

  Scenario: Navigate to a specific item
    When I click on the first item
    Then I navigate to the clicked item

  Scenario: View item's information
    Then I can see the title of an item

  Scenario: View item's author
    When I click on the first item's author name
    Then I navigate to the author's profile page

  Scenario: Navigate to a new page
    When I click on the second page
    Then I navigate to the second page of the list
