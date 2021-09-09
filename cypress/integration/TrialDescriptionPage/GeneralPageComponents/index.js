/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

And('{string} button as link is displayed', (btnText) => {
	cy.get('div[class*="btnAsLink"]')
		.should('have.text', btnText)
		.and('be.visible');
});

And('{string} button as link is not displayed', (btnText) => {
	cy.get('div[class*="btnAsLink"]').contains(btnText).should('not.exist');
});

And('{string} appears below the title', (infoText) => {
	cy.get('.trial-description-page__header')
		.find('strong')
		.first()
		.should('have.text', infoText);
});

And('the criteria table displays the following', (dataTable) => {
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').should('have.text', Category);
		cy.get('tbody tr td').should('have.text', Selection);
	}
});

And('search criteria table is not displayed', () => {
	cy.get('div.cts-accordion.table-dropdown').should('not.exist');
});

And('{string} link has a href {string}', (linkText, linkHref) => {
	cy.get(`a[href="${linkHref}"]`).should('have.text', linkText);
});

And('button {string} is not displayed', (btn) => {
	cy.get('button').contains(btn).should('not.be.visible');
});

And('button {string} is hidden', (btn) => {
	cy.get('button').contains(btn).should('not.exist');
});

When('user clicks on {string} button as link', (btn) => {
	cy.get('div[class*="btnAsLink"]').contains(btn).click({ force: true });
});

When('user clicks on {string} link', (linkText) => {
	cy.get('a').contains(linkText).parent().click();
});

And('the url is {string}', (path) => {
	cy.location('pathname').should('eq', path);
});

When('user clicks on Print button', () => {
	cy.printStub;
	cy.window().then((win) => {
		cy.printStub = cy.stub(win, 'print');
	});

	cy.get('.share-btn.cts-share-print').click();
});

Then('print window opens', () => {
	cy.window().then((win) => {
		win.location.href;
		expect(cy.printStub).to.be.calledOnce;
	});
});

And('trial status is {string}', (status) => {
	cy.get('div.trial-status-indicator').should(
		'have.text',
		`Trial Status: ${status}`
	);
});

And('back to search results link does not exist', () => {
	cy.get('div.back-to-search').should('not.exist');
});
And('{string} does not appear below the title', () => {
	cy.get('.trial-description-page__header').should('not.exist');
});

And('{string} link does not exist', (linkText) => {
	cy.get('a').contains(linkText).should('not.exist');
});
