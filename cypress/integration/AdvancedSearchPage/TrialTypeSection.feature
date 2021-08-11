Feature: Advanced Clinical Trials Search Trial Type Section

    Scenario: User has an option to narrow down search criteria by selecting all trial types
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        And "Trial Type" form section is displayed
        And help icon is displayed in "Trial Type" section with href "/about-cancer/treatment/clinical-trials/search/help#trialtype"
        And info text "Select the type of trial for your search. You may check more than one box or select \"All\". You may choose to limit results to trials accepting healthy volunteers." is displayed in the "Trial Type" section body
        And "Healthy Volunteers" toggle is displayed with label "Limit results to Veterans Affairs facilities"
        And "Healthy Volunteers" toggle is switched to "No"
        And "All" checkbox is checked
        And user selects "Treatment" checkbox
        And user selects "Supportive Care" checkbox
        And user selects "Diagnostic" checkbox
        And user selects "Basic Science" checkbox
        And user selects "Prevention" checkbox
        And user selects "Health Services Research" checkbox
        And user selects "Screening" checkbox
        And user selects "Other" checkbox
        Then "All" checkbox is not checked
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 7292 for your search "
        And the criteria table displays the following
            | Category   | Selection                                                                                                     |
            | Trial Type | Treatment, Prevention, Supportive Care, Health Services Research, Diagnostic, Screening, Basic Science, Other |
        And the url query has the following corresponding code with duplicated keys
            | loc | 0                        |
            | rl  | 2                        |
            | tt  | treatment                |
            | tt  | prevention               |
            | tt  | supportive_care          |
            | tt  | health_services_research |
            | tt  | diagnostic               |
            | tt  | screening                |
            | tt  | basic_science            |
            | tt  | other                    |

    Scenario: User has an option to narrow down search criteria by healthy volunteers and selected trial types and then refine search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        When user toggles "Healthy Volunteers"
        And "Healthy Volunteers" toggle is switched to "Yes"
        And user selects "Treatment" checkbox
        And "All" checkbox is not checked
        When user selects "All" checkbox
        Then "Treatment" checkbox is not checked
        And user selects "Treatment" checkbox
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 66 for your search "
        And the criteria table displays the following
            | Category           | Selection                                              |
            | Healthy Volunteers | Results limited to trials accepting healthy volunteers |
            | Trial Type         | Treatment                                              |
        And the url query has the following corresponding code
            | parameter | value     |
            | loc       | 0         |
            | rl        | 2         |
            | hv        | 1         |
            | tt        | treatment |
        When user clicks on Modify Search Criteria button
        Then "Treatment" checkbox is checked
        When user toggles "Healthy Volunteers"
        And "Healthy Volunteers" toggle is switched to "No"
        Then user selects "Diagnostic" checkbox
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 5412 for your search "
        And the criteria table displays the following
            | Category   | Selection             |
            | Trial Type | Treatment, Diagnostic |
        And the url query has the following corresponding code with duplicated keys
            | loc | 0          |
            | rl  | 2          |
            | tt  | treatment  |
            | tt  | diagnostic |

    Scenario: User has an option to search by healthy volunteers and all trial types and refine search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/advanced"
        Then the page title is "Find NCI-Supported Clinical Trials"
        When user toggles "Healthy Volunteers"
        Then "Healthy Volunteers" toggle is switched to "Yes"
        And "All" checkbox is checked
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 602 for your search "
        And the criteria table displays the following
            | Category           | Selection                                              |
            | Healthy Volunteers | Results limited to trials accepting healthy volunteers |
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 2     |
            | hv        | 1     |
        When user clicks on Modify Search Criteria button
        Then "Healthy Volunteers" toggle is switched to "Yes"
        When user toggles "Healthy Volunteers"
        And "Healthy Volunteers" toggle is switched to "No"
        Then user selects "Diagnostic" checkbox
        And user selects "Treatment" checkbox
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 5412 for your search "
        And the criteria table displays the following
            | Category   | Selection             |
            | Trial Type | Treatment, Diagnostic |
        And the url query has the following corresponding code with duplicated keys
            | loc | 0          |
            | rl  | 2          |
            | tt  | treatment  |
            | tt  | diagnostic |

    Scenario: User has an option to go to search results url directly and modify search
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/r?hv=1&loc=0&rl=2&tt=treatment"
        Then the page title is "Clinical Trials Search Results"
        And trial info displays "Results 1-10  of 66 for your search "
        And the criteria table displays the following
            | Category           | Selection                                              |
            | Healthy Volunteers | Results limited to trials accepting healthy volunteers |
            | Trial Type         | Treatment                                              |
        When user clicks on Modify Search Criteria button
        Then "Treatment" checkbox is checked
        When user toggles "Healthy Volunteers"
        Then user selects "Diagnostic" checkbox
        When user clicks on "Find Trials" button
        Then the search is executed and results page is displayed
        And trial info displays "Results 1-10  of 5412 for your search "
        And the criteria table displays the following
            | Category   | Selection             |
            | Trial Type | Treatment, Diagnostic |
        And the url query has the following corresponding code with duplicated keys
            | loc | 0          |
            | rl  | 2          |
            | tt  | treatment  |
            | tt  | diagnostic |
