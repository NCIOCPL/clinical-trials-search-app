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


When('user clicks on {string} field', (fieldLabel) => {
  cy.get(`div input[aria-label="${fieldLabel}"]`).click();
});

When('user types {string} in {string} field', (inputText, fieldLabel) => {
  cy.get(`div input[aria-label="${fieldLabel}"]`).type(inputText);
});

When('user scrolls down to {string}', (landmark) => {
  cy.get('legend').contains(landmark).scrollIntoView();
})

When('user clicks on {int} trial result', (resultItem) => {
  cy.get('.results-list__item a').eq(resultItem - 1).click();
});

And('user clicks on {string} button', (buttonLabel) => {
  cy.get('button').contains(buttonLabel).click();
});

And('user clicks on {string} link', (linkText) => {
  cy.get('a').contains(linkText).click({ followRedirect: false });
});

And('user navigates back to the previous page', () => {
  cy.window().then(win => {
    cy.NCIDataLayer = Object.assign(win.NCIDataLayer)
  })
  cy.go('back'), { followRedirect: false };
})
And('user clears form', () => {
  cy.window().then(win => {
    cy.NCIDataLayer = Object.assign(win.NCIDataLayer)
  })
  cy.get('button').contains('Clear Form').click();
})

When('user scrolls to middle of screen', () => {
  cy.scrollTo("center");
});

When('user checks {string} checkbox', (label) => {
  cy.get('label').contains(label).parent().find('input').check({ force: true });
});

When('user checks {string} checkbox on {int} pages', (label, page) => {
  for (let i = 1; i <= page; i++) {
    cy.get('div.pager__num').contains(`${i}`).click()
    cy.get('label').contains(label).parent().find('input').check({ force: true });
  }
})

When('user clicks on share by {string} button', (option) => {

  if (option === 'Print') {
    cy.window().then(win => {
      //same approach we used on platform testig and it works, in the app it does not!(
      //stubbing the print window to prevent the call to open it, 
      //but still triggering the click event
      const printStub = cy.stub(win, 'print')
      cy.get("button").contains(option).click({ force: true });

    })
  } else {
    cy.get('button[class="share-btn cts-share-email"]')
    .then(button$ => {
      button$.on('click', e => {
        //this is useless since cypress still waits for a new page to load 
        // and it never loads - timeout and fail!
        e.preventDefault;
      });
    })
    .click({ force: true });
  }
});
