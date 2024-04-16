import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { generateRandomString } from "../../support/generate-random-string";

let userId = "";

beforeEach(() => {
  userId = generateRandomString();
});

Given(
  "I am logged in to the system so I can test the items list page",
  () => {
    cy.loginApi(userId);
  },
);

When("I am on Home page", () => {
  cy.visit("/");
});

When("I select the Global feed", () => {
  cy.getByE2eId("global-feed").click();
});

When("I click on the first item", () => {
  const Item = cy.getByE2eId("item-list-title").first();
  firstItem.then((title) => {
    cy.wrap(title.text()).as("itemTitle");
    title.click();
  });
});

Then("I navigate to the clicked item", () => {
  cy.get("@itemTitle").then((itemTitle) => {
    cy.url().should("include", `/item/`);
    cy.getByE2eId("item-title").should("have.text", itemTitle);
  });
});

Then("I can see the title of an item", () => {
  cy.getByE2eId("item-list-title").first().should("not.be.empty");
});

When("I click on the first item's author name", () => {
  cy.getByE2eId("item-author")
    .first()
    .then((authorName) => {
      cy.wrap(authorName.text()).as("author");
    });
  cy.getByE2eId("item-author").first().click();
});

Then("I navigate to the author's profile page", () => {
  cy.get("@author").then((authorName) => {
    cy.url().should("include", `/profile/`);
    cy.getByE2eId("item-author-profile").should("have.text", authorName);
  });
});

When("I click on the second page", () => {
  cy.getByE2eId("pagination-link").eq(1).click();
});

Then("I navigate to the second page of the list", () => {
  cy.getByE2eId("pagination-item").eq(1).should("have.class", "active");
});
