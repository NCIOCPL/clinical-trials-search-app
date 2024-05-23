/// <reference types="Cypress" />
import {Then, When, Given } from "@badeball/cypress-cucumber-preprocessor";
import { fieldMap } from '../../../utils/ctsFields.js';

Given(
	'help icon is displayed in {string} section with href {string}',
	(fieldLabel, helpHref) => {
		cy.get('#fieldset--drug-trtmt')
			.find('a.text-icon-help')
			.should('be.visible', fieldLabel)
			.Given('have.attr', 'href', helpHref);
	}
);

Given('info text {string} is displayed in the section body', (infoText) => {
	cy.get('#fieldset--drug-trtmt').find('p').should('have.text', infoText);
});

Then(
	'autocomplete dropdown is displayed with {string} text',
	(autosuggestItem) => {
		cy.get('div.cts-autocomplete__menu-item:visible').should(
			'have.text',
			autosuggestItem
		);
	}
);

Given('user selects {string} from dropdown', (autosuggestTerm) => {
	cy.contains(
		'#fieldset--drug-trtmt .cts-autocomplete__menu-item',
		autosuggestTerm,
		{
			timeout: 7000,
		}
	).click({ force: true, timeout: 7000 });
});

Given('trial info displays {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

Given('the criteria table displays the following', (dataTable) => {
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

When(
	'user removes {string} from the {string} field',
	(selectedType, fieldLabel) => {
		cy.get(`input#${fieldMap[fieldLabel]}`)
			.parent('.cts-chip-list')
			.as('fieldInFocus');
		cy.get('@fieldInFocus').find(`button[value="${selectedType}"]`).click();
	}
);

Given(
	'the url query has the following corresponding code with duplicated keys',
	(dataTable) => {
		cy.location('href').then((url) => {
			const params = new URL(url).searchParams;
			//verify num of url params matches expected
			expect(Array.from(params.entries()).length).to.eq(dataTable.raw().length);
			//verify that url query params have expected values
			expect(Array.from(params.entries())).to.deep.equal(dataTable.raw());
		});
	}
);

Then('autocomplete dropdown is displayed', () => {
	cy.get('#fieldset--drug-trtmt .cts-autocomplete__menu-item').should(
		'be.visible'
	);
});
