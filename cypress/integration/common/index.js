/// <reference types="Cypress" />
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';


cy.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

Given('the user navigates to {string}', (destURL) => {
	cy.visit(destURL);
});

Given('{string} is set to {string}', (key, param) => {
  cy.on('window:before:load', (win) => {
    win.INT_TEST_APP_PARAMS[key] = param;
  });
});

When('the user navigates to {string}', (def) => {
  cy.visit(def);
});

Then('the page title is {string}', (title) => {
  cy.get('h1').should('contain', title);
});

And('browser waits', () => {
  cy.wait(2000);
});

And('{string} is set to {string}', (key, param) => {
  cy.on('window:before:load', (win) => {
    win.INT_TEST_APP_PARAMS[key] = param;
  });
});

Given('screen breakpoint is set to {string}', (screenSize) => {
	if (screenSize === 'desktop') cy.viewport(1025, 600);
	else if (screenSize === 'mobile') cy.viewport(600, 800);
	else if (screenSize === 'tablet') cy.viewport(800, 900);
});

When('user clicks on "Primary Cancer Type/Condition" combobox', () => {
  cy.get('#ct-btn').click();
});

When('user clicks on {string} field', (fieldLabel) => {
    cy.contains(fieldLabel).click();
});

When('user types {string} in {string} field',(inputText, fieldId) => {
  cy.get(`#${fieldId}`).type(inputText);
});

When('user scrolls down to {string}', (landmark) => {
  cy.get('legend').contains(landmark).scrollIntoView();
})

When('user clicks on 1 trial result', () => {
cy.get('.results-list__item a').first().click();
});

And('user clicks on {string} button', (buttonLabel) => {
  cy.get('button').contains(buttonLabel).click();
});

And('user clicks on {string} link', (linkText) => {
  cy.get('a').contains(linkText).click();
});