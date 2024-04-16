import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { generateRandomString } from "../../support/generate-random-string";

let userId = "";
let itemTitle = "";

beforeEach(() => {
  userId = generateRandomString();
  itemTitle = generateRandomString();
});

Given(
  "I am logged in to the system  so I can test the new item functionality",
  () => {
    cy.loginApi(userId);
  },
);

When("I am on New Post page", () => {
  cy.visit("/editor");
});

When("I input the title of the item", () => {
  cy.get("[placeholder='Item Title']").clear().type(itemTitle);
});

When("I input the summary of the item", () => {
  cy.get('[placeholder="What\'s this item about?"]')
    .clear()
    .type("How to do automation testing");
});

When("I input the body of the item", () => {
  cy.get("[placeholder='Write your item (in markdown)']")
    .clear()
    .type("Automation testing description");
});

When("I input tags of the item", () => {
  cy.get("[placeholder='Enter Tags']").clear().type("testing").blur();
});

When("I click Publish button", () => {
  cy.contains("Publish Item").click();
});

Then("a new item is published", () => {
  cy.getByE2eId("item-title").should("have.text", itemTitle);
});

Then("the new item is displayed in My Items section", () => {
  cy.getByE2eId("item-title").should("have.text", itemTitle); // wait for the item to be created, before continue with the rest of the steps

  cy.getByE2eId("loggedin-user").click();
  cy.getByE2eId("item-list-title").should("have.text", itemTitle);
});

Then("the new item is displayed in Global Feed", () => {
  cy.getByE2eId("item-title").should("have.text", itemTitle); // wait for the item to be created, before continue with the rest of the steps

  cy.contains("Home").click();
  cy.contains("Global Feed").click();
  cy.getByE2eId("item-list-title").first().should("have.text", itemTitle);
});
