Feature: As a user, I want to be able to narrow down my search by location


    Scenario: User has an option to narrow down search criteria by location
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Location" form section is displayed
        And help icon is displayed in "Location" section with href "/about-cancer/treatment/clinical-trials/search/help#location"
        And info text "Search for trials near a specific zip code; or in a country, state and city; or at a particular institution. The default selection will search for trials in all available locations. You may choose to limit results to Veterans Affairs facilities." is displayed in the section body
        And "Limit results to Veterans Affairs facilities" toggle is displayed with label "Limit results to Veterans Affairs facilities"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        And "Search All Locations" radio button is checked

    ### VA facilities ######

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
        And the 1 result item has a "Location:" info with "1390 locations, including 13 near you"
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
        And the 1 result item has a "Location:" info with "1390 locations, including 5 near you"
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
        And the 1 result item has a "Location:" info with "703 locations, including 1 near you"
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
        And the 1 result item has a "Location:" info with "703 locations, including 1 near you"
        When user clicks on 1 trial link
        When user clicks on "Locations & Contacts" section of accordion
        And button "Show all locations" is displayed
        And text "Locations matching your search criteria" is displayed
        And the matched location "country" is "United States"
        And the matched location "state" is "Virginia"
        And the matched location "city" is "Richmond"

    #### ZIPCODE ###
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

    Scenario: Negative: User is not able to search for an incorrect zip code but is able to search for empty zip
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        When user selects "ZIP Code" radio button
        When user types "999g9" in "U.S. ZIP Code" field
        Then alert "Please enter a valid 5 digit U.S. zip code" is displayed
        And user clicks on "Find Trials" button
        Then the search is not executed and path is "/about-cancer/treatment/clinical-trials/search/advanced"
        When user clears "U.S. ZIP Code" input field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 7152 for your search for: \"all trials\""
        And the url query has the following corresponding code
            | parameter | value |
            | z         |       |
            | loc       | 1     |
            | rl        | 2     |
            | zp        | 100   |
    ### this is mentioned in the bug ticket #286 - after it's fixed the test will be uncommented
    # Scenario: Negative: User is not able to search for an incorrect zip code
    #     Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
    #     Then the page title is "Find NCI-Supported Clinical Trials"
    #     When user selects "ZIP Code" radio button
    #     When user types "2016" in "U.S. ZIP Code" field
    #     Then alert "Please enter a valid 5 digit U.S. zip code" is displayed
    #     Then the search is not executed and path is "/about-cancer/treatment/clinical-trials/search/advanced"

    #### country, state, city #######

    Scenario: User has an option to limit results to Country, State and City and refine search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
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
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
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
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
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
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
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
        Given the user navigates to "about-cancer/treatment/clinical-trials/search/r?lcnty=United%20States&lcty=Richmond&loc=2&lst=VA&rl=2"
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
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/r?lcnty=Russia&loc=2&rl=2"
        And "No clinical trials matched your search." no trial info is displayed
        And the criteria table displays the following
            | Category | Selection |
            | Country  | Russia    |
        And the url query has the following corresponding code
            | parameter | value  |
            | loc       | 2      |
            | rl        | 2      |
            | lcnty     | Russia |


    ## HOSPITALS ######

    Scenario: User has an option to limit results to Hospitals and refine search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "Hospitals/Institutions" radio button
        And user types "um b" in "Hospitals/Institutions" autosuggest field
        And user selects "UM Baltimore Washington Medical Center / Tate Cancer Center" from dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 29 for your search "
        And the criteria table displays the following
            | Category                | Selection                                                   |
            | At Hospital/Institution | UM Baltimore Washington Medical Center / Tate Cancer Center |
        And the url query has the following corresponding code
            | parameter | value                                                       |
            | loc       | 3                                                           |
            | rl        | 2                                                           |
            | hos       | UM Baltimore Washington Medical Center / Tate Cancer Center |
        And the 1 result item has a "Location:" info with "1382 locations"
        When user clicks on Modify Search Criteria button
        Then "Hospitals/Institutions" input field has a value "UM Baltimore Washington Medical Center / Tate Cancer Center"
        And user clears "Hospitals/Institutions" input field
        And user types "erl" in "Hospitals/Institutions" autosuggest field
        And user selects "Erlanger Medical Center" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-1  of 1 for your search "
        And the criteria table displays the following
            | Category                | Selection               |
            | At Hospital/Institution | Erlanger Medical Center |
        And the url query has the following corresponding code
            | parameter | value                   |
            | loc       | 3                       |
            | rl        | 2                       |
            | hos       | Erlanger Medical Center |

    Scenario: User has an option naviagte directly to url with Hospitals and refine search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/r?hos=Erlanger%20Medical%20Center&loc=3&rl=2"
        And trial info displayes "Results 1-1  of 1 for your search "
        And the criteria table displays the following
            | Category                | Selection               |
            | At Hospital/Institution | Erlanger Medical Center |
        And the url query has the following corresponding code
            | parameter | value                   |
            | loc       | 3                       |
            | rl        | 2                       |
            | hos       | Erlanger Medical Center |
        When user clicks on Modify Search Criteria button
        And user clears "Hospitals/Institutions" input field
        And user types "um b" in "Hospitals/Institutions" autosuggest field
        And user selects "UM Baltimore Washington Medical Center / Tate Cancer Center" from dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 29 for your search "
        And the criteria table displays the following
            | Category                | Selection                                                   |
            | At Hospital/Institution | UM Baltimore Washington Medical Center / Tate Cancer Center |
        And the url query has the following corresponding code
            | parameter | value                                                       |
            | loc       | 3                                                           |
            | rl        | 2                                                           |
            | hos       | UM Baltimore Washington Medical Center / Tate Cancer Center |
        And the 1 result item has a "Location:" info with "1382 locations"


    Scenario: User has an option to search for a Hospital without using autosuggest
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "Hospitals/Institutions" radio button
        And user types "mayo" in "Hospitals/Institutions" autosuggest field
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 559 for your search "
        And the criteria table displays the following
            | Category                | Selection |
            | At Hospital/Institution | mayo      |
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 3     |
            | rl        | 2     |
            | hos       | mayo  |
        And the 1 result item has a "Location:" info with "1390 locations"
        When user clicks on Modify Search Criteria button
        Then "Hospitals/Institutions" input field has a value "mayo"
        And user clears "Hospitals/Institutions" input field
        And user types "erl" in "Hospitals/Institutions" autosuggest field
        And user selects "Erlanger Medical Center" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-1  of 1 for your search "
        And the criteria table displays the following
            | Category                | Selection               |
            | At Hospital/Institution | Erlanger Medical Center |
        And the url query has the following corresponding code
            | parameter | value                   |
            | loc       | 3                       |
            | rl        | 2                       |
            | hos       | Erlanger Medical Center |

#### AT NIH ONLY ######


Scenario: User has an option to limit results to show trials at NIH only
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
    When user selects "At NIH (only show trials at the NIH Clinical Center in Bethesda, MD)" radio button
    When user clicks on "Find Trials" button
    Then the search is executed and results page is displayed
    And trial info displayes "Results 1-10  of 283 for your search "
    And the criteria table displays the following
        | Category | Selection                                                  |
        | At NIH   | Only show trials at the NIH Clinical Center (Bethesda, MD) |
    And the url query has the following corresponding code
        | parameter | value |
        | loc       | 4     |
        | rl        | 2     |
    And the 1 result item has a "Location:" info with "Location information is not yet available"
