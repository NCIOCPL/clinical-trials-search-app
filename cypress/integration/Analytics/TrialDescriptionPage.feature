Feature: Clinical Trial Description Page

  ############Analytics################

  Scenario: Page Load event fires when user navigates to trial description page
    Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "About Cancer"
    And "analyticsPublishedDate" is set to "02/02/2011"
    And "analyticsName" is set to "Clinical Trials"
    When the user navigates to "/v?id=NCI-2015-01918&loc=0&rl=1"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                  | value                                                                                                            |
      | type                                 | PageLoad                                                                                                         |
      | event                                | ClinicalTrialsSearchApp:Load:TrialDescription                                                                    |
      | page.name                            | www.cancer.gov/v                                                   																						  |
      | page.title                           | Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence |
      | page.metaTitle                       | Weight Loss Interventions in Treating Overweight and Obese Women with a Higher Risk for Breast Cancer Recurrence |
      | page.language                        | english                                                                                                          |
      | page.type                            | nciAppModulePage                                                                                                 |
      | page.channel                         | About Cancer                                                                                                     |
      | page.contentGroup                    | Clinical Trials                                                                                                  |
      | page.publishedDate                   | 02/02/2011                                                                                                       |
      | page.additionalDetails.analyticsName | Clinical Trials                                                                                                  |
      | page.additionalDetails.formType      | basic                                                                                                            |
      | page.additionalDetails.nctId         | NCT02750826                                                                                                      |

 Scenario: Click event fires when user clicks on Print link on trial description page
  Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
  And "baseHost" is set to "http://localhost:3000"
  And "canonicalHost" is set to "https://www.cancer.gov"
  And "siteName" is set to "National Cancer Institute"
  And "channel" is set to "About Cancer"
  And "analyticsPublishedDate" is set to "02/02/2011"
  And "analyticsName" is set to "Clinical Trials"
  Given screen breakpoint is set to "desktop"
  When the user navigates to "//v?id=NCI-2015-01918&loc=0&rl=1"
  And browser waits
  When user clicks on share by "Print" button
  Then there should be an analytics event with the following details
      | key                | value                                      |
      | type               | Other                                      |
      | event              | ClinicalTrialsSearchApp:Other:ShareButton  |
      | linkName           | UnknownLinkName                            |
      | data.analyticsName | Clinical Trials                            |
      | data.formType      | basic                                      |
      | data.shareType     | print                                      |

## below scenario is timing out due to Cypress waiting on page load
# Scenario: Click event fires when user clicks on Email link on trial description page
#   Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
#   And "baseHost" is set to "http://localhost:3000"
#   And "canonicalHost" is set to "https://www.cancer.gov"
#   And "siteName" is set to "National Cancer Institute"
#   And "channel" is set to "About Cancer"
#   And "analyticsPublishedDate" is set to "02/02/2011"
#   And "analyticsName" is set to "Clinical Trials"
#   Given screen breakpoint is set to "desktop"
#   When the user navigates to "/v?id=NCI-2015-01918&loc=0&rl=1"
#   And browser waits
#   When user clicks on share by "Email" button
#   Then there should be an analytics event with the following details
#       | key                | value                                          |
#       | type               | Other                                          |
#       | event              | ClinicalTrialsSearchApp:Other:ShareButton      |
#       | linkName           | UnknownLinkName                                |
#       | data.analyticsName | Clinical Trials                                |
#       | data.formType      | basic                                          |
#       | data.shareType     | email                                          |

