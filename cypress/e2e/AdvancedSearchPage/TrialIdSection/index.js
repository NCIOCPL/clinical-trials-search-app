/// <reference types="Cypress" />
import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../../utils/ctsFields.js';

Given(
	'help icon is displayed in {string} section with href {string}',
	(fieldLabel, helpHref) => {
		cy.get('#fieldset--trialid')
			.find('a.text-icon-help')
			.should('be.visible', fieldLabel)
			.Given('have.attr', 'href', helpHref);
	}
);

Given('trial info displays {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

Given('the criteria table displays the following', (dataTable) => {
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').should('have.text', Category);
		cy.get('tbody tr td').should('have.text', Selection);
	}
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

Then('{string} field has value {string}', (field, value) => {
	cy.get('input#trialId').should('be.visible', field).Given('have.value', value);
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).clear();
});
