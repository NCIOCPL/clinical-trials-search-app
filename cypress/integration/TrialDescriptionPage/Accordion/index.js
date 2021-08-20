/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

And('trial description accordion is displayed', () => {
	cy.get('.trial-description-page__content  .cts-accordion').should(
		'be.visible'
	);
});

And('the following accordion sections are displayed', (dataTable) => {
	for (const { section, ariaExpanded } of dataTable.hashes()) {
		cy.get('div[class="cts-accordion  "] button.cts-accordion__button')
			.contains(section)
			.parent()
			.should('have.attr', 'aria-expanded', ariaExpanded);
	}
});

When('user clicks on {string} section of accordion', (section) => {
	cy.get('div[class="cts-accordion  "] button.cts-accordion__button')
		.contains(section)
		.click();
});

Then('alphabetically sorted list appears', () => {
	let isSorted = true;
	cy.document().then((document) => {
		//get all the options from select
		const options = document.querySelectorAll('select.cts-select option');
		for (let i = 1; i < options.length - 1; i++) {
			//localeCompare() returns a negative number when a reference string (option[i])
			//comes before compareString (option[i+1])
			if (
				options[i].textContent.localeCompare(options[i + 1].textContent) > 0
			) {
				isSorted = false;
				console.log(
					`${options[i].textContent} is out of order with ${
						options[i + 1].textContent
					}`
				);
			}
		}
		expect(isSorted).to.be.true;
	});
});

And('{string} option is selected', (selectedOption) => {
	cy.get('select.cts-select option:selected').should(
		'have.text',
		selectedOption
	);
});

And('trial ids are displayed in the following format', (dataTable) => {
	for (const { id } of dataTable.hashes()) {
		cy.get('ul.trial-ids li').contains(id).should('be.visible');
	}
});

And('{string} button as link is displayed', (buttonAsLink) => {
	cy.get('div.btnAsLink').contains(buttonAsLink).should('be.visible');
});

And('text {string} is displayed', (text) => {
	cy.get('p').contains(text).should('be.visible');
});
