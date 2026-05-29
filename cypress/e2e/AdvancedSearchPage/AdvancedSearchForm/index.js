/// <reference types="Cypress" />
import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../../utils/ctsFields.js';

And('the text {string} appears below the title', (introtext) => {
	cy.get('.search-page__header > p').should('contain', introtext);
});

And('Search tip icon is displayed and text {string} appears', (tiptext) => {
	cy.get('.cts-search-tip__icon').should('be.visible');
	cy.get('.cts-search-tip__body').should('contain', tiptext);
});

And('sticky block is displayed with {string} and {string} buttons', (findbtn, clearbtn) => {
	cy.get('.sticky-block').should('be.visible');
	cy.get('.faux-btn-submit').contains(findbtn).should('be.visible');
	cy.get('.clear-form').contains(clearbtn).should('be.visible');
});

When('user scrolls to the {string} section', (section) => {
	cy.get(`input[aria-label="${section}"]`).scrollIntoView();
});

Then('sticky block becomes fixed block', () => {
	cy.get('.sticky-block__anchor --sticky').should('not.exist');
});

Then('{string} input field has no value', (section) => {
	cy.get(`input[id="${fieldMap[section]}"]`).should('be.empty');
});

When('user clicks on {string} with href {string}', (linktext, link) => {
	cy.get('.cts-search-tip__body a').should('have.text', linktext);
	cy.get('.cts-search-tip__body a').should('have.attr', 'href', link);
	cy.get('.cts-search-tip__body a').click();
});

Then('user is redirected to {string}', (link) => {
	cy.location('pathname').should('be.eq', link);
});

// ----- Prior Therapy field -----

And('help icon is displayed in {string} section with href {string}', (fieldLabel, helpHref) => {
	cy.get('#fieldset--prior-therapy').find('a.text-icon-help').should('be.visible', fieldLabel).and('have.attr', 'href', helpHref);
});

And('info text {string} is displayed in the prior therapy section body', (infoText) => {
	cy.get('#fieldset--prior-therapy').find('p').should('have.text', infoText);
});

Then('prior therapy autocomplete dropdown is displayed with {string} text', (autosuggestItem) => {
	cy.get('#fieldset--prior-therapy .cts-autocomplete__menu-item:visible').should('have.text', autosuggestItem);
});

Then('the prior therapy dropdown contains {string}', (autosuggestItem) => {
	cy.contains('#fieldset--prior-therapy .cts-autocomplete__menu-item', autosuggestItem, {
		timeout: 7000,
	}).should('be.visible');
});

And('user selects {string} from the prior therapy dropdown', (autosuggestTerm) => {
	cy.contains('#fieldset--prior-therapy .cts-autocomplete__menu-item', autosuggestTerm, {
		timeout: 7000,
	}).click({ force: true, timeout: 7000 });
});

And('the criteria table displays the following', (dataTable) => {
	cy.get('tbody > tr').should('have.length', dataTable.hashes().length);
	//index assures correct order
	let index = 0;
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').eq(index).should('have.text', Category);
		cy.get('tbody tr td').eq(index).should('have.text', Selection);
		index++;
	}
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

Then('{string} input field has a value {string}', (fieldLabel, value) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).parent().find('span').first().should('have.text', value);
});

When('user removes {string} from the {string} field', (selectedType, fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).parent('.cts-chip-list').as('fieldInFocus');
	cy.get('@fieldInFocus').find(`button[value="${selectedType}"]`).click();
});

And('the url query has the following corresponding code with duplicated keys', (dataTable) => {
	cy.location('href').then((url) => {
		const params = new URL(url).searchParams;
		//verify num of url params matches expected
		expect(Array.from(params.entries()).length).to.eq(dataTable.raw().length);
		//verify that url query params have expected values
		expect(Array.from(params.entries())).to.deep.equal(dataTable.raw());
	});
});
