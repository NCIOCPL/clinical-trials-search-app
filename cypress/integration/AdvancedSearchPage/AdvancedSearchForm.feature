Feature: As a user, I want to be able to search for a clinical trial using advanced search form

	Scenario Outline: When user visits Advanced Search page, all page items are present
		And screen breakpoint is set to "<breakpoint>"
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And the text "NCI-supported clinical trials are those sponsored or otherwise financially supported by NCI. See our guide, Steps to Find a Clinical Trial, to learn about options for finding trials not included in NCI's collection." appears below the title
		And "Steps to Find a Clinical Trial" link has a href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/trial-guide"
		And Search tip icon is displayed and text "Search Tip: All fields are optional. Skip any items that are unknown or not applicable or try our basic search." appears
		And "basic search" link has a href "/about-cancer/treatment/clinical-trials/search"
		And the following delighters are displayed
			| delighter    | href                                                       | title                              | text                                                                  |
			| cts-livehelp | /contact                                                   | Have a question?We're here to help | Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
			| cts-what     | /about-cancer/treatment/clinical-trials/what-are-trials    | What Are Cancer Clinical Trials?   | Learn what they are and what you should know about them.              |
			| cts-which    | /about-cancer/treatment/clinical-trials/search/trial-guide | Which trials are right for you?    | Use the checklist in our guide to gather the information you’ll need. |
		And sticky block is displayed with "Find Trials" and "Clear Form" buttons
		When user scrolls to the "Lead organization" section
		Then sticky block becomes fixed block

		Examples:
			| breakpoint |
			| desktop    |
			| tablet     |
			| mobile     |


	Scenario: User is able to clear a form
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Age" form section is displayed
		When user types "40" in "Age" field
		And user types "psa" in "Keywords" field
		When user clicks on "Clear Form" button
		Then "Age" input field has no value
		And "Keywords" input field has no value


	Scenario: user can navigate to basic search form while on advance page
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And Search tip icon is displayed and text "Search Tip: All fields are optional. Skip any items that are unknown or not applicable or try our basic search." appears
		And "basic search" link has a href "/about-cancer/treatment/clinical-trials/search"
		When user clicks on "basic search" with href "/about-cancer/treatment/clinical-trials/search"
		Then user is redirected to "/about-cancer/treatment/clinical-trials/search"

	Scenario: user can navigate to advanced search form while on basic search form page
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And Search tip icon is displayed and text "Search Tip: For more search options, use our advanced search." appears
		When user clicks on "advanced search" with href "/about-cancer/treatment/clinical-trials/search/advanced"
		Then user is redirected to "/about-cancer/treatment/clinical-trials/search/advanced"
