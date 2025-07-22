Feature: As a user, I want to be able to narrow down my search by specifying country, state and city


    Scenario: User has an option to limit results to Country, State and City and refine search
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "Country, State, City" radio button
        And user selects "United Kingdom" from "Country" dropdown
        Then "State" input field is not displayed
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-4  of 4 for your search "
        And the criteria table displays the following
            | Category | Selection      |
            | Country  | United Kingdom |
        And the url query has the following corresponding code
            | parameter | value          |
            | loc       | 2              |
            | rl        | 2              |
            | lcnty     | United Kingdom |
        And the 1 result item has a "Location:" info with "112 locations, including 8 near you"
        When user clicks on Modify Search Criteria button
        And "Country" dropdown has a value "United Kingdom"
        When user selects "United States" from "Country" dropdown
        And user types "vir" in "State" field
        And user selects "Virginia" from dropdown
        And user clears "City" input field
        And user types "Richmond" in "City" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 191 for your search "
        And the criteria table displays the following
            | Category | Selection     |
            | Country  | United States |
            | States   | Virginia      |
            | City     | Richmond      |
        And the url query has the following corresponding code
            | parameter | value         |
            | loc       | 2             |
            | rl        | 2             |
            | lcnty     | United States |
            | lcty      | Richmond      |
            | lst       | VA            |
        And the 1 result item has a "Location:" info with "1390 locations, including 2 near you"


    Scenario: User has an option to limit results to a foreign Country and city
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "Country, State, City" radio button
        And user selects "United Kingdom" from "Country" dropdown
        Then "State" input field is not displayed
        When user types "London" in "City" field
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-3  of 3 for your search "
        And the criteria table displays the following
            | Category | Selection      |
            | Country  | United Kingdom |
            | City     | London         |
        And the url query has the following corresponding code
            | parameter | value          |
            | loc       | 2              |
            | rl        | 2              |
            | lcnty     | United Kingdom |
            | lcty      | London         |
        And the 1 result item has a "Location:" info with "112 locations, including 1 near you"
        When user clicks on 1 trial link
        When user clicks on "Locations & Contacts" section of accordion
        And button "Show all locations" is displayed
        And text "Locations matching your search criteria" is displayed
        And the matched location "country" is "United Kingdom"
        And the matched location "city" is "London"

    Scenario: User has an option to limit results to the US and city and refines search
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "Country, State, City" radio button
        When user types "Miami" in "City" field
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 304 for your search "
        And the criteria table displays the following
            | Category | Selection     |
            | Country  | United States |
            | City     | Miami         |
        And the url query has the following corresponding code
            | parameter | value         |
            | loc       | 2             |
            | rl        | 2             |
            | lcnty     | United States |
            | lcty      | Miami         |
        And user clicks on Modify Search Criteria button
        Then "City" input field has a value "Miami"
        And "Country" dropdown has a value "United States"
        And user types "vir" in "State" field
        And user selects "Virginia" from dropdown
        And user clears "City" input field
        And user types "Richmond" in "City" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 191 for your search "
        And the criteria table displays the following
            | Category | Selection     |
            | Country  | United States |
            | States   | Virginia      |
            | City     | Richmond      |
        And the url query has the following corresponding code
            | parameter | value         |
            | loc       | 2             |
            | rl        | 2             |
            | lcnty     | United States |
            | lcty      | Richmond      |
            | lst       | VA            |
        And the 1 result item has a "Location:" info with "1390 locations, including 2 near you"

    Scenario: User has an option to search for multiple states and refine search
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "Country, State, City" radio button
        And user types "vir" in "State" field
        And user selects "Virginia" from dropdown
        And user types "Cali" in "State" field
        And user selects "California" from dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 1967 for your search "
        And the criteria table displays the following
            | Category | Selection            |
            | Country  | United States        |
            | State    | Virginia, California |
        And the url query has the following corresponding code with duplicated keys
            | lcnty | United States |
            | loc   | 2             |
            | lst   | VA            |
            | lst   | CA            |
            | rl    | 2             |
        When user clicks on Modify Search Criteria button
        And "Country" dropdown has a value "United States"
        When user removes "California" from the "State" field
        And user types "Richmond" in "City" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 191 for your search "
        And the criteria table displays the following
            | Category | Selection     |
            | Country  | United States |
            | States   | Virginia      |
            | City     | Richmond      |
        And the url query has the following corresponding code
            | parameter | value         |
            | loc       | 2             |
            | rl        | 2             |
            | lcnty     | United States |
            | lcty      | Richmond      |
            | lst       | VA            |
        And the 1 result item has a "Location:" info with "1390 locations, including 2 near you"

    Scenario: User has an option to navigate direclt to url with Country, State and City and refine search
        Given the user navigates to "/r?lcnty=United%20States&lcty=Richmond&loc=2&lst=VA&rl=2"
        And trial info displayes "Results 1-10  of 191 for your search "
        And the criteria table displays the following
            | Category | Selection     |
            | Country  | United States |
            | States   | Virginia      |
            | City     | Richmond      |
        And the url query has the following corresponding code
            | parameter | value         |
            | loc       | 2             |
            | rl        | 2             |
            | lcnty     | United States |
            | lcty      | Richmond      |
            | lst       | VA            |
        When user clicks on Modify Search Criteria button
        Then "City" input field has a value "Richmond"
        And "Country" dropdown has a value "United States"
        When user clears "City" input field
        And user types "Cali" in "State" field
        And user selects "California" from dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 1967 for your search "
        And the criteria table displays the following
            | Category | Selection            |
            | Country  | United States        |
            | State    | Virginia, California |
        And the url query has the following corresponding code with duplicated keys
            | lcnty | United States |
            | loc   | 2             |
            | lst   | VA            |
            | lst   | CA            |
            | rl    | 2             |
        When user clicks on Modify Search Criteria button
        And "Country" dropdown has a value "United States"
        When user removes "California" from the "State" field
        And user types "Richmond" in "City" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 191 for your search "
        And the criteria table displays the following
            | Category | Selection     |
            | Country  | United States |
            | States   | Virginia      |
            | City     | Richmond      |
        And the url query has the following corresponding code
            | parameter | value         |
            | loc       | 2             |
            | rl        | 2             |
            | lcnty     | United States |
            | lcty      | Richmond      |
            | lst       | VA            |
        And the 1 result item has a "Location:" info with "1390 locations, including 2 near you"

    Scenario: User has an option navigate directly to url with a country that doesn't return a match
        Given the user navigates to "/r?lcnty=Russia&loc=2&rl=2"
        And "No clinical trials matched your search.For assistance, please contact the Cancer Information Service. You can chat online or call 1-800-4-CANCER (1-800-422-6237).Try a new search" no trial info is displayed
        And the criteria table displays the following
            | Category | Selection |
            | Country  | Russia    |
        And the url query has the following corresponding code
            | parameter | value  |
            | loc       | 2      |
            | rl        | 2      |
            | lcnty     | Russia |
