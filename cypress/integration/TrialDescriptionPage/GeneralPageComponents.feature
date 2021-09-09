Feature:  As a user, I want to be able to view trial description page with all its components

    Scenario: User is able to navigate to trial description page from all trials search results page
        Given screen breakpoint is set to "desktop"
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/r?loc=0&rl=2"
        Then the page title is "Clinical Trials Search Results"
        When user clicks on 1 trial result
        Then the page title is "Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence"
        And "< Back to search results" button as link is displayed
        And "This clinical trial matches: \"all trials\"" appears below the title
        And search criteria table is not displayed
        And the url query has the following corresponding code
            | parameter | value          |
            | loc       | 0              |
            | rl        | 2              |
            | id        | NCI-2015-01918 |
        And "Start Over" link has a href "/about-cancer/treatment/clinical-trials/search/advanced"
        And trial status is "active"
        And button "Open all" is displayed
        And button "Close all" is displayed
        And button "Print" is displayed
        And button "Email" is displayed
        And the following delighters are displayed
            | delighter    | href                                                       | title                              | text                                                                  |
            | cts-livehelp | /contact                                                   | Have a question?We're here to help | Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
            | cts-which    | /about-cancer/treatment/clinical-trials/search/trial-guide | Which trials are right for you?    | Use the checklist in our guide to gather the information you’ll need. |
        And the title tag should be "Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence"
        And the page contains meta tags with the following names
            | name        | content                                                                                                          |
            | description | Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence |
        And the page contains meta tags with the following properties
            | property       | content                                                                                                                        |
            | og:title       | Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence               |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI-2015-01918                                       |
            | og:description | Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence - NCT02750826 |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI-2015-01918"


    Scenario Outline: User is able to see the trial description on mobile and tablet by directly navigating to trial url
        Given screen breakpoint is set to "<breakpoint>"
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=2"
        Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And "< Back to search results" button as link is displayed
        And "This clinical trial matches:" appears below the title
        When user clicks on "Show Search Criteria" button
        Then button "Hide Search Criteria" is displayed
        And button "Show Search Criteria" is hidden
        When user clicks on "Hide Search Criteria" button
        Then button "Hide Search Criteria" is hidden
        And the criteria table displays the following
            | Category | Selection |
            | Age      | 40        |
        And "Start Over" link has a href "/about-cancer/treatment/clinical-trials/search/advanced"
        And trial status is "active"
        And button "Open all" is displayed
        And button "Close all" is displayed
        And button "Print" is not displayed
        And button "Email" is displayed
        And the following delighters are displayed
            | delighter    | href                                                       | title                              | text                                                                  |
            | cts-livehelp | /contact                                                   | Have a question?We're here to help | Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
            | cts-which    | /about-cancer/treatment/clinical-trials/search/trial-guide | Which trials are right for you?    | Use the checklist in our guide to gather the information you’ll need. |
        And the title tag should be "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And the page contains meta tags with the following names
            | name        | content                                                                                                                                                                |
            | description | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial) |
        And the page contains meta tags with the following properties
            | property       | content                                                                                                                                                                              |
            | og:title       | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)               |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-01507                                                                                             |
            | og:description | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial) - NCT02201992 |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-01507"
        Examples:
            | breakpoint |
            | mobile     |
            | tablet     |

    Scenario: User is able to navigate to trial description page directly without being on a searh
        Given screen breakpoint is set to "desktop"
        And the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-01507"
        Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And back to search results link does not exist
        And "This clinical trial matches:" does not appear below the title
        And search criteria table is not displayed
        And the url query has the following corresponding code
            | parameter | value          |
            | id        | NCI-2014-01507 |
        And "Start Over" link does not exist
        And trial status is "active"
        And button "Open all" is displayed
        And button "Close all" is displayed
        And button "Print" is displayed
        And button "Email" is displayed
        And the following delighters are displayed
            | delighter    | href                                                       | title                              | text                                                                  |
            | cts-livehelp | /contact                                                   | Have a question?We're here to help | Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
            | cts-which    | /about-cancer/treatment/clinical-trials/search/trial-guide | Which trials are right for you?    | Use the checklist in our guide to gather the information you’ll need. |
        And the title tag should be "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And the page contains meta tags with the following names
            | name        | content                                                                                                                                                                |
            | description | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial) |
        And the page contains meta tags with the following properties
            | property       | content                                                                                                                                                                              |
            | og:title       | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)               |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-01507                                                                                             |
            | og:description | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial) - NCT02201992 |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-01507"

    Scenario: User is able to navigate to trial description page directly without being on a searh using NCT id
        Given screen breakpoint is set to "mobile"
        And the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCT02201992"
        Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And back to search results link does not exist
        And "This clinical trial matches:" does not appear below the title
        And search criteria table is not displayed
        And the url query has the following corresponding code
            | parameter | value       |
            | id        | NCT02201992 |
        And "Start Over" link does not exist
        And trial status is "active"
        And button "Open all" is displayed
        And button "Close all" is displayed
        And button "Print" is not displayed
        And button "Email" is displayed
        And the following delighters are displayed
            | delighter    | href                                                       | title                              | text                                                                  |
            | cts-livehelp | /contact                                                   | Have a question?We're here to help | Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
            | cts-which    | /about-cancer/treatment/clinical-trials/search/trial-guide | Which trials are right for you?    | Use the checklist in our guide to gather the information you’ll need. |
        And the title tag should be "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And the page contains meta tags with the following names
            | name        | content                                                                                                                                                                |
            | description | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial) |
        And the page contains meta tags with the following properties
            | property       | content                                                                                                                                                                              |
            | og:title       | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)               |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCT02201992                                                                                                |
            | og:description | Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial) - NCT02201992 |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCT02201992"


    Scenario: User is able to navigate back to the search results page
        Given screen breakpoint is set to "desktop"
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/r?loc=0&rl=2"
        Then the page title is "Clinical Trials Search Results"
        And the title tag should be "Clinical Trials Search Results - National Cancer Institute"
        And the page contains meta tags with the following names
            | name        | content                                               |
            | description | Find an NCI-supported clinical trial - Search results |
        And the page contains meta tags with the following properties
            | property       | content                                                                           |
            | og:title       | Clinical Trials Search Results                                                    |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?loc=0&rl=2 |
            | og:description | Find an NCI-supported clinical trial - Search results                             |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?loc=0&rl=2"
        When user clicks on 1 trial result
        Then the page title is "Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence"
        And the url query has the following corresponding code
            | parameter | value          |
            | loc       | 0              |
            | rl        | 2              |
            | id        | NCI-2015-01918 |
        And "< Back to search results" button as link is displayed
        When user clicks on "< Back to search results" button as link
        Then the page title is "Clinical Trials Search Results"
        And search criteria table is not displayed
        And the url query has the following corresponding code
            | parameter | value |
            | loc       | 0     |
            | rl        | 2     |
        And the title tag should be "Clinical Trials Search Results - National Cancer Institute"
        And the page contains meta tags with the following names
            | name        | content                                               |
            | description | Find an NCI-supported clinical trial - Search results |
        And the page contains meta tags with the following properties
            | property       | content                                                                           |
            | og:title       | Clinical Trials Search Results                                                    |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?loc=0&rl=2 |
            | og:description | Find an NCI-supported clinical trial - Search results                             |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?loc=0&rl=2"

    Scenario: User is able to start over his/her search on an advanced search form page
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=2"
        Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And "This clinical trial matches:" appears below the title
        And the criteria table displays the following
            | Category | Selection |
            | Age      | 40        |
        And "Start Over" link has a href "/about-cancer/treatment/clinical-trials/search/advanced"
        When user clicks on "Start Over" link
        Then the page title is "Find NCI-Supported Clinical Trials"
        And the url is "/about-cancer/treatment/clinical-trials/search/advanced"
        And the title tag should be "Find NCI-Supported Clinical Trials - Advanced Search - National Cancer Institute"
        And the page contains meta tags with the following names
            | name        | content                                                                                                                                                  |
            | description | Use our advanced search to find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
        And the page contains meta tags with the following properties
            | property       | content                                                                                                                                                  |
            | og:title       | Find NCI-Supported Clinical Trials - Advanced Search                                                                                                     |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/advanced                                                                            |
            | og:description | Use our advanced search to find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/advanced"

    Scenario: User is able to start over his/her search on basic search form page
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=1"
        Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And "This clinical trial matches:" appears below the title
        And the criteria table displays the following
            | Category | Selection |
            | Age      | 40        |
        And "Start Over" link has a href "/about-cancer/treatment/clinical-trials/search/"
        When user clicks on "Start Over" link
        Then the page title is "Find NCI-Supported Clinical Trials"
        And the url is "/about-cancer/treatment/clinical-trials/search/"
        And the title tag should be "Find NCI-Supported Clinical Trials - National Cancer Institute"
        And the page contains meta tags with the following names
            | name        | content                                                                                                                       |
            | description | Find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
        And the page contains meta tags with the following properties
            | property       | content                                                                                                                       |
            | og:title       | Find NCI-Supported Clinical Trials                                                                                            |
            | og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search                                                          |
            | og:description | Find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
        And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search"

    Scenario: User is able to to print trial info
        Given screen breakpoint is set to "desktop"
        Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=1"
        Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
        And "This clinical trial matches:" appears below the title
        And the criteria table displays the following
            | Category | Selection |
            | Age      | 40        |
        When user clicks on Print button
        Then print window opens

#this should be enabled by https://github.com/NCIOCPL/clinical-trials-search-app/issues/297
# Scenario: User is able to to email trial info
# Given screen breakpoint is set to "desktop"
# Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=1"
# Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
# And "This clinical trial matches:" appears below the title
# And the criteria table displays the following
#     | Category | Selection |
#     | Age      | 40        |
# When user clicks on Email button
# Then the request is being sent with the following parameters
# |parameters|
