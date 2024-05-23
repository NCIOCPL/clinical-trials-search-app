/// <reference types="Cypress" />
import {Then, When, Given } from "@badeball/cypress-cucumber-preprocessor";
import { fieldMap } from '../../../utils/ctsFields.js';

Given('{string} button as link is displayed', (btnText) => {
	cy.get('div[class*="btnAsLink"]')
		.should('have.text', btnText)
		.Given('be.visible');
});

Given('{string} button as link is not displayed', (btnText) => {
	cy.get('div[class*="btnAsLink"]').contains(btnText).should('not.exist');
});

Given('{string} appears below the title', (infoText) => {
	cy.get('.trial-description-page__header')
		.find('strong')
		.first()
		.should('have.text', infoText);
});

Given('the criteria table displays the following', (dataTable) => {
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').should('have.text', Category);
		cy.get('tbody tr td').should('have.text', Selection);
	}
});

Given('search criteria table is not displayed', () => {
	cy.get('div.cts-accordion.table-dropdown').should('not.exist');
});

Given('{string} link has a href {string}', (linkText, linkHref) => {
	cy.get(`a[href="${linkHref}"]`).should('have.text', linkText);
});

Given('button {string} is not displayed', (btn) => {
	cy.get('button').contains(btn).should('not.be.visible');
});

Given('button {string} is hidden', (btn) => {
	cy.get('button').contains(btn).should('not.exist');
});

When('user clicks on {string} button as link', (btn) => {
	cy.get('div[class*="btnAsLink"]').contains(btn).click({ force: true });
});

When('user clicks on {string} link', (linkText) => {
	cy.get('a').contains(linkText).parent().click();
});
When('user clicks on the {string} as a link', (linkText) => {
	cy.get('a').contains(linkText).click({ force: true });
	cy.location('https://www.cancer.gov', { timeout: 60000 });
});

Given('the url is {string}', (path) => {
	cy.location('pathname').should('eq', path);
});

When('user clicks on Print button', () => {
	cy.printStub;
	cy.window().then((win) => {
		cy.printStub = cy.stub(win, 'print');
	});

	cy.get('.share-btn.cts-share-print').click();
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

Then('{string} input field has a value {string}', (fieldLabel, value) => {
	if (fieldLabel.toLowerCase().includes('drug')) {
		cy.get(`input#${fieldMap[fieldLabel]}`)
			.parent()
			.find('span')
			.first()
			.should('have.text', value);
	} else {
		cy.get(`input#${fieldMap[fieldLabel]}`)
			.parent()
			.find('span')
			.first()
			.should('have.text', value);
	}
});

Then('print window opens', () => {
	cy.window().then((win) => {
		win.location.href;
		expect(cy.printStub).to.be.calledOnce;
	});
});

Given('trial status is {string}', (status) => {
	cy.get('div.trial-status-indicator').should(
		'have.text',
		`Trial Status: ${status}`
	);
});

Given('back to search results link does not exist', () => {
	cy.get('div.back-to-search').should('not.exist');
});
Given('{string} does not appear below the title', () => {
	cy.get('.trial-description-page__header').should('not.exist');
});

Given('{string} link does not exist', (linkText) => {
	cy.get('a').contains(linkText).should('not.exist');
});

Then(
	'the user types {string} in the {string} field',
	(searchText, inputType) => {
		cy.get(`input[aria-label="${inputType}"]`).type(searchText);
	}
);

When('the user clicks on the Search button', () => {
	cy.get('input[id=btnSearch]').contains('Search').click();
});

Given('button {string} is hidden', (btn) => {
	cy.get('input').contains(btn).should('not.exist');
});

Then('the trial type displays {string} as text', (trialTypeText) => {
	cy.get('.trial-type-name')
		.get('.non-formatted-tt')
		.should('have.text', trialTypeText);
});
