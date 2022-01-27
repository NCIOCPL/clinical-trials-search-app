Feature: As a user, I want to be able to use autocomplete features to it's full extent

    Scenario: as a user, I should be able to select terms and start the search by using key from keyboard
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search"
        When user clicks on "Cancer Type/Keyword" field
        Then autocomplete dropdown is displayed
        When user types "Breast Cancer" in "Cancer Type/Keyword" field
        And user presses "down Arrow" key in "Cancer Type/Keyword" field to select "Bilateral Breast Cancer"
        And user presses "enter" key from "Cancer Type/Keyword" field
        Then "Cancer Type/Keyword" input field has a value "Bilateral Breast Cancer"
        When user presses "enter" key from "Cancer Type/Keyword" field
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 11 for your search "
        And the criteria table displays the following
            | Category                      | Selection               |
            | Primary Cancer Type/Condition | Bilateral Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value |
            | t         | C8287 |
            | loc       | 0     |
            | rl        | 1     |

    Scenario: as a user, I should be able to move to abother field with pressing tab
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search"
        When user clicks on "Cancer Type/Keyword" field
        Then autocomplete dropdown is displayed
        When user types "breast cancer" in "Cancer Type/Keyword" field
        And user presses "enter" key from "Cancer Type/Keyword" field
        Then "Cancer Type/Keyword" input field has a value "Breast Cancer"
        When user presses "tab" key from "Cancer Type/Keyword" field
        When user presses "tab" key from "Cancer Type/Keyword" field
        And user types "40" in "Age" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And the criteria table displays the following
            | Category                      | Selection     |
            | Primary Cancer Type/Condition | Breast Cancer |
            | Age                           | 40            |
        And trial info displays "Results 1-10  of 894 for your search "
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 1     |
            | t         | C4872 |
            | a         | 40    |

    Scenario: as a user, I should be able to search without using mouse
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search"
        When user clicks on "Cancer Type/Keyword" field
        Then autocomplete dropdown is displayed
        When user types "aids" in "Cancer Type/Keyword" field
        When user presses "esc" key from "Cancer Type/Keyword" field
        Then "Cancer Type/Keyword" input field has a value "aids"
        When user presses "tab" key from "Cancer Type/Keyword" field
        When user presses "tab" key from "Cancer Type/Keyword" field
        And user types "30" in "Age" field
        When user presses "tab" key from "Cancer Type/Keyword" field
        When user presses "tab" key from "Cancer Type/Keyword" field
        When user types "22182" in "U.S. Zip Code" field
        And user presses "enter" key from "U.S. Zip Code" field
        Then trial info displays "Results 1-10  of 17 for your search "
        And the criteria table displays the following
            | Category         | Selection |
            | Keywords/Phrases | aids      |
            | Age              | 30        |
            | Near ZIP Code    | 22182     |
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 1     |
            | rl        | 1     |
            | q         | aids  |
            | a         | 30    |
            | z         | 22182 |

    Scenario: as a user, I should be able to search for a keyword without selecting a term
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search"
        When user clicks on "Cancer Type/Keyword" field
        Then autocomplete dropdown is displayed
        When user types "bre" in "Cancer Type/Keyword" field
        When user presses "enter" key from "Cancer Type/Keyword" field
        Then "No clinical trials matched your search." no trial info is displayed
        And the criteria table displays the following
            | Category         | Selection |
            | Keywords/Phrases | bre       |
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 1     |
            | q         | bre   |

    Scenario: as a user, I should be able to touch screen to select item
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search"
        When user types "breast cancer" in "Cancer Type/Keyword" field
        When user selects "Bilateral Breast Cancer" by touching the menu
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 11 for your search "
        And the criteria table displays the following
            | Category                      | Selection               |
            | Primary Cancer Type/Condition | Bilateral Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value |
            | t         | C8287 |
            | loc       | 0     |
            | rl        | 1     |
