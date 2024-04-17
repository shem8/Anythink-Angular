Feature: New item

    As a user,
    I want to be able to publish an item,
    so that I can share it with the other users.

    Background:
        Given I am logged in to the system  so I can test the new item functionality
        And I am on New Post page
        When I input the title of the item
        And I input the summary of the item
        And I input the body of the item
        And I input tags of the item
        And I click Publish button

    Scenario: Publishing item
        Then a new item is published

    Scenario: New item in My Items section
        Then the new item is displayed in My Items section

    Scenario: New item in Global Feed
        Then the new item is displayed in Global Feed
