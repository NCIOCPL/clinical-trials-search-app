Feature: Advanced Clinical Trials Search Drug Treatment Section

	Scenario: User has an option to narrow down search criteria by Drug or treatment
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Drug/Treatment" form section is displayed
		And help icon is displayed in "Drug/Treatment" section with href "/about-cancer/treatment/clinical-trials/search/help#drugtreatment"
		And info text "Search for a specific drug or intervention." is displayed in the section body
		And "Drug" input field has a placeholder "Start typing to select drugs and/or drug families"
		And helper text "You can use the drug's generic or brand name. More than one selection may be made." is displayed
		And "Treatment" input field has a placeholder "Start typing to select other treatments"
		And helper text "More than one selection may be made." is displayed

	Scenario: User has an option to search by Drug and treatment using autosuggest and refine search
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Drug/Treatment" form section is displayed
		When user clicks on "Drug" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "ibup" in "Drug" field
		And user selects "Ibuprofen" from dropdown
		When user clicks on "Treatment" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "polymo" in "Treatment" field
		And user selects "Polymorphism AnalysisOther Names: Polymorphism AnalysisPolymorphism Detection" from dropdown
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-4  of 4 for your search "
		And the criteria table displays the following
			| Category         | Selection             |
			| Drug/Drug Family | Ibuprofen             |
			| Other Treatments | Polymorphism Analysis |
		And the url query has the following corresponding code
			| parameter | value  |
			| loc       | 0      |
			| rl        | 2      |
			| d         | C561   |
			| i         | C18309 |
		When user clicks on Modify Search Criteria button
		Then "Drug" input field has a value "Ibuprofen"
		Then "Treatment" input field has a value "Polymorphism Analysis"
		When user removes "Ibuprofen" from the "Drug" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category         | Selection             |
			| Other Treatments | Polymorphism Analysis |
		And the url query has the following corresponding code
			| parameter | value  |
			| loc       | 0      |
			| rl        | 2      |
			| i         | C18309 |

	Scenario: User has an option to search for multiple Drug and treatment using autosuggest and then refine search
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Drug/Treatment" form section is displayed
		When user clicks on "Drug" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "ibup" in "Drug" field
		And user selects "Ibuprofen" from dropdown
		When user clicks on "Drug" field
		And user types "bev" in "Drug" field
		And user selects "Bevacizumab" from dropdown
		When user clicks on "Treatment" field
		And user types "polymo" in "Treatment" field
		And user selects "Polymorphism AnalysisOther Names: Polymorphism AnalysisPolymorphism Detection" from dropdown
		When user clicks on "Treatment" field
		And user types "orc" in "Treatment" field
		And user selects "Orchiectomy" from dropdown
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 98 for your search "
		And the criteria table displays the following
			| Category         | Selection                          |
			| Drug/Drug Family | Ibuprofen, Bevacizumab             |
			| Other Treatments | Polymorphism Analysis, Orchiectomy |
		And the url query has the following corresponding code with duplicated keys
			| d   | C561   |
			| d   | C2039  |
			| i   | C18309 |
			| i   | C15288 |
			| loc | 0      |
			| rl  | 2      |
		When user clicks on Modify Search Criteria button
		When user removes "Bevacizumab" from the "Drug" field
		When user removes "Orchiectomy" from the "Treatment" field
		Then "Drug" input field has a value "Ibuprofen"
		Then "Treatment" input field has a value "Polymorphism Analysis"
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-4  of 4 for your search "
		And the criteria table displays the following
			| Category         | Selection             |
			| Drug/Drug Family | Ibuprofen             |
			| Other Treatments | Polymorphism Analysis |
		And the url query has the following corresponding code
			| parameter | value  |
			| loc       | 0      |
			| rl        | 2      |
			| d         | C561   |
			| i         | C18309 |

	Scenario: User enters keyword that does not return a match for drug and intervention
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Drug/Treatment" form section is displayed
		When user clicks on "Drug" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "asdfg" in "Drug" field
		Then autocomplete dropdown is displayed with "No results found" text
		When user clicks on "Treatment" field
		Then autocomplete dropdown is displayed
		And user types "asdfg" in "Treatment" field
		Then autocomplete dropdown is displayed with "No results found" text

	Scenario: User is searching for a drug by it's preferred name
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Drug/Treatment" form section is displayed
		When user clicks on "Drug" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
		And user types "chi" in "Drug" field
		And user selects "Other Names: Chimeric Antigen" from dropdown
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 153 for your search "
		And the criteria table displays the following
			| Category         | Selection                                |
			| Drug/Drug Family | Chimeric Antigen Receptor T-Cell Therapy |
		And the url query has the following corresponding code
			| parameter | value            |
			| d         | C137999\|C126102 |
			| loc       | 0                |
			| rl        | 2                |

	Scenario: User searches for drug/intervention via autosuggest on advanced form
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Drug/Treatment" form section is displayed
    Then "Drug" input field has a placeholder "Start typing to select drugs and/or drug families"
    When user clicks on "Drug" field
		Then autocomplete dropdown is displayed with "Please enter 3 or more characters" text
    And user types "ant" in "Drug" field
		And user selects "Other Names: Anti-Cancer Agents" from dropdown
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 4154 for your search "
		And the criteria table displays the following
			| Category         | Selection            |
			| Drug/Drug Family | Antineoplastic Agent |
		And the url query has the following corresponding code
			| parameter | value            |
			| d         | C274						 |
			| loc       | 0                |
			| rl        | 2                |
