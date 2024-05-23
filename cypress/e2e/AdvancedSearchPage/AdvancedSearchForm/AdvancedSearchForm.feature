Feature: As a user, I want to be able to search for a clinical trial using advanced search form

	Scenario Outline: When user visits Advanced Search page, all page items are present
		And screen breakpoint is set to "<breakpoint>"
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And the text "NCI-supported clinical trials are those sponsored or otherwise financially supported by NCI. See our guide, Steps to Find a Clinical Trial, to learn about options for finding trials not included in NCI's collection." appears below the title
		And "Steps to Find a Clinical Trial" link has a href "https://www.cancer.gov/research/participate/clinical-trials-search/steps"
		And Search tip icon is displayed and text "Search Tip: All fields are optional. Skip any items that are unknown or not applicable or try our basic search." appears
		And "basic search" link has a href "/"
		And the following delighters are displayed
			| delighter    | href                                                              | title                              | text                                                                  |
			| cts-livehelp | /contact                                                          | Have a question?We're here to help | Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
			| cts-what     | /research/participate/clinical-trials/what-are-clinical-trials    | What Are Cancer Clinical Trials?   | Learn what they are and what you should know about them.              |
			| cts-which    | /research/participate/clinical-trials-search/steps                | Which trials are right for you?    | Use the checklist in our guide to gather the information you’ll need. |
		And sticky block is displayed with "Find Trials" and "Clear Form" buttons
		When user scrolls to the "Lead organization" section
		Then sticky block becomes fixed block

		Examples:
			| breakpoint |
			| desktop    |
			| tablet     |
			| mobile     |


	Scenario: User is able to clear a form
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Age" form section is displayed
		When user types "40" in "Age" field
		And user types "psa" in "Keywords" field
		When user clicks on "Clear Form" button
		Then "Age" input field has no value
		And "Keywords" input field has no value


	Scenario: user can navigate to basic search form while on advance page
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And Search tip icon is displayed and text "Search Tip: All fields are optional. Skip any items that are unknown or not applicable or try our basic search." appears
		And "basic search" link has a href "/"
		When user clicks on "basic search" with href "/"
		Then user is redirected to "/"

	Scenario: user can navigate to advanced search form while on basic search form page
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And Search tip icon is displayed and text "Search Tip: For more search options, use our advanced search." appears
		When user clicks on "advanced search" with href "/advanced"
		Then user is redirected to "/advanced"

		### meta data
		Scenario: As a search engine I want to have access to the meta data on a page
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And the title tag should be "Find NCI-Supported Clinical Trials - Advanced Search - NCI"
		And the page contains meta tags with the following names
			| name        | content                                                                                                                                                  |
			| description | Use our advanced search to find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
		And the page contains meta tags with the following properties
			| property       | content                                                                                                                                                  |
			| og:title       | Find NCI-Supported Clinical Trials - Advanced Search                                                                                                     |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/advanced                                                                            |
			| og:description | Use our advanced search to find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/advanced"

