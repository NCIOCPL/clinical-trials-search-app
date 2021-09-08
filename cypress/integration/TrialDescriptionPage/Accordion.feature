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

  Scenario: as a user I want to see locations that are near me based on my search criteria
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2020-08103&loc=1&rl=2&va=1&z=20165&zp=200"
    Then the page title is "Testing the Use of Targeted Treatment (AMG 510) for KRAS G12C Mutated Advanced Non-squamous Non-small Cell Lung Cancer (A Lung-MAP Treatment Trial)"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    And button "Show all locations" is displayed
    When user clicks on "Show all locations" button
    Then button "Show locations near me" is displayed
    Then alphabetically sorted list appears
    And "All" option is selected
    When user clicks on "Show locations near me" button
    And text "Locations matching your search criteria" is displayed
    And the matched location "country" is "United States"
    And the matched location "state" is "Virginia"
    And the matched location "city" is "Richmond"
    And the matched location displays the following information
      | Hunter Holmes McGuire Veterans Administration Medical Center |
      | Status: Temporarily closed to accrual                        |
      | Contact: Site Public Contact                                 |
      | Phone: 804-675-5646                                          |
      | Email: Regina.McClung@va.gov                                 |
    When user clicks on "Show all locations" button
    Then button "Show locations near me" is displayed
    Then alphabetically sorted list appears
    And "All" option is selected


  Scenario: as a user I want to see locations that are near me based on my search criteria and select a different country if available
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-02057&lcnty=United%20States&loc=2&lst=AL&rl=2"
    Then the page title is "Project: Every Child for Younger Patients with Cancer"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    And text "Locations matching your search criteria" is displayed
    When user clicks on "Show all locations" button
    Then button "Show locations near me" is displayed
    Then alphabetically sorted list of countries appears
    Then alphabetically sorted list of states appears
    When user selects "Canada" from countries list
    And the filtered by country location number 1 displays the following information
      | Calgary                          |
      | Alberta Children's Hospital      |
      | Status: Active                   |
      | Contact: Site Public Contact     |
      | Phone: 403-220-6898              |
      | Email: research4kids@ucalgary.ca |

  Scenario: as a user I want to see locations that are near me based on my search criteria and select OTHER  country when available
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-02057&lcnty=United%20States&loc=2&lst=AL&rl=2"
    Then the page title is "Project: Every Child for Younger Patients with Cancer"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    And text "Locations matching your search criteria" is displayed
    When user clicks on "Show all locations" button
    Then button "Show locations near me" is displayed
    Then alphabetically sorted list of countries appears
    Then alphabetically sorted list of states appears
    When user selects "Other" from countries list
    And the filtered by country location number 1 displays the following information
      | Clayton                              |
      | Monash Medical Center-Clayton Campus |
      | Status: Active                       |
      | Contact: Site Public Contact         |
      | Phone: (03) 9928 8111                |



  Scenario: as a user I wont be able to see locations near me if the state provided is no longer hosting that trial, but I still can see all locations
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2014-02057&lcnty=United%20States&loc=2&lst=WY&rl=2"
    Then the page title is "Project: Every Child for Younger Patients with Cancer"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    Then button "Show locations near me" is not displayed
    And button "Show all locations" is not displayed
    Then alphabetically sorted list of countries appears
    Then alphabetically sorted list of states appears

  Scenario: as a user I want to see locations that are located at NIH only
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2015-00054&loc=4&rl=2"
    Then the page title is "Targeted Therapy Directed by Genetic Testing in Treating Patients with Advanced Refractory Solid Tumors, Lymphomas, or Multiple Myeloma (The MATCH Screening Trial)"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    And button "Show all locations" is displayed
    And text "Locations matching your search criteria" is displayed
    And the matched location "country" is "United States"
    And the matched location "state" is "Maryland"
    And the matched location "city" is "Bethesda"
    And the matched location displays the following information
      | National Institutes of Health Clinical Center |
      | Status: Active                                |
      | Contact: Site Public Contact                  |
      | Phone: 800-411-1222                           |
    When user clicks on "Show all locations" button
    Then button "Show locations near me" is displayed
    Then alphabetically sorted list appears
    And "All" option is selected

  Scenario: as a user I want to see locations that are near me when I searched for all trials filtered by veterans affairs only
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2018-01615&loc=0&rl=2&va=1"
    Then the page title is "Biomarker Analysis in Samples Collected during Bronchoscopy in Patients with Dysplasia"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    And button "Show all locations" is not displayed
    And text "Locations matching your search criteria" is displayed
    And the matched location "country" is "United States"
    And the matched location "state" is "Colorado"
    And the matched location "city" is "Aurora"
    And the matched location displays the following information
      | Rocky Mountain Regional VA Medical Center |
      | Status: Active                            |
      | Contact: York E. Miller                   |
      | Phone: 720-723-6429                       |

  Scenario: as a user I can filter location by state
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?a=40&id=NCI-2014-01507&loc=0&rl=2"
    Then the page title is "Crizotinib in Treating Patients with Stage IB-IIIA Non-small Cell Lung Cancer That Has Been Removed by Surgery and ALK Fusion Mutations (An ALCHEMIST Treatment Trial)"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    Then alphabetically sorted list appears
    And "All" option is selected
    When user selects "Wyoming" from the state dropdown list
    And the filtered by state location number 1 displays the following information
      | Cheyenne                              |
      | Cheyenne Regional Medical Center-West |
      | Status: Active                        |
      | Contact: Site Public Contact          |
      | Phone: 303-777-2663                   |
      | Email: ccrp@co-cancerresearch.org     |
    And the filtered by state location number 2 displays the following information
      | Cody                               |
      | Billings Clinic-Cody               |
      | Status: Active                     |
      | Contact: Site Public Contact       |
      | Phone: 800-996-2663                |
      | Email: research@billingsclinic.org |
    And the filtered by state location number 3 displays the following information
      | Sheridan                     |
      | Welch Cancer Center          |
      | Status: Active               |
      | Contact: Site Public Contact |
      | Phone: 406-969-6060          |
      | Email: mccinfo@mtcancer.org  |
    When user selects "All" from the state dropdown list
    And all locations in "United States" are displayed

  Scenario: as a user I will be offered to visit clinicaltrials.gov to explore locations if they are not finalized yet for a trial
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2015-00045&loc=0&rl=2"
    Then the page title is "A Single-arm Safety Study of Transplantation Using Umbilical Cord Blood and Human Placental-derived Stem Cells From Partially Matched Related Donors in Persons With Certain Malignant Blood Diseases and Non-malignant Disorders"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    Then text "See trial information on ClinicalTrials.gov for a list of participating sites." is displayed
    And "ClinicalTrials.gov" link has a href "https://www.clinicaltrials.gov/show/NCT00596999"

  Scenario: as a user I will not see locations if I searched for a trial in a country that does not exist/host that trial
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search/v?id=NCI-2018-01903&lcnty=zimbabue&loc=2&rl=2"
    Then the page title is "Standard Chemotherapy and Radiation Therapy with or without Paclitaxel and Carboplatin in Treating HIV-Positive Women with Locally Advanced Cervical Cancer"
    And trial description accordion is displayed
    When user clicks on "Locations & Contacts" section of accordion
    Then the location section is empty

