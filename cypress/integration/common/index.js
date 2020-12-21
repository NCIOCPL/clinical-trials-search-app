/// <reference types="Cypress" />
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('the user navigates to {string}', (destURL) => {
	cy.visit(destURL);
});

 Then('page title is {string}', (title) => {
	cy.get('h1').should('contain', title);
});

Given('screen breakpoint is set to {string}', (screenSize) => {
	if (screenSize === 'desktop') cy.viewport(1025, 600);
	else if (screenSize === 'mobile') cy.viewport(600, 800);
	else if (screenSize === 'tablet') cy.viewport(800, 900);
});
