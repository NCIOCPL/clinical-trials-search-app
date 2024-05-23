Feature: As a user I want to be able to print trial search results

	Scenario Outline: as a user, I should be able to select a trial and print it
		Given screen breakpoint is set to "<breakpoint>"
		And the user navigates to "/r?loc=0&rl=1&a=39"
		Then the page title is "Clinical Trials Search Results"
		And result list is displayed
		When user checks "NCI-2014-01507" trial
		And user clicks on "Print Selected" button
		Then the request is sent with the following trial ids
			| trialId        |
			| NCI-2014-01507 |
		And the request is sent with the following details
			| link_template                                                                | new_search_link                              | search_criteria |
			| /research/participate/clinical-trials-search/v?a=39&loc=0&rl=1&id=<TRIAL_ID> | /research/participate/clinical-trials-search | notNull         |
		And the page title is "CTS.Print/Display"
		Examples:
			| breakpoint |
			| desktop    |
			| mobile     |
			| tablet     |

	Scenario: as a user, I should be able to multiple trials on multiple pages and print it
		Given the user navigates to "/r?loc=0&rl=2"
		Then the page title is "Clinical Trials Search Results"
		And result list is displayed
		And user checks "Select all on page" checkbox at the "top" of a page
		Then the checkbox "Select all on page" is checked
		And user checks "Select all on page" checkbox at the "top" of a page
		Then the checkbox "Select all on page" is not checked
		And user checks "Select all on page" checkbox at the "top" of a page
		And all of the trials are selected
		When user clicks on "Next >" pager button
		And user checks "NCI-2017-01425" trial
		When user clicks on "Print Selected" button
		Then the request is sent with the following trial ids
			| trialId        |
			| NCI-2015-01918 |
			| NCI-2014-01507 |
			| NCI-2015-00054 |
			| NCI-2015-00128 |
			| NCI-2020-00751 |
			| NCI-2018-03695 |
			| NCI-2013-00875 |
			| NCI-2019-01034 |
			| NCI-2016-01041 |
			| NCI-2014-01820 |
			| NCI-2017-01425 |
		And the request is sent with the following details
			| link_template                                                                | new_search_link                                         | search_criteria |
			| /research/participate/clinical-trials-search/v?loc=0&pn=2&rl=2&id=<TRIAL_ID> | /research/participate/clinical-trials-search/advanced | null            |
		And the page title is "CTS.Print/Display"

	Scenario: as a user, I want to see all of the selected trials retained after I navigate back to a previous page
		Given the user navigates to "/r?loc=0&rl=1"
		Then the page title is "Clinical Trials Search Results"
		And result list is displayed
		And user checks "Select all on page" checkbox at the "top" of a page
		Then the checkbox "Select all on page" is checked
		And all of the trials are selected
		When user clicks on "Next >" pager button
		And user checks "Select all on page" checkbox at the "top" of a page
		Then the checkbox "Select all on page" is checked
		And user checks "NCI-2017-01425" trial
		Then the checkbox "Select all on page" is not checked
		When user clicks on "< Previous" pager button
		And all of the trials are selected

	Scenario: as a user, I will see a print modal error if I try to print without selecting any trials
		Given the user navigates to "/r?loc=0&rl=1"
		Then the page title is "Clinical Trials Search Results"
		And result list is displayed
		Then the checkbox "Select all on page" is not checked
		When user clicks on "Print Selected" button
		Then print modal appears
		And print modal displayes "You have not selected any trials. Please select at least one trial to print."
		When user closes the modal
		Then print modal is no longer displayed


	Scenario: as a user, I will see a print modal error if I try to select and print more trials than allowed
		Given "ctsTitle" is set to "Find NCI-Supported Clinical Trials"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "NCI"
		And "channel" is set to "About Cancer"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And "analyticsName" is set to "Clinical Trials"
		Given the user navigates to "/r?loc=0&rl=1"
		Then the page title is "Clinical Trials Search Results"
		And result list is displayed
		When user checks "Select all on page" checkbox on 11 pages
		And print modal displayes "You have selected the maximum number of clinical trials (100) that can be printed at one time.Print your current selection and then return to your search results to select more trials to print."
		When user closes the modal
		When user clicks on "Print Selected" button
		Then there should be an analytics event with the following details
			| key                | value                                               |
			| type               | Other                                               |
			| event              | ClinicalTrialsSearchApp:Other:PrintMaxExceededClick |
			| linkName           | CTSResultsSelectedErrorClick                        |
			| data.analyticsName | Clinical Trials                                     |
			| data.formType      | basic                                               |
			| data.errorReason   | maxselectionreached                                 |
