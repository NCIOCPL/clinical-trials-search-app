
Feature: Advanced Clinical Trials Search Lead Organization Section

	Scenario: User has an option to narrow down search criteria by lead org
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Lead Organization" form section is displayed
		And help icon is displayed in "Lead Organization" section with href "/research/participate/clinical-trials-search/help#leadorganization"
		And "Lead organization" input field has a placeholder "Organization name"
		And helper text "Search by lead organization." is displayed

	Scenario: User has an option to search by lead org using autosuggest and refine search
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Lead Organization" form section is displayed
		When user clicks on "Lead organization" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "bar" in "Lead organization" field
		And user selects "Barretos Cancer Hospital" from dropdown
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-1  of 1 for your search "
		Then the criteria table displays the following
			| Category           | Selection                |
			| Lead Organizations | Barretos Cancer Hospital |
		And the url query has the following corresponding code
			| parameter | value                    |
			| lo        | Barretos Cancer Hospital |
			| loc       | 0                        |
			| rl        | 2                        |
		When user clicks on Modify Search Criteria button
		Then "Lead organization" field has value "Barretos Cancer Hospital"
		When user clears "Lead organization" input field
		And user types "brown" in "Lead organization" field
		And user selects "Brown University" from dropdown
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-2  of 2 for your search "
		Then the criteria table displays the following
			| Category           | Selection        |
			| Lead Organizations | Brown University |
		And the url query has the following corresponding code
			| parameter | value            |
			| lo        | Brown University |
			| loc       | 0                |
			| rl        | 2                |


	Scenario: User searches for investigators that does not exist
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Lead Organization" form section is displayed
		When user clicks on "Lead organization" field
		Then autocomplete dropdown is displayed
		And user types "asdf" in "Lead organization" field
		Then autocomplete dropdown is displayed with "No results found" text

	Scenario: User see results page when navigated directly to an url and modify search
		Given the user navigates to "/r?lo=Brown%20University&loc=0&rl=2"
		And trial info displayes "Results 1-2  of 2 for your search "
		Then the criteria table displays the following
			| Category           | Selection        |
			| Lead Organizations | Brown University |
		When user clicks on Modify Search Criteria button
		Then "Lead organization" field has value "Brown University"

	Scenario: User has an option to search for lead organization without using autosuggest
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Lead Organization" form section is displayed
		When user clicks on "Lead organization" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "mayo" in "Lead organization" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-10  of 141 for your search "
		Then the criteria table displays the following
			| Category           | Selection |
			| Lead Organizations | mayo      |
		And the url query has the following corresponding code
			| parameter | value |
			| lo        | mayo  |
			| loc       | 0     |
			| rl        | 2     |
		When user clicks on Modify Search Criteria button
		Then "Lead organization" field has value "mayo"
		When user clears "Lead organization" input field
		And user types "brown" in "Lead organization" field
		And user selects "Brown University" from dropdown
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-2  of 2 for your search "
		Then the criteria table displays the following
			| Category           | Selection        |
			| Lead Organizations | Brown University |
		And the url query has the following corresponding code
			| parameter | value            |
			| lo        | Brown University |
			| loc       | 0                |
			| rl        | 2                |
