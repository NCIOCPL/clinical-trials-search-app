Feature: Advanced Clinical Trials Search Trial ID Section

	Scenario: User has an option to narrow down search criteria by trial id
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Trial ID" form section is displayed
		And help icon is displayed in "TrialID" section with href "/about-cancer/treatment/clinical-trials/search/help#trialid"
		And helper text "Separate multiple IDs with commas." is displayed

	Scenario: User enters trial id and searches
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Trial ID" form section is displayed
		When user types "NCI-2018-02825" in "TrialID" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category | Selection      |
			| Trial ID | NCI-2018-02825 |
		And the url query has the following corresponding code
			| parameter | value          |
			| loc       | 0              |
			| rl        | 2              |
			| tid       | NCI-2018-02825 |

	Scenario: User is able to search for multiple IDs and is able to modify search afterwards
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Trial ID" form section is displayed
		When user types "NCI-2018-02825,NCI-2015-00054,NCI-2014-01507" in "TrialID" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-3  of 3 for your search "
		And the criteria table displays the following
			| Category | Selection                                    |
			| Trial ID | NCI-2018-02825,NCI-2015-00054,NCI-2014-01507 |
		And the url query has the following corresponding code
			| parameter | value                                        |
			| loc       | 0                                            |
			| rl        | 2                                            |
			| tid       | NCI-2018-02825,NCI-2015-00054,NCI-2014-01507 |
		When user clicks on Modify Search Criteria button
		Then "Trial ID" field has value "NCI-2018-02825,NCI-2015-00054,NCI-2014-01507"
		When user clears "TrialID" input field
		And user types "NCI-2018-02825" in "TrialID" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category | Selection      |
			| Trial ID | NCI-2018-02825 |
		And the url query has the following corresponding code
			| parameter | value          |
			| loc       | 0              |
			| rl        | 2              |
			| tid       | NCI-2018-02825 |

	Scenario: User has an option to go to search results url directly and modify search
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/r?loc=0&rl=2&tid=NCI-2018-02825"
		Then the page title is "Clinical Trials Search Results"
		And trial info displays "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category | Selection      |
			| Trial ID | NCI-2018-02825 |
		When user clicks on Modify Search Criteria button
		Then "Trial Id" field has value "NCI-2018-02825"
		When user clears "TrialID" input field
		When user types "NCI-2018-02825,NCI-2015-00054,NCI-2014-01507" in "TrialID" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-3  of 3 for your search "
		And the criteria table displays the following
			| Category | Selection                                    |
			| Trial ID | NCI-2018-02825,NCI-2015-00054,NCI-2014-01507 |
		And the url query has the following corresponding code
			| parameter | value                                        |
			| loc       | 0                                            |
			| rl        | 2                                            |
			| tid       | NCI-2018-02825,NCI-2015-00054,NCI-2014-01507 |

	Scenario: User is searching for a trial id that does not exist will see no results found and is able to modify search
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Trial ID" form section is displayed
		When user types "NCI-2018-1234" in "TrialID" field
		When user clicks on "Find Trials" button
		Then the search is executed and no results page is displayed
		And the criteria table displays the following
			| Category | Selection     |
			| Trial ID | NCI-2018-1234 |
		When user clicks on Modify Search Criteria button
		Then "Trial Id" field has value "NCI-2018-1234"
		When user clears "TrialID" input field
		And user types "NCI-2018-02825" in "TrialID" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-1  of 1 for your search "
		And the criteria table displays the following
			| Category | Selection      |
			| Trial ID | NCI-2018-02825 |
		And the url query has the following corresponding code
			| parameter | value          |
			| loc       | 0              |
			| rl        | 2              |
			| tid       | NCI-2018-02825 |

	Scenario: User enters partial trial id and searches
		Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Trial ID" form section is displayed
		When user types "ecog" in "TrialID" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 10 for your search "
		And the criteria table displays the following
			| Category | Selection |
			| Trial ID | ecog      |
		And the url query has the following corresponding code
			| parameter | value |
			| loc       | 0     |
			| rl        | 2     |
			| tid       | ecog  |
		When user clicks on Modify Search Criteria button
		Then "Trial Id" field has value "ecog"
		When user clears "TrialID" input field
		And user types "ecog,swog" in "TrialID" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 21 for your search "
		And the criteria table displays the following
			| Category | Selection |
			| Trial ID | ecog,swog |
		And the url query has the following corresponding code
			| parameter | value     |
			| loc       | 0         |
			| rl        | 2         |
			| tid       | ecog,swog |
