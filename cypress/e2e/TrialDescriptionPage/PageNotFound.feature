Feature: Page Not Found

	Scenario: User is able to see a page not found when trying to access an invalid page
		Given screen breakpoint is set to "desktop"
		Given the user navigates to "/v?id=NCI-0000-00000&loc=0&rl=1"
		Then page title on error page is "Page Not Found"
		And the title tag should be "Page Not Found"

	Scenario: User is able to see a page not found when trying to access an invalid page, then looks for multiple links in the page
		Given screen breakpoint is set to "desktop"
		Given the user navigates to "/v?id=NCI-0000-00000&loc=0&rl=1"
		Then page title on error page is "Page Not Found"
		And the title tag should be "Page Not Found"
		And "homepage" link has a href "https://www.cancer.gov"
		And "cancer type" link has a href "https://www.cancer.gov/types"
		And "Get in touch" link has a href "https://www.cancer.gov/contact"


	Scenario: Page not found displays when given an incorrect NCI ID
		Given screen breakpoint is set to "desktop"
		Given the user navigates to "/v?id=NCI-chicken-nugget&loc=0&rl=1"
		Then page title on error page is "Page Not Found"
		And the title tag should be "Page Not Found"
		And the text "We can't find the page you're looking for." appears on the page
		And the following links and texts exist on the page
			| https://www.cancer.gov         | homepage     |
			| https://www.cancer.gov/types   | cancer type  |
			| https://www.cancer.gov/contact | Get in touch |
		And the search bar appears below
		Then the title tag should be "Page Not Found"
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |

	Scenario: Page not found displays when user navigates to non-existent path
		Given screen breakpoint is set to "desktop"
		Given the user navigates to "/chicken"
		Then page title on error page is "Page Not Found"
		And the title tag should be "Page Not Found"
		And the text "We can't find the page you're looking for." appears on the page
		And the following links and texts exist on the page
			| https://www.cancer.gov         | homepage     |
			| https://www.cancer.gov/types   | cancer type  |
			| https://www.cancer.gov/contact | Get in touch |
		And the search bar appears below
		Then the title tag should be "Page Not Found"
		And the page contains meta tags with the following names
			| name                  | content |
			| prerender-status-code | 404     |
