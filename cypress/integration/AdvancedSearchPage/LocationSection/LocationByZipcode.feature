Feature: As a user, I want to be able to narrow down my search by specifying a zipcode


		Scenario: User has an option to limit results to zipcode and radius and refine search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "ZIP Code" radio button
        And user types "22182" in "U.S. ZIP Code" field
        And user selects "50" from "Radius" dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 978 for your search "
        And the criteria table displays the following
            | Category      | Selection                |
            | Near ZIP Code | within 50 miles of 22182 |
        And the url query has the following corresponding code
            | parameter | value |
            | z         | 22182 |
            | loc       | 1     |
            | rl        | 2     |
            | zp        | 50    |
        And the 1 result item has a "Location:" info with "1390 locations, including 20 near you"
        When user clicks on Modify Search Criteria button
        Then "U.S. ZIP Code" input field has a value "22182"
        And user clears "U.S. ZIP Code" input field
        And user types "20165" in "U.S. ZIP Code" field
        And "Radius" dropdown has a value "50"
        When user selects "100" from "Radius" dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 1117 for your search "
        And the criteria table displays the following
            | Category      | Selection                 |
            | Near ZIP Code | within 100 miles of 20165 |
        And the url query has the following corresponding code
            | parameter | value |
            | z         | 20165 |
            | loc       | 1     |
            | rl        | 2     |
            | zp        | 100   |
        And the 1 result item has a "Location:" info with "1390 locations, including 39 near you"

		Scenario: Negative: User is not able to search for an incorrect zip code AND is NOT able to search for empty zip
			Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
			Then the page title is "Find NCI-Supported Clinical Trials"
			When user selects "ZIP Code" radio button
			When user types "999g9" in "U.S. ZIP Code" field
			Then alert "Please enter a valid 5 digit U.S. zip code" is displayed
			And user clicks on "Find Trials" button
			Then the search is not executed and path is "/about-cancer/treatment/clinical-trials/search/advanced"
			When user clears "U.S. ZIP Code" input field
			And user clicks on "Find Trials" button
			Then text "Sorry, you seem to have entered invalid criteria. Please check the following, and try your search again:" is displayed
			And the invalid criteria table displays the following
				| Criteria |
				| Zip      |
			And text "For assistance, please contact the Cancer Information Service. You can chat online or call 1-800-4-CANCER (1-800-422-6237)." is displayed
			And "chat online" has a link "https://livehelp.cancer.gov/app/chat/chat_landing"
			And "Try a new search" link has a href "/about-cancer/treatment/clinical-trials/search/advanced"

    Scenario: Negative: User is not able to search for an incorrect zip code
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        When user selects "ZIP Code" radio button
        When user types "2016" in "U.S. ZIP Code" field
         And user clicks on "Find Trials" button
        Then alert "Please enter a valid 5 digit U.S. zip code" is displayed
        Then the search is not executed and path is "/about-cancer/treatment/clinical-trials/search/advanced"
