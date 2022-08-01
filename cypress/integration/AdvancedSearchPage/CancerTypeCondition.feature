Feature: As a user, I want to be able to specify my search by cancer type or condition, so that more relevant results can be returned

    Scenario: User is able to search for cancer type via autosuggest
        Given the user navigates to "/advanced"
        And "Cancer Type/Condition" form section is displayed
        And help icon is displayed with href "/about-cancer/treatment/clinical-trials/search/help#cancertype"
        And info text "Select a cancer type/condition, then include subtypes, stages or other attributes, if applicable." is displayed in the "cancer-type-condition" section body
        When user clicks on "All" button
        And autocomplete dropdown is displayed
        And "CancerTypeCondition" input field has a placeholder "Start typing to narrow options below"

    Scenario: User is able to execute search for cancer type via autosuggest
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 966 for your search "
        And the criteria table displays the following
            | Category                      | Selection     |
            | Primary Cancer Type/Condition | Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value |
            | t         | C4872 |
            | loc       | 0     |
            | rl        | 2     |

    Scenario: User searches for a cancer type, modifies primary cancer type it and searches again
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 966 for your search "
        And the criteria table displays the following
            | Category                      | Selection     |
            | Primary Cancer Type/Condition | Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value |
            | t         | C4872 |
            | loc       | 0     |
            | rl        | 2     |
        When user clicks on Modify Search Criteria button
        When user clicks on "Breast Cancer" button
        And user types "adrenal cortex" in "CancerTypeCondition" field
        And user selects "Adrenal Cortex Cancer" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 14 for your search "
        And the criteria table displays the following
            | Category                      | Selection             |
            | Primary Cancer Type/Condition | Adrenal Cortex Cancer |
        And the url query has the following corresponding code
            | parameter | value |
            | t         | C9325 |
            | loc       | 0     |
            | rl        | 2     |

    Scenario: After selecting cancer type, Subtype, Stage, Side Effects fields appear
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        And "Subtype" input field has a placeholder "Start typing to select a subtype"
        And "Subtype" input field has helper text "More than one selection may be made."
        And "Stage" input field has a placeholder "Start typing to select a stage"
        And "Stage" input field has helper text "More than one selection may be made."
        And "SideEffects" input field has a placeholder "Examples: Nausea, BRCA1"
        And "SideEffects" input field has helper text "More than one selection may be made."

    Scenario: User is able to execute search for Cancer type and subtype
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        Then "Subtype" input field has a placeholder "Start typing to select a subtype"
        And user types "Bilateral Breast Cancer" in "Subtype" field
        And user selects "Bilateral Breast Cancer" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 12 for your search "
        And the criteria table displays the following
            | Category                      | Selection               |
            | Primary Cancer Type/Condition | Breast Cancer           |
            | Subtype                       | Bilateral Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value |
            | t         | C4872 |
            | loc       | 0     |
            | rl        | 2     |
            | st        | C8287 |

    Scenario: User is able to execute search for Cancer type, subtype and stage
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        Then "Subtype" input field has a placeholder "Start typing to select a subtype"
        When user types "Bilateral Breast Cancer" in "Subtype" field
        And user selects "Bilateral Breast Cancer" from dropdown
        And user types "Early-Stage Breast Cancer" in "Stage" field
        And user selects "Early-Stage Breast Cancer" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-1  of 1 for your search "
        And the criteria table displays the following
            | Category                      | Selection                 |
            | Primary Cancer Type/Condition | Breast Cancer             |
            | Subtype                       | Bilateral Breast Cancer   |
            | Stage                         | Early-Stage Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value  |
            | t         | C4872  |
            | loc       | 0      |
            | rl        | 2      |
            | st        | C8287  |
            | stg       | C94774 |

    Scenario: User is able to execute search for Cancer type, subtype, stage and side effects
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        Then "Subtype" input field has a placeholder "Start typing to select a subtype"
        When user types "Bilateral Breast Cancer" in "Subtype" field
        And user selects "Bilateral Breast Cancer" from dropdown
        And user types "Early-Stage Breast Cancer" in "Stage" field
        And user selects "Early-Stage Breast Cancer" from dropdown
        And user types "Cancer Survivor" in "SideEffects" field
        And user selects "Cancer Survivor" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and no results page is displayed
        And the criteria table displays the following
            | Category                                           | Selection                 |
            | Primary Cancer Type/Condition                      | Breast Cancer             |
            | Subtype                                            | Bilateral Breast Cancer   |
            | Stage                                              | Early-Stage Breast Cancer |
            | Side Effects / Biomarkers / Participant Attributes | Cancer Survivor           |
        And the url query has the following corresponding code
            | parameter | value  |
            | t         | C4872  |
            | loc       | 0      |
            | rl        | 2      |
            | st        | C8287  |
            | stg       | C94774 |
            | fin       | C18673 |

    Scenario: User is able to execute search with specific subtype then modify search and get expected results again
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        Then "Subtype" input field has a placeholder "Start typing to select a subtype"
        When user types "Bilateral Breast Cancer" in "Subtype" field
        And user selects "Bilateral Breast Cancer" from dropdown
        When user types "Advanced Breast Carcinoma" in "Subtype" field
        And user selects "Advanced Breast Carcinoma" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 127 for your search "
        And the criteria table displays the following
            | Category                      | Selection                                          |
            | Primary Cancer Type/Condition | Breast Cancer                                      |
            | Subtype                       | Bilateral Breast Cancer, Advanced Breast Carcinoma |
        And the url query has the following corresponding code with duplicated keys
            | loc | 0       |
            | rl  | 2       |
            | st  | C8287   |
            | st  | C162648 |
            | t   | C4872   |
        When user clicks on Modify Search Criteria button
        Then "Subtype" field has the following types selected
            | selected                  |
            | Bilateral Breast Cancer   |
            | Advanced Breast Carcinoma |
        When user removes "Advanced Breast Carcinoma" from the "Subtype" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 12 for your search "
        And the criteria table displays the following
            | Category                      | Selection               |
            | Primary Cancer Type/Condition | Breast Cancer           |
            | Subtype                       | Bilateral Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 2     |
            | st        | C8287 |
            | t         | C4872 |

    Scenario: User is able to execute search with specific stage then modify search and get expected results again
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        Then "Stage" input field has a placeholder "Start typing to select a stage"
        And user types "Early-Stage Breast Cancer" in "Stage" field
        And user selects "Early-Stage Breast Cancer" from dropdown
        And user types "Recurrent Breast Cancer" in "Stage" field
        And user selects "Recurrent Breast Cancer" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 167 for your search "
        And the criteria table displays the following
            | Category                      | Selection                                          |
            | Primary Cancer Type/Condition | Breast Cancer                                      |
            | Stage                         | Early-Stage Breast Cancer, Recurrent Breast Cancer |
        And the url query has the following corresponding code with duplicated keys
            | loc | 0      |
            | rl  | 2      |
            | stg | C94774 |
            | stg | C7771  |
            | t   | C4872  |
        When user clicks on Modify Search Criteria button
        Then "Stage" field has the following types selected
            | selected                  |
            | Early-Stage Breast Cancer |
            | Recurrent Breast Cancer   |
        When user removes "Recurrent Breast Cancer" from the "Stage" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 27 for your search "
        And the criteria table displays the following
            | Category                      | Selection                 |
            | Primary Cancer Type/Condition | Breast Cancer             |
            | Stage                         | Early-Stage Breast Cancer |
        And the url query has the following corresponding code
            | parameter | value  |
            | loc       | 0      |
            | rl        | 2      |
            | stg       | C94774 |
            | t         | C4872  |



    Scenario: User is able to execute search with specific side effects then modify search and get expected results again
        Given the user navigates to "/advanced"
        When user clicks on "All" button
        And user types "breast cancer" in "CancerTypeCondition" field
        And user selects "Breast Cancer" from dropdown
        Then "Stage" input field has a placeholder "Start typing to select a stage"
        And user types "Cancer Survivor" in "SideEffects" field
        And user selects "Cancer Survivor" from dropdown
        And user types "Endocervical Cancer" in "SideEffects" field
        And user selects "Endocervical Cancer" from dropdown
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-1  of 1 for your search "
        And the criteria table displays the following
            | Category                                           | Selection                            |
            | Primary Cancer Type/Condition                      | Breast Cancer                        |
            | Side Effects / Biomarkers / Participant Attributes | Cancer Survivor, Endocervical Cancer |
        And the url query has the following corresponding code with duplicated keys
            | fin | C18673 |
            | fin | C28327 |
            | loc | 0      |
            | rl  | 2      |
            | t   | C4872  |
        When user clicks on Modify Search Criteria button
        Then "SideEffects" field has the following types selected
            | selected            |
            | Cancer Survivor     |
            | Endocervical Cancer |
        When user removes "Endocervical Cancer" from the "SideEffects" field
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-2  of 2 for your search "
        And the criteria table displays the following
            | Category                                           | Selection       |
            | Primary Cancer Type/Condition                      | Breast Cancer   |
            | Side Effects / Biomarkers / Participant Attributes | Cancer Survivor |
        And the url query has the following corresponding code
            | parameter | value  |
            | fin       | C18673 |
            | loc       | 0      |
            | rl        | 2      |
            | t         | C4872  |

    Scenario: User is able to refine search results brought up from basic form
        Given the user navigates to "/r?loc=0&rl=1&t=C2924"
        And the criteria table displays the following
            | Category                      | Selection                       |
            | Primary Cancer Type/Condition | Ductal Carcinoma In Situ (DCIS) |
        When user clicks on Modify Search Criteria button
        Then "Subtype" field has the following types selected
            | selected                        |
            | Ductal Carcinoma In Situ (DCIS) |
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 66 for your search "
        And the criteria table displays the following
            | Category                      | Selection                       |
            | Primary Cancer Type/Condition | Breast Cancer                   |
            | Subtype                       | Ductal Carcinoma In Situ (DCIS) |
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 2     |
            | st        | C2924 |
            | t         | C4872 |

    Scenario: User is able to refine search results brought up from basic form searching for stage
        Given the user navigates to "/r?loc=0&rl=1&t=C140421%7CC7898"
        And trial info displayes "Results 1-10  of 99 for your search "
        And the criteria table displays the following
            | Category                      | Selection                |
            | Primary Cancer Type/Condition | Stage III Bladder Cancer |
        When user clicks on Modify Search Criteria button
        Then "Stage" field has the following types selected
            | selected                 |
            | Stage III Bladder Cancer |
        And user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displayes "Results 1-10  of 99 for your search "
        And the criteria table displays the following
            | Category                      | Selection                |
            | Primary Cancer Type/Condition | Bladder Cancer           |
            | Stage                         | Stage III Bladder Cancer |
        And the url query has the following corresponding code
            | parameter | value          |
            | loc       | 0              |
            | rl        | 2              |
            | stg       | C140421\|C7898 |
            | t         | C4912          |
        When user clicks on Modify Search Criteria button
        Then "Stage" field has the following types selected
            | selected                 |
            | Stage III Bladder Cancer |
