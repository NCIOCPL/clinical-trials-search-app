Feature: As a user, when the listing API encounters and error, I am presented with an error page
	Scenario: User sees an error page when the CTS API encounters errors while rendering a trial description page
			And the CTS API is responding with a server error
		  Given the user navigates to "/v?a=40&id=NCI-2014-01507&loc=0&rl=2"
			Then page title on error page is "An error occurred. Please try again later."
			And the page contains meta tags with the following names
					| name                  | content |
					| prerender-status-code | 500     |
