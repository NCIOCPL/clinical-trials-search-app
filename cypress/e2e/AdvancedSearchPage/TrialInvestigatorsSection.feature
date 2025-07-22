Feature: Advanced Clinical Trials Search Trial Investigators Section

	Scenario: User has an option to narrow down search criteria by Trial Investigators
		Given the user navigates to "/advanced"
		Then the page title is "Find Clinical Trials"
		And "Trial Investigators" form section is displayed
		And help icon is displayed in "TrialInvestigators" section with href "/research/participate/clinical-trials-search/help#trialinvestigators"
		And "TrialInvestigator" input field has a placeholder "Investigator name"
		And helper text "Search by trial investigator." is displayed

	Scenario: User has an option to search by Trial Investigators using autosuggest
		Given the user navigates to "/advanced"
		Then the page title is "Find Clinical Trials"
		And "Trial Investigators" form section is displayed
		When user clicks on "TrialInvestigator" field
		Then autocomplete dropdown is displayed
		And user types "grace sm" in "TrialInvestigator" field
		And user selects "Grace Smith" from dropdown
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category            | Selection   |
			| Trial Investigators | Grace Smith |

		And the url query has the following corresponding code
			| parameter | value       |
			| in        | Grace Smith |
			| loc       | 0           |
			| rl        | 2           |

	Scenario: User searches for investigators that does not exist
		Given the user navigates to "/advanced"
		Then the page title is "Find Clinical Trials"
		And "Trial Investigators" form section is displayed
		When user clicks on "TrialInvestigator" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "asdf" in "TrialInvestigator" field
		Then autocomplete dropdown is displayed with "No results found" text

	Scenario: User has an option to go to search results url directly and modify search
		Given the user navigates to "r?in=Grace%20Smith&loc=0&rl=2"
		Then the page title is "Clinical Trials Search Results"
		And trial info displayes "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category            | Selection   |
			| Trial Investigators | Grace Smith |
		When user clicks on Modify Search Criteria button
		Then Trial Investigators field has value "Grace Smith"
		When user clears "TrialInvestigator" input field
		And user types "henry" in "TrialInvestigator" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-6  of 6 for your search "
		And the criteria table displays the following
			| Category            | Selection |
			| Trial Investigators | henry     |
		And the url query has the following corresponding code
			| parameter | value |
			| in        | henry |
			| loc       | 0     |
			| rl        | 2     |

	Scenario: User is able to search for a specific investigators and refine search
		Given the user navigates to "/advanced"
		Then the page title is "Find Clinical Trials"
		And "Trial Investigators" form section is displayed
		And user types "grace sm" in "TrialInvestigator" field
		And user selects "Grace Smith" from dropdown
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category            | Selection   |
			| Trial Investigators | Grace Smith |
		And the url query has the following corresponding code
			| parameter | value       |
			| in        | Grace Smith |
			| loc       | 0           |
			| rl        | 2           |
		When user clicks on Modify Search Criteria button
		Then Trial Investigators field has value "Grace Smith"
		When user clears "TrialInvestigator" input field
		And user types "henry" in "TrialInvestigator" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-6  of 6 for your search "
		And the criteria table displays the following
			| Category            | Selection |
			| Trial Investigators | henry     |
		And the url query has the following corresponding code
			| parameter | value |
			| in        | henry |
			| loc       | 0     |
			| rl        | 2     |
