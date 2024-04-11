Feature: As a user, when the listing API encounters and error, I am presented with an error page

Scenario: Display error page when a user views a dynamic listing page that encounters a CTS API error
  Given "trialListingPageType" is set to "Manual"
  And the CTS API is responding with a server error
  Given the user navigates to "/v?id=NCI-2018-03695"
  Then the title tag should be "Errors Occurred"
  And the page contains meta tags with the following names
   | name                  | content |
   | prerender-status-code | 500     |
