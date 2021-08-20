Feature: As a user, I want to be able to get even more details about the trial via the accordion styled sections

  Scenario: User is able to see the trial description via the accordion
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=2"
    Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
    And trial description accordion is displayed
    And the following accordion sections are displayed
      | section                      | ariaExpanded |
      | Description                  | true         |
      | Eligibility Criteria         | false        |
      | Locations & Contacts         | false        |
      | Trial Objectives and Outline | false        |
      | Trial Phase & Type           | false        |
      | Lead Organization            | false        |
      | Trial IDs                    | false        |
    When user clicks on "Open all" button
    Then the following accordion sections are displayed
      | section                      | ariaExpanded |
      | Description                  | true         |
      | Eligibility Criteria         | true         |
      | Locations & Contacts         | true         |
      | Trial Objectives and Outline | true         |
      | Trial Phase & Type           | true         |
      | Lead Organization            | true         |
      | Trial IDs                    | true         |
    When user clicks on "Close all" button
    Then the following accordion sections are displayed
      | section                      | ariaExpanded |
      | Description                  | false        |
      | Eligibility Criteria         | false        |
      | Locations & Contacts         | false        |
      | Trial Objectives and Outline | false        |
      | Trial Phase & Type           | false        |
      | Lead Organization            | false        |
      | Trial IDs                    | false        |

  Scenario: user is able to get more information from sections of accordion
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=2"
    Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    And the following accordion sections are displayed
      | section              | ariaExpanded |
      | Locations & Contacts | true         |
    Then alphabetically sorted list appears
    And "All" option is selected
    When user clicks on "Trial IDs" section of accordion
    And the following accordion sections are displayed
      | section   | ariaExpanded |
      | Trial IDs | true         |
    And trial ids are displayed in the following format
      | id                    |
      | Primary ID            |
      | Secondary IDs         |
      | ClinicalTrials.gov ID |
    And "NCT02201992" link has a href "http://clinicaltrials.gov/show/NCT02201992"

  Scenario: user is able to see trial's location that is near searched zipcode
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-01507&loc=1&rl=1&z=22182"
    Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    And the following accordion sections are displayed
      | section              | ariaExpanded |
      | Locations & Contacts | true         |
    When user clicks on "Locations & Contacts" section of accordion
    And the following accordion sections are displayed
      | section              | ariaExpanded |
      | Locations & Contacts | false        |
    When user clicks on "Locations & Contacts" section of accordion
    And button "Show all locations" is displayed
    And text "Locations matching your search criteria" is displayed
    When user clicks on "Show all locations" button
    Then button "Show locations near me" is displayed
    Then alphabetically sorted list appears
    And "All" option is selected