Feature: Clinical Trials Search Page - Basic

  ############Analytics################

  Scenario: Page Load Analytics fires when a user views a Basic Search form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                  | value                                                          |
      | type                                 | PageLoad                                                       |
      | event                                | ClinicalTrialsSearchApp:Load:BasicSearch                       |
      | page.name                            | www.cancer.gov/  																						  |
      | page.title                           | Find NCI-Supported Clinical Trials                             |
      | page.metaTitle                       | Find NCI-Supported Clinical Trials - National Cancer Institute |
      | page.language                        | english                                                        |
      | page.type                            | nciAppModulePage                                               |
      | page.channel                         | About Cancer                                                   |
      | page.contentGroup                    | Clinical Trials                                                |
      | page.publishedDate                   | 02/02/2011                                                     |
      | page.additionalDetails.analyticsName | Clinical Trials                                                |
      | page.additionalDetails.formType      | basic                                                          |


  Scenario: Click event fires when user clicks on Cancer Type/Keyword field
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user clicks on "CancerTypeKeyword" field
    Then there should be an analytics event with the following details
      | key                | value                                              |
      | type               | Other                                              |
      | event              | ClinicalTrialsSearchApp:Other:FormInteractionStart |
      | linkName           | formAnalysis\|clinicaltrials_basic\|start          |
      | data.analyticsName | Clinical Trials                                    |
      | data.field         | ctk                                                |
      | data.formType      | basic                                              |

  Scenario: Click event fires when user inputs invalid age and submits form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user types "234" in "Age" field
    And user clicks on "Find Trials" button
    Then there should be an analytics event with the following details
      | key                | value                                             |
      | type               | Other                                             |
      | event              | ClinicalTrialsSearchApp:Other:FormSubmissionError |
      | linkName           | formAnalysis\|clinicaltrials_basic\|error         |
      | data.analyticsName | Clinical Trials                                   |
      | data.formType      | basic                                             |
      | data.status        | error                                             |
      | data.fieldError    | a                                                 |

  Scenario: Click event fires when user inputs invalid ZipCode and tries to submit search
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user types "999g9" in "Zipcode" field
    And user clicks on "Find Trials" button
    Then there should be an analytics event with the following details
      | key                | value                                             |
      | type               | Other                                             |
      | event              | ClinicalTrialsSearchApp:Other:FormSubmissionError |
      | linkName           | formAnalysis\|clinicaltrials_basic\|error         |
      | data.analyticsName | Clinical Trials                                   |
      | data.formType      | basic                                             |
      | data.status        | error                                             |
      | data.fieldError    | z                                                 |

  Scenario: Click event fires when user inputs invalid age and invalid zipcode ans submits form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user types "234" in "Age" field
    And user types "999g9" in "Zipcode" field
    And user clicks on "Find Trials" button
    Then there should be an analytics event with the following details
      | key                | value                                             |
      | type               | Other                                             |
      | event              | ClinicalTrialsSearchApp:Other:FormSubmissionError |
      | linkName           | formAnalysis\|clinicaltrials_basic\|error         |
      | data.analyticsName | Clinical Trials                                   |
      | data.formType      | basic                                             |
      | data.status        | error                                             |
      | data.fieldError    | a,z                                               |

  Scenario: Click event fires when user clicks on Find Trials button
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user clicks on "Find Trials" button
    Then there should be an analytics event with the following details
      | key                | value                                                |
      | type               | Other                                                |
      | event              | ClinicalTrialsSearchApp:Other:FormSubmissionComplete |
      | linkName           | formAnalysis\|clinicaltrials_basic\|complete         |
      | data.analyticsName | Clinical Trials                                      |
      | data.formType      | basic                                                |
      | data.status        | complete                                             |


  Scenario: Click event fires when user clicks on Start Over link while on Basic Form Results page
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?loc=0&rl=1"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    When user clicks on "Start Over" link
    Then there should be an analytics event with the following details
      | key                | value                                            |
      | type               | Other                                            |
      | event              | ClinicalTrialsSearchApp:Other:NewSearchLinkClick |
      | linkName           | CTStartOverClick                                 |
      | data.analyticsName | Clinical Trials                                  |
      | data.formType      | basic                                            |
      | data.source        | start_over_link                                  |

  Scenario: Page Load event fires when user fills out fields on Basic Form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?a=40&loc=0&rl=1&t=C4872"
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
      | page.additionalDetails.formType                       | basic                                                          |
      | page.additionalDetails.numResults                     | (int)894                                                       |
      | page.additionalDetails.status                         | success                                                        |
      | page.additionalDetails.formData.age                   | (int)40                                                        |
      | page.additionalDetails.formData.location              | search-location-all                                            |
      | page.additionalDetails.formData.cancerType            | (arr)C4872                                                     |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | typecondition\|c4872\|40                                       |
      | page.additionalDetails.helperFormData.fieldUsage      | t:a                                                            |
      | page.additionalDetails.helperFormData.loc             | all                                                            |

  Scenario: Click event fires when user clicks on search result item from Basic Search results page
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/r?loc=0&rl=1"
    Then the page title is "Clinical Trials Search Results"
    And browser waits
    When user clicks on 1 trial result
    Then there should be an analytics event with the following details
      | key                  | value                                         |
      | type                 | Other                                         |
      | event                | ClinicalTrialsSearchApp:Other:ResultsListItem |
      | linkName             | UnknownLinkName                               |
      | data.analyticsName   | Clinical Trials                               |
      | data.formType        | basic                                         |
      | data.pageNum         | (int)1                                        |
      | data.resultsPosition | (int)1                                        |

  #Below scenario should be just navigating to search results page, but zip code look up times out with 500 status code
  Scenario: Page Load event fires when user fills out zipcode field on Basic Form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user types "22182" in "Zipcode" field
    And user clicks on "Find Trials" button
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
      | page.additionalDetails.formType                       | basic                                                          |
      | page.additionalDetails.numResults                     | (int)1130                                                      |
      | page.additionalDetails.status                         | success                                                        |
      | page.additionalDetails.formData.zip                   | 22182                                                          |
      | page.additionalDetails.formData.zipRadius             | 100                                                            |
      | page.additionalDetails.formData.location              | search-location-zip                                            |
      | page.additionalDetails.helperFormData.canTypeKwPhrAge | none\|none                                                     |
      | page.additionalDetails.helperFormData.fieldUsage      | loc:z                                                          |
      | page.additionalDetails.helperFormData.loc             | zip\|22182\|none                                               |



  Scenario: Click event fires when user abandons the form
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/advanced"
    When the user navigates to "/"
    Then the page title is "Find NCI-Supported Clinical Trials"
    And browser waits
    When user types "22" in "Age" field
    And user navigates back to the previous page
    Then there should be preserved analytics event with the following details
      | key                | value                                       |
      | type               | Other                                       |
      | event              | ClinicalTrialsSearchApp:Other:FormAbandon   |
      | linkName           | formAnalysis\|clinicaltrials_basic\|abandon |
      | data.analyticsName | Clinical Trials                             |
      | data.formType      | basic                                       |
      | data.field         | age                                         |
