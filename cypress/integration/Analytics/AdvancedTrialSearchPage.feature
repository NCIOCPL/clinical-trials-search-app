Feature: Clinical Trials Search Page - Advanced

   Scenario: Page Load Analytics fires when a user views an Advanced Search form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/advanced"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    Then there should be an analytics event with the following details
        | key                                  | value                                                                            |
        | type                                 | PageLoad                                                                         |
        | event                                | ClinicalTrialsSearchApp:Load:AdvancedSearch                                      |
        | page.name                            | www.cancer.gov/advanced            																							|
        | page.title                           | Find NCI-Supported Clinical Trials - Advanced Search                             |
        | page.metaTitle                       | Find NCI-Supported Clinical Trials - Advanced Search - National Cancer Institute |
        | page.language                        | english                                                                          |
        | page.type                            | nciAppModulePage                                                                 |
        | page.channel                         | About Cancer                                                                     |
        | page.contentGroup                    | Clinical Trials                                                                  |
        | page.publishedDate                   | 02/02/2011                                                                       |
        | page.additionalDetails.analyticsName | Clinical Trials                                                                  |
        | page.additionalDetails.formType      | advanced                                                                         |

  Scenario: Click event fires when user starts typing in Primary Cancer Type/Condition field
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/advanced"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user clicks on "All" button
    And user types "c" in "CancerTypeCondition" field
    Then there should be an analytics event with the following details
        | key                | value                                              |
        | type               | Other                                              |
        | event              | ClinicalTrialsSearchApp:Other:FormInteractionStart |
        | linkName           | formAnalysis\|clinicaltrials_advanced\|start       |
        | data.analyticsName | Clinical Trials                                    |
        | data.formType      | advanced                                           |
        | data.field         | ct-searchTerm                                      |



  Scenario: Click event fires when user clicks on search result item from Advanced Search results page
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?loc=0&rl=2"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    When user clicks on 1 trial result
    Then there should be an analytics event with the following details
      | key                  | value                                         |
      | type                 | Other                                         |
      | event                | ClinicalTrialsSearchApp:Other:ResultsListItem |
      | linkName             | UnknownLinkName                               |
      | data.analyticsName   | Clinical Trials                               |
      | data.formType        | advanced                                      |
      | data.pageNum         | (int)1                                        |
      | data.resultsPosition | (int)1                                        |

  Scenario: Page Load event fires when user fills out Cancer Type Condition fields on Advanced Form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?loc=0&rl=2&stg=C94774&t=C4872"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                                   | value                                                          |
      | type                                                  | PageLoad                                                       |
      | event                                                 | ClinicalTrialsSearchApp:Load:Results                           |
      | page.name                                             | www.cancer.gov/r 																							 |
      | page.title                                            | Clinical Trials Search Results                                 |
      | page.metaTitle                                        | Clinical Trials Search Results - National Cancer Institute     |
      | page.language                                         | english                                                        |
      | page.type                                             | nciAppModulePage                                               |
      | page.channel                                          | About Cancer                                                   |
      | page.contentGroup                                     | Clinical Trials                                                |
      | page.publishedDate                                    | 02/02/2011                                                     |
      | page.additionalDetails.analyticsName                  | Clinical Trials                                                |
      | page.additionalDetails.formType                       | advanced                                                       |
      | page.additionalDetails.numResults                     | (int)27                                                        |
      | page.additionalDetails.status                         | success                                                        |
      | page.additionalDetails.formData.stages.0              | (arr)C94774                                                    |
      | page.additionalDetails.formData.location              | search-location-all                                            |
      | page.additionalDetails.formData.cancerType            | (arr)C4872                                                     |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | c4872\|all\|c94774\|all\|none\|none                            |
      | page.additionalDetails.helperFormData.fieldUsage      | t:stg                                                          |
      | page.additionalDetails.helperFormData.loc             | all                                                            |
      | page.additionalDetails.helperFormData.tpTidInvLo      | all\|none\|none\|none                                          |
      | page.additionalDetails.helperFormData.ttDrugTreat     | all\|none\|none                                                |

  Scenario: Page Load event fires when user fills out Age, Keyword phrases and location at NIH only
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?a=40&loc=4&q=psa&rl=2"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                                   | value                                                          |
      | type                                                  | PageLoad                                                       |
      | event                                                 | ClinicalTrialsSearchApp:Load:Results                           |
      | page.name                                             | www.cancer.gov/r 																							 |
      | page.title                                            | Clinical Trials Search Results                                 |
      | page.metaTitle                                        | Clinical Trials Search Results - National Cancer Institute     |
      | page.language                                         | english                                                        |
      | page.type                                             | nciAppModulePage                                               |
      | page.channel                                          | About Cancer                                                   |
      | page.contentGroup                                     | Clinical Trials                                                |
      | page.publishedDate                                    | 02/02/2011                                                     |
      | page.additionalDetails.analyticsName                  | Clinical Trials                                                |
      | page.additionalDetails.formType                       | advanced                                                       |
      | page.additionalDetails.numResults                     | (int)17                                                        |
      | page.additionalDetails.status                         | success                                                        |
      | page.additionalDetails.formData.age                   | (int)40                                                        |
      | page.additionalDetails.formData.location              | search-location-nih                                            |
      | page.additionalDetails.formData.keywordPhrases        | psa                                                            |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | all\|all\|all\|all\|40\|psa                                    |
      | page.additionalDetails.helperFormData.fieldUsage      | a:q:loc                                                        |
      | page.additionalDetails.helperFormData.loc             | at nih                                                         |
      | page.additionalDetails.helperFormData.tpTidInvLo      | all\|none\|none\|none                                          |
      | page.additionalDetails.helperFormData.ttDrugTreat     | all\|none\|none                                                |

  Scenario: Page Load event fires when user fills out Location fields with VaOnly toggled and specified state
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?lcnty=United%20States&loc=2&lst=WA&rl=2&va=1"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                                   | value                                                          |
      | type                                                  | PageLoad                                                       |
      | event                                                 | ClinicalTrialsSearchApp:Load:Results                           |
      | page.name                                             | www.cancer.gov/r 																							 |
      | page.title                                            | Clinical Trials Search Results                                 |
      | page.metaTitle                                        | Clinical Trials Search Results - National Cancer Institute     |
      | page.language                                         | english                                                        |
      | page.type                                             | nciAppModulePage                                               |
      | page.channel                                          | About Cancer                                                   |
      | page.contentGroup                                     | Clinical Trials                                                |
      | page.publishedDate                                    | 02/02/2011                                                     |
      | page.additionalDetails.analyticsName                  | Clinical Trials                                                |
      | page.additionalDetails.formType                       | advanced                                                       |
      | page.additionalDetails.numResults                     | (int)5                                                         |
      | page.additionalDetails.status                         | success                                                        |
      | page.additionalDetails.formData.vaOnly                | (bool)true                                                     |
      | page.additionalDetails.formData.country               | United States                                                  |
      | page.additionalDetails.formData.location              | search-location-country                                        |
      | page.additionalDetails.formData.states                | (arr)WA                                                        |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | all\|all\|all\|all\|none\|none                                 |
      | page.additionalDetails.helperFormData.fieldUsage      | loc:va:lcnty:lst                                               |
      | page.additionalDetails.helperFormData.loc             | csc\|united states\|wa\|none\|va-only                          |
      | page.additionalDetails.helperFormData.tpTidInvLo      | all\|none\|none\|none                                          |
      | page.additionalDetails.helperFormData.ttDrugTreat     | all\|none\|none                                                |

  Scenario: Page Load event fires when user fills out Location hospital field and searches
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?hos=UM%20Baltimore%20Washington%20Medical%20Center%20%2F%20Tate%20Cancer%20Center&loc=3&rl=2"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                                   | value                                                           |
      | type                                                  | PageLoad                                                        |
      | event                                                 | ClinicalTrialsSearchApp:Load:Results                            |
      | page.name                                             | www.cancer.gov/r  																							|
      | page.title                                            | Clinical Trials Search Results                                  |
      | page.metaTitle                                        | Clinical Trials Search Results - National Cancer Institute      |
      | page.language                                         | english                                                         |
      | page.type                                             | nciAppModulePage                                                |
      | page.channel                                          | About Cancer                                                    |
      | page.contentGroup                                     | Clinical Trials                                                 |
      | page.publishedDate                                    | 02/02/2011                                                      |
      | page.additionalDetails.analyticsName                  | Clinical Trials                                                 |
      | page.additionalDetails.formType                       | advanced                                                        |
      | page.additionalDetails.numResults                     | (int)29                                                         |
      | page.additionalDetails.status                         | success                                                         |
      | page.additionalDetails.formData.hospital              | UM Baltimore Washington Medical Center / Tate Cancer Center     |
      | page.additionalDetails.formData.location              | search-location-hospital                                        |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | all\|all\|all\|all\|none\|none                                  |
      | page.additionalDetails.helperFormData.fieldUsage      | loc:hos                                                         |
      | page.additionalDetails.helperFormData.loc             | hi\|UM Baltimore Washington Medical Center / Tate Cancer Center |
      | page.additionalDetails.helperFormData.tpTidInvLo      | all\|none\|none\|none                                           |
      | page.additionalDetails.helperFormData.ttDrugTreat     | all\|none\|none                                                 |

  Scenario: Page Load event fires when user fills out Trial Type field and searches
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?hv=1&loc=0&rl=2&tt=treatment&tt=prevention&tt=supportive_care&tt=health_services_research&tt=diagnostic&tt=screening&tt=basic_science&tt=other"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                                   | value                                                                                                       |
      | type                                                  | PageLoad                                                                                                    |
      | event                                                 | ClinicalTrialsSearchApp:Load:Results                                                                        |
      | page.name                                             | www.cancer.gov/r                                              																							|
      | page.title                                            | Clinical Trials Search Results                                                                              |
      | page.metaTitle                                        | Clinical Trials Search Results - National Cancer Institute                                                  |
      | page.language                                         | english                                                                                                     |
      | page.type                                             | nciAppModulePage                                                                                            |
      | page.channel                                          | About Cancer                                                                                                |
      | page.contentGroup                                     | Clinical Trials                                                                                             |
      | page.publishedDate                                    | 02/02/2011                                                                                                  |
      | page.additionalDetails.analyticsName                  | Clinical Trials                                                                                             |
      | page.additionalDetails.formType                       | advanced                                                                                                    |
      | page.additionalDetails.numResults                     | (int)508                                                                                                    |
      | page.additionalDetails.status                         | success                                                                                                     |
      | page.additionalDetails.formData.healthyVolunteers     | (bool)true                                                                                                  |
      | page.additionalDetails.formData.location              | search-location-all                                                                                         |
      | page.additionalDetails.formData.trialTypes            | (arr)treatment,prevention,supportive_care,health_services_research,diagnostic,screening,basic_science,other |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | all\|all\|all\|all\|none\|none                                                                              |
      | page.additionalDetails.helperFormData.fieldUsage      | tt:hv                                                                                                       |
      | page.additionalDetails.helperFormData.loc             | all                                                                                                         |
      | page.additionalDetails.helperFormData.tpTidInvLo      | all\|none\|none\|none                                                                                       |
      | page.additionalDetails.helperFormData.ttDrugTreat     | tre,sup,dia,bas,pre,hea,scr,oth\|none\|none\|hv                                                             |

  Scenario: Page Load event fires when user fills out Drug Treatment and Trial Phase fields and searches
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?d=C599&i=C18309&loc=0&rl=2&tp=i&tp=ii&tp=iii&tp=iv"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                                   | value                                                          |
      | type                                                  | PageLoad                                                       |
      | event                                                 | ClinicalTrialsSearchApp:Load:Results                           |
      | page.name                                             | www.cancer.gov/r 																							 |
      | page.title                                            | Clinical Trials Search Results                                 |
      | page.metaTitle                                        | Clinical Trials Search Results - National Cancer Institute     |
      | page.language                                         | english                                                        |
      | page.type                                             | nciAppModulePage                                               |
      | page.channel                                          | About Cancer                                                   |
      | page.contentGroup                                     | Clinical Trials                                                |
      | page.publishedDate                                    | 02/02/2011                                                     |
      | page.additionalDetails.analyticsName                  | Clinical Trials                                                |
      | page.additionalDetails.formType                       | advanced                                                       |
      | page.additionalDetails.numResults                     | (int)2                                                         |
      | page.additionalDetails.status                         | success                                                        |
      | page.additionalDetails.formData.drugs.0               | (arr)C599                                                      |
      | page.additionalDetails.formData.location              | search-location-all                                            |
      | page.additionalDetails.formData.trialPhases           | (arr)i,ii,iii,iv                                               |
      | page.additionalDetails.formData.treatments.0          | (arr)C18309                                                    |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | all\|all\|all\|all\|none\|none                                 |
      | page.additionalDetails.helperFormData.fieldUsage      | d:i:tp                                                         |
      | page.additionalDetails.helperFormData.loc             | all                                                            |
      | page.additionalDetails.helperFormData.tpTidInvLo      | i,ii,iii,iv\|none\|none\|none                                  |
      | page.additionalDetails.helperFormData.ttDrugTreat     | all\|c599\|c18309                                              |


  Scenario: Page Load event fires when user fills out Trial Id, Lead organization and investigator fields and searches
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?in=Jarushka%20Naidoo&lo=ECOG-ACRIN%20Cancer%20Research%20Group&loc=0&rl=2&tid=NCI-2018-02825"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                                   | value                                                                          |
      | type                                                  | PageLoad                                                                       |
      | event                                                 | ClinicalTrialsSearchApp:Load:Results                                           |
      | page.name                                             | www.cancer.gov/r                 																							 |
      | page.title                                            | Clinical Trials Search Results                                                 |
      | page.metaTitle                                        | Clinical Trials Search Results - National Cancer Institute                     |
      | page.language                                         | english                                                                        |
      | page.type                                             | nciAppModulePage                                                               |
      | page.channel                                          | About Cancer                                                                   |
      | page.contentGroup                                     | Clinical Trials                                                                |
      | page.publishedDate                                    | 02/02/2011                                                                     |
      | page.additionalDetails.analyticsName                  | Clinical Trials                                                                |
      | page.additionalDetails.formType                       | advanced                                                                       |
      | page.additionalDetails.numResults                     | (int)1                                                                         |
      | page.additionalDetails.status                         | success                                                                        |
      | page.additionalDetails.formData.investigator          | Jarushka Naidoo                                                                |
      | page.additionalDetails.formData.location              | search-location-all                                                            |
      | page.additionalDetails.formData.leadOrg               | ECOG-ACRIN Cancer Research Group                                               |
      | page.additionalDetails.formData.trialId               | NCI-2018-02825                                                                 |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | all\|all\|all\|all\|none\|none                                                 |
      | page.additionalDetails.helperFormData.fieldUsage      | tid:in:lo                                                                      |
      | page.additionalDetails.helperFormData.loc             | all                                                                            |
      | page.additionalDetails.helperFormData.tpTidInvLo      | all\|single:nci-2018-02825\|jarushka naidoo\|ecog-acrin cancer research group |
      | page.additionalDetails.helperFormData.ttDrugTreat     | all\|none\|none                                                                |


 Scenario: Click event fires when user clicks on Modify Search criteria button
  Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
  And "baseHost" is set to "http://localhost:3000"
  And "canonicalHost" is set to "https://www.cancer.gov"
  And "siteName" is set to "National Cancer Institute"
  And "channel" is set to "About Cancer"
  And "analyticsPublishedDate" is set to "02/02/2011"
  And "analyticsName" is set to "Clinical Trials"
  When the user navigates to "/r?a=40&loc=0&rl=2"
  Then the page title is "Clinical Trials Search Results"
  And browser waits
  When user clicks on "Modify Search Criteria" button
  Then there should be an analytics event with the following details
      | key                | value                                                       |
      | type               | Other                                                       |
      | event              | ClinicalTrialsSearchApp:Other:ModifySearchCriteriaLinkClick |
      | linkName           | CTSModifyClick                                              |
      | data.analyticsName | Clinical Trials                                             |
      | data.formType      | advanced                                                    |
      | data.source        | modify_search_criteria_link                                 |



Scenario: Click event fires when user selects all on page and click print
  Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
  And "baseHost" is set to "http://localhost:3000"
  And "canonicalHost" is set to "https://www.cancer.gov"
  And "siteName" is set to "National Cancer Institute"
  And "channel" is set to "About Cancer"
  And "analyticsPublishedDate" is set to "02/02/2011"
  And "analyticsName" is set to "Clinical Trials"
  When the user navigates to "/r?loc=0&rl=2"
  Then the page title is "Clinical Trials Search Results"
  And browser waits
  When user checks "Select all on page" checkbox
  And user clicks on "Print Selected" button
  Then there should be an analytics event with the following details
    | key                    | value                                                  |
    | type                   | Other                                                  |
    | event                  | ClinicalTrialsSearchApp:Other:PrintSelectedButtonClick |
    | linkName               | CTSResultsPrintSelectedClick                           |
    | data.analyticsName     | Clinical Trials                                        |
    | data.formType          | advanced                                               |
    | data.buttonPos         | top                                                    |
    | data.selectAll         | (bool)true                                             |
    | data.selectedCount     | (int)10                                                |
    | data.pagesWithSelected | (arrInt)1                                              |

#### Needs scroll to be implemented

# Scenario: Click event fires when user clicks on Find Trials button from Advanced Search form
#   Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
#   And "baseHost" is set to "http://localhost:3000"
#   And "canonicalHost" is set to "https://www.cancer.gov"
#   And "siteName" is set to "National Cancer Institute"
#   And "channel" is set to "About Cancer"
#   And "analyticsPublishedDate" is set to "02/02/2011"
#   And "analyticsName" is set to "Clinical Trials"
#   When the user navigates to "/advanced"
#   Then the page title is "Find NCI-Supported Clinical Trials"
#   And browser waits
#   When user scrolls to middle of screen
#   And user clicks on "Find Trials" button
#   Then there should be an analytics event with the following details
#       | key                | value                                                |
#       | type               | Other                                                |
#       | event              | ClinicalTrialsSearchApp:Other:FormSubmissionComplete |
#       | linkName           | fformAnalysis\|clinicaltrials_advanced\|complete     |
#       | data.analyticsName | Clinical Trials                                      |
#       | data.formType      | advanced                                             |
#       | data.completion    | complete_scrolling                                   |


Scenario: Click event fires when user clicks on Clear Form button
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
  And "baseHost" is set to "http://localhost:3000"
  And "canonicalHost" is set to "https://www.cancer.gov"
  And "siteName" is set to "National Cancer Institute"
  And "channel" is set to "About Cancer"
  And "analyticsPublishedDate" is set to "02/02/2011"
  And "analyticsName" is set to "Clinical Trials"
  When the user navigates to "/advanced"
  Then the page title is "Find NCI-Supported Clinical Trials"
  And browser waits
  When user clears form
  Then there should be preserved analytics event with the following details
      | key                | value                                   |
      | type               | Other                                   |
      | event              | ClinicalTrialsSearchApp:Other:ClearForm |
      | linkName           | clinicaltrials_advanced\|clear          |
      | data.analyticsName | Clinical Trials                         |
      | data.formType      | advanced                                |

Scenario: Click event fires when user tries to print without selecting any trial
  Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
  And "baseHost" is set to "http://localhost:3000"
  And "canonicalHost" is set to "https://www.cancer.gov"
  And "siteName" is set to "National Cancer Institute"
  And "channel" is set to "About Cancer"
  And "analyticsPublishedDate" is set to "02/02/2011"
  And "analyticsName" is set to "Clinical Trials"
  When the user navigates to "/r?loc=0&rl=2"
  Then the page title is "Clinical Trials Search Results"
  And browser waits
  And user clicks on "Print Selected" button
  And browser waits
  Then there should be an analytics event with the following details
      | key                    | value                                                  |
      | type                   | Other                                                  |
      | event                  | ClinicalTrialsSearchApp:Other:PrintSelectedError       |
      | linkName               | CTSResultsSelectedErrorClick                           |
      | data.analyticsName     | Clinical Trials                                        |
      | data.formType          | advanced                                               |
      | data.errorReason       | noneselected                                           |

Scenario: Click event fires when user reaches max number of selected trials
  Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
  And "baseHost" is set to "http://localhost:3000"
  And "canonicalHost" is set to "https://www.cancer.gov"
  And "siteName" is set to "National Cancer Institute"
  And "channel" is set to "About Cancer"
  And "analyticsPublishedDate" is set to "02/02/2011"
  And "analyticsName" is set to "Clinical Trials"
  When the user navigates to "/r?loc=0&rl=2"
  Then the page title is "Clinical Trials Search Results"
  And browser waits
  When user checks "Select all on page" checkbox on 11 pages
  And browser waits
  Then there should be an analytics event with the following details
      | key                    | value                                                  |
      | type                   | Other                                                  |
      | event                  | ClinicalTrialsSearchApp:Other:PrintSelectedError       |
      | linkName               | CTSResultsSelectedErrorClick                           |
      | data.analyticsName     | Clinical Trials                                        |
      | data.formType          | advanced                                               |
      | data.errorReason       | maxselectionreached                                    |
