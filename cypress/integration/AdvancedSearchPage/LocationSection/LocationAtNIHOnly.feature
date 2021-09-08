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

    Scenario: User has an option to navigate directly to a url which shows trials at NIH only
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/r?loc=4&rl=2"
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 283 for your search "
        And search criteria table is not displayed
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 4     |
            | rl        | 2     |
        And the 1 result item has a "Location:" info with "Location information is not yet available"