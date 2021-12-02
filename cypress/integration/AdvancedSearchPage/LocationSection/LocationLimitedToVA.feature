Feature: As a user, I want to be able to narrow down my search by locations limited to veterans affair facilities

Scenario: User has an option to limit results to VA facilities and all locations and refines search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Location" form section is displayed
        When user selects "At NIH (only show trials at the NIH Clinical Center in Bethesda, MD)" radio button
        When user toggles "Limit results to Veterans Affairs facilities"
        Then "Limit results to Veterans Affairs facilities" toggle is switched to "Yes"
        And the following radio buttons are displayed
            | label                |
            | Search All Locations |
            | ZIP Code             |
            | Country, State, City |
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 112 for your search "
        And the criteria table displays the following
            | Category                    | Selection                                                |
            | Veterans Affairs Facilities | Results limited to trials at Veterans Affairs facilities |
        And the url query has the following corresponding code
            | parameter | value |
            | va        | 1     |
            | loc       | 0     |
            | rl        | 2     |
				# Line below commented out temporarily due to change in utility file isWithinRadius. Should be enabled again once results page has api key properties change which should be in PR #430
        # And the 1 result item has a "Location:" info with "1390 locations, including 13 near you"
        When user clicks on Modify Search Criteria button
        Then "Limit results to Veterans Affairs facilities" toggle is switched to "Yes"
        When user toggles "Limit results to Veterans Affairs facilities"
        Then "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 6821 for your search for: \"all trials\""
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 2     |
        And the 1 result item has a "Location:" info with "1382 locations"

    Scenario: User has an option to limit results to VA facilities and Zip code and to refine search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Location" form section is displayed
        When user toggles "Limit results to Veterans Affairs facilities"
        Then "Limit results to Veterans Affairs facilities" toggle is switched to "Yes"
        And the following radio buttons are displayed
            | label                |
            | Search All Locations |
            | ZIP Code             |
            | Country, State, City |
        When user selects "ZIP Code" radio button
        And user types "22182" in "U.S. ZIP Code" field
        And user selects "500" from "Radius" dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 48 for your search "
        And the criteria table displays the following
            | Category                    | Selection                                                |
            | Near ZIP Code               | within 500 miles of 22182                                |
            | Veterans Affairs Facilities | Results limited to trials at Veterans Affairs facilities |
        And the url query has the following corresponding code
            | parameter | value |
            | z         | 22182 |
            | loc       | 1     |
            | rl        | 2     |
            | zp        | 500   |
            | va        | 1     |
        # Same as above for disabled step
				# And the 1 result item has a "Location:" info with "1390 locations, including 5 near you"
        When user clicks on Modify Search Criteria button
        Then "U.S. ZIP Code" input field has a value "22182"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "Yes"
        And "Radius" dropdown has a value "500"
        When user clears "U.S. ZIP Code" input field
        And user types "20165" in "U.S. ZIP Code" field
        When user selects "200" from "Radius" dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-5  of 5 for your search "
        And the criteria table displays the following
            | Category                    | Selection                                                |
            | Near ZIP Code               | within 200 miles of 20165                                |
            | Veterans Affairs Facilities | Results limited to trials at Veterans Affairs facilities |
        And the url query has the following corresponding code
            | parameter | value |
            | z         | 20165 |
            | loc       | 1     |
            | rl        | 2     |
            | zp        | 200   |
            | va        | 1     |
        # Same as above for disabled step
	      # And the 1 result item has a "Location:" info with "703 locations, including 1 near you"
        When user clicks on 1 trial link
        When user clicks on "Locations & Contacts" section of accordion
        And button "Show all locations" is displayed
        And text "Locations matching your search criteria" is displayed
        And the matched location "country" is "United States"
        And the matched location "state" is "Virginia"
        And the matched location "city" is "Richmond"

    Scenario: User has an option to limit results to VA facilities and country, state and city
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Location" form section is displayed
        When user toggles "Limit results to Veterans Affairs facilities"
        Then "Limit results to Veterans Affairs facilities" toggle is switched to "Yes"
        When user selects "Country, State, City" radio button
        When user selects "United States" from "Country" dropdown
        And user types "vir" in "State" field
        And user selects "Virginia" from dropdown
        And user types "Richmond" in "City" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-3  of 3 for your search "
        And the criteria table displays the following
            | Category                    | Selection                                                |
            | Country                     | United States                                            |
            | States                      | Virginia                                                 |
            | City                        | Richmond                                                 |
            | Veterans Affairs Facilities | Results limited to trials at Veterans Affairs facilities |
        And the url query has the following corresponding code
            | parameter | value         |
            | loc       | 2             |
            | rl        | 2             |
            | lcnty     | United States |
            | lcty      | Richmond      |
            | lst       | VA            |
            | va        | 1             |
        # Same as above for disabled step
	      # And the 1 result item has a "Location:" info with "703 locations, including 1 near you"
        When user clicks on 1 trial link
        When user clicks on "Locations & Contacts" section of accordion
        And button "Show all locations" is displayed
        And text "Locations matching your search criteria" is displayed
        And the matched location "country" is "United States"
        And the matched location "state" is "Virginia"
        And the matched location "city" is "Richmond"
