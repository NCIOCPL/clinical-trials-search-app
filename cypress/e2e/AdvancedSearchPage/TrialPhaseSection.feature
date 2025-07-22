Feature: Advanced Clinical Trials Search Trial Phase Section

    Scenario: User has an option to narrow down search criteria by trial phase
        Given the user navigates to "/advanced"
        Then the page title is "Find Clinical Trials"
        And "Trial Phase" form section is displayed
        And help icon is displayed in "Trial Phase" section with href "/research/participate/clinical-trials-search/help#trialphase"
        And info text "Select the trial phases for your search. You may check more than one box or select \"All\"." is displayed in the section body
        And the following checkboxes are displayed
            | label     | value  |
            | All       | tp_all |
            | Phase I   | tp_i   |
            | Phase II  | tp_ii  |
            | Phase III | tp_iii |
            | Phase IV  | tp_iv  |

    Scenario: User has an option to narrow down search criteria by selecting trial phase
        Given the user navigates to "/advanced"
        Then the page title is "Find Clinical Trials"
        And "Trial Phase" form section is displayed
        And user checks "Phase I" checkbox
        Then the checkbox "Phase I" is checked
        When user checks "All" checkbox
        Then the checkbox "Phase I" is not checked
        And user checks "Phase I" checkbox
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 2470 for your search "
        And the criteria table displays the following
            | Category    | Selection |
            | Trial Phase | Phase I   |
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 2     |
            | tp        | i     |
        When user clicks on Modify Search Criteria button
        Then the checkbox "Phase I" is checked
        Then user checks "Phase II" checkbox
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 4715 for your search "
        And the criteria table displays the following
            | Category    | Selection         |
            | Trial Phase | Phase I, Phase II |
        And the url query has the following corresponding code with duplicated keys
            | loc | 0  |
            | rl  | 2  |
            | tp  | i  |
            | tp  | ii |

    Scenario: User has an option to go to search results url directly and modify search
        Given the user navigates to "/r?loc=0&rl=2&tp=i"
        Then the page title is "Clinical Trials Search Results"
        And trial info displayes "Results 1-10  of 2470 for your search "
        And the criteria table displays the following
            | Category    | Selection |
            | Trial Phase | Phase I   |
        When user clicks on Modify Search Criteria button
        Then the checkbox "Phase I" is checked
