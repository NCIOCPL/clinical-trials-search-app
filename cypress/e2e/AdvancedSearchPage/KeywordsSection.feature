Feature: Clinical Trials Advanced Search Page

    Scenario Outline: User has an option to narrow down search criteria by keywords or phrases
        Given screen breakpoint is set to "screenBreakpoint"
        Given the user navigates to "/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Keywords/Phrases" form section is displayed
        And help icon is displayed in "Keywords" section with href "/about-cancer/treatment/clinical-trials/search/help#keywords"
        And "KeywordsPhrases" input field has a placeholder "Examples: PSA, 'Paget disease'"
        And helper text "Search by word or phrase (use quotation marks with phrases)." is displayed
        Examples:
            | screenBreakpoint |
            | desktop          |
            | tablet           |
            | mobile           |

    Scenario: User has an option to search by keywords and then modify search
        Given the user navigates to "/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Keywords/Phrases" form section is displayed
        When user types "psa" in "KeywordsPhrases" field
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 179 for your search "
        And the criteria table displays the following
            | Category         | Selection |
            | Keywords/Phrases | psa       |
        And the url query has the following corresponding code
            | parameter | value |
            | q         | psa   |
            | loc       | 0     |
            | rl        | 2     |
        When user clicks on Modify Search Criteria button
        Then "KeywordsPhrases" field has value "psa"
        When user clears "KeywordsPhrases" input field
        When user types "chronic kidney disease due to hypertension" in "KeywordsPhrases" field
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-1  of 1 for your search "
        And the criteria table displays the following
            | Category         | Selection                                  |
            | Keywords/Phrases | chronic kidney disease due to hypertension |
        And the url query has the following corresponding code
            | parameter | value                                      |
            | q         | chronic kidney disease due to hypertension |
            | loc       | 0                                          |
            | rl        | 2                                          |

    Scenario: Negative : User searches by keyword that does not exist
        Given the user navigates to "/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Keywords/Phrases" form section is displayed
        When user types "penguin" in "KeywordsPhrases" field
        When user clicks on "Find Trials" button
        Then the search is executed and no results page is displayed
        And the criteria table displays the following
            | Category         | Selection |
            | Keywords/Phrases | penguin   |
        And the url query has the following corresponding code
            | parameter | value   |
            | q         | penguin |
            | loc       | 0       |
            | rl        | 2       |

    Scenario: User has an option to go to search results url directly and modify search
        Given the user navigates to "/r?loc=0&q=chronic%20kidney%20disease%20due%20to%20hypertension&rl=2"
        Then the page title is "Clinical Trials Search Results"
        And trial info displays "Results 1-1  of 1 for your search "
        When user clicks on Modify Search Criteria button
        Then "KeywordsPhrases" field has value "chronic kidney disease due to hypertension"
        When user clears "KeywordsPhrases" input field
        When user types "psa" in "KeywordsPhrases" field
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 179 for your search "
        And the criteria table displays the following
            | Category         | Selection |
            | Keywords/Phrases | psa       |
        And the url query has the following corresponding code
            | parameter | value |
            | q         | psa   |
            | loc       | 0     |
            | rl        | 2     |

