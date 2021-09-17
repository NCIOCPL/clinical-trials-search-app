/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

const inputFieldMap = {
	Age: 'age',
	'U.S. Zip Code': 'zip',
	'Cancer Type/Keyword': 'ctk',
	'Primary Cancer Type/Condition': 'ct-searchTerm',
	'Cancer Type/Condition': 'ct',
};

And('autocomplete dropdown is displayed', () => {
	cy.get('.cts-autocomplete .menu-anchor :visible').should('exist');
});

And('user selects {string} from dropdown', (keyword) => {
	cy.get('.cts-autocomplete__menu-item').contains(keyword).click();
});

When('user clicks on {string} field', (fieldLabel) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).click();
});

Then('{string} input field has a value {string}', (fieldLabel, value) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).should('have.value', value);
});

When('user types {string} in {string} field', (inputText, fieldLabel) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).type(inputText, { force: true });
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).clear();
});

And(
	'user presses {string} key {int} times in {string} field',
	(key, count, fieldLabel) => {
		for (let i = 0; i < count; i++) {
			cy.get(`input#${inputFieldMap[fieldLabel]}`).type(
				`{${key.replace(' ', '')}}`
			);
		}
	}
);

And('user presses {string} key from {string} field', (key, fieldLabel) => {
	if (key.includes('tab')) {
		cy.focused().tab();
	} else {
		cy.get(`input#${inputFieldMap[fieldLabel]}`).type(`{${key}}`);
	}
});

And('trial info displays {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

And('the criteria table displays the following', (dataTable) => {
	let index = 0;
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').eq(index).should('have.text', Category);
		cy.get('tbody tr td').eq(index).should('include.text', Selection);
		index++;
	}
});

And('{string} no trial info is displayed', (noTrialsText) => {
	cy.get('.no-trials-found').should('have.text', noTrialsText);
});

When('user selects {string} by touching the menu', (value) => {
	cy.get(`.cts-autocomplete__menu-item`)
		.contains(value)
		.trigger('touchstart', { force: true })
		.trigger('click');
});
