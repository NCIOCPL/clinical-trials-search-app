Feature: As a user, I want to be able to narrow down my search by specifying a hospital


      Scenario: User has an option to limit results to Hospitals and refine search
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
        And "Limit results to Veterans Affairs facilities" toggle is switched to "No"
        When user selects "Hospitals/Institutions" radio button
        And user types "um b" in "Hospitals/Institutions" autosuggest field
        And user selects "UM Baltimore Washington Medical Center/Tate Cancer Center" from dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 29 for your search "
        And the criteria table displays the following
            | Category                | Selection                                                   |
            | At Hospital/Institution | UM Baltimore Washington Medical Center/Tate Cancer Center |
        And the url query has the following corresponding code
            | parameter | value                                                       |
            | loc       | 3                                                           |
            | rl        | 2                                                           |
            | hos       | UM Baltimore Washington Medical Center/Tate Cancer Center |
        And the 1 result item has a "Location:" info with "1382 locations"
        When user clicks on Modify Search Criteria button
        Then "Hospitals/Institutions" input field has a value "UM Baltimore Washington Medical Center/Tate Cancer Center"
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
        Given the user navigates to "/r?hos=Erlanger%20Medical%20Center&loc=3&rl=2"
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
        And user selects "UM Baltimore Washington Medical Center/Tate Cancer Center" from dropdown
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 29 for your search "
        And the criteria table displays the following
            | Category                | Selection                                                   |
            | At Hospital/Institution | UM Baltimore Washington Medical Center/Tate Cancer Center |
        And the url query has the following corresponding code
            | parameter | value                                                       |
            | loc       | 3                                                           |
            | rl        | 2                                                           |
            | hos       | UM Baltimore Washington Medical Center/Tate Cancer Center |
        And the 1 result item has a "Location:" info with "1382 locations"


    Scenario: User has an option to search for a Hospital without using autosuggest
        Given the user navigates to "/advanced"
        Then the page title is "Find Cancer Clinical Trials"
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
