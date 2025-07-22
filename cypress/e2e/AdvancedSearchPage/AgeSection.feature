Feature: Clinical Trials Advanced Search Page age section
    Scenario: User has an option to narrow down search criteria by age
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Age" form section is displayed
        And help icon is displayed in "Age" section with href "/research/participate/clinical-trials-search/help#age"
        And helper text "Enter the age of the participant." is displayed

    Scenario: User is able to search for a specific age
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Age" form section is displayed
        When user types "40" in "Age" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 6306 for your search "
        And the criteria table displays the following
            | Category | Selection |
            | Age      | 40        |
        And the url query has the following corresponding code
            | parameter | value |
            | a         | 40    |
            | loc       | 0     |
            | rl        | 2     |

    Scenario: User is able to search for a specific age from basic search and refine search
        Given the user navigates to "/"
        Then the page title is "Find Cancer Clinical Trials"
        And "Age" form section is displayed
        When user types "40" in "Age" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 6306 for your search "
        And the criteria table displays the following
            | Category | Selection |
            | Age      | 40        |
        And the url query has the following corresponding code
            | parameter | value |
            | a         | 40    |
            | loc       | 0     |
            | rl        | 1     |
        When user clicks on Modify Search Criteria button
        Then "Age" field has value "40"
        When user clears "Age" input field
        And user types "39" in "Age" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 6731 for your search "
        And the criteria table displays the following
            | Category | Selection |
            | Age      | 39        |
        And the url query has the following corresponding code
            | parameter | value |
            | a         | 39    |
            | loc       | 0     |
            | rl        | 2     |


    Scenario: Negative: User is not able to search for age out of boundaries
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Age" form section is displayed
        When user types "0" in "Age" field
        Then alert "Please enter a number between 1 and 120." is displayed
        When user clears "Age" input field
        Then alert is not displayed
        When user types "121" in "Age" field
        Then alert "Please enter a number between 1 and 120." is displayed
        When user clicks on "Find Trials" button
        Then the search is not executed and path is "/advanced"

    Scenario: User has an option to go to search results url directly and modify search
        Given the user navigates to "/r?loc=0&rl=2&a=40"
        Then the page title is "Clinical Trials Search Results"
        And trial info displays "Results 1-10  of 6306 for your search "
        When user clicks on Modify Search Criteria button
        Then age field has value "40"

	Scenario: User is able to view trial results which have varying age criteria
		Given the user navigates to "/advanced"
		Then the page title is "Find Cancer Clinical Trials"
		And "Age" form section is displayed
		When user types "NCI-2019-02289, NCI-2019-06216, NCI-2019-08622, NCI-2019-00399, NCI-2021-06711, NCI-2014-00677, NCI-2016-01734" in "TrialID" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And the criteria table displays the following
			| Category | Selection                                    |
			| Trial ID | NCI-2019-02289, NCI-2019-06216, NCI-2019-08622, NCI-2019-00399, NCI-2021-06711, NCI-2014-00677, NCI-2016-01734|
		# Maximum Age - Years
		And the Age for result 1 displays the following "50 years and younger"
		# Maximum Age - Months
		And the Age for result 2 displays the following "18 months and younger"
		# Days to Years
		And the Age for result 3 displays the following "365 days to 30 years"
		# Months to Year
		And the Age for result 4 displays the following "12 months to 21 years"
		# Years to Years
		And the Age for result 5 displays the following "1 to 30 years"
		# Minimum Age
		And the Age for result 6 displays the following "1 years and over"
		# Not specified
		And the Age for result 7 displays the following "Not Specified"
