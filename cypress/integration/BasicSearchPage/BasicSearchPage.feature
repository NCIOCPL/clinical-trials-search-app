Feature: As a user, I want to be able to use Basic Search form fields to find clinical trials

	Scenario Outline: When user visits Basic Search page, all page items are present in different breakpoints
		Given screen breakpoint is set to "<breakpoint>"
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And the text "NCI-supported clinical trials are those sponsored or otherwise financially supported by NCI. See our guide, Steps to Find a Clinical Trial, to learn about options for finding trials not included in NCI's collection." appears below the title
		And "Steps to Find a Clinical Trial" link has a href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/trial-guide"
		And Search tip icon is displayed and text "Search Tip: For more search options, use our advanced search." appears
		And "advanced search" link has a href "/advanced"
		And the following delighters are displayed
			| delighter    | href                                                       | title                              																		| text                                                                  |
			| cts-livehelp | /contact            | Have a question?We're here to help 	| Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
			| cts-what     | /about-cancer/treatment/clinical-trials/what-are-trials    | What Are Cancer Clinical Trials?   																		| Learn what they are and what you should know about them.              |
			| cts-which    | /about-cancer/treatment/clinical-trials/search/trial-guide | Which trials are right for you?    																		| Use the checklist in our guide to gather the information you’ll need. |

		Examples:
			| breakpoint |
			| desktop    |
			| mobile     |
			| tablet     |

	Scenario Outline: all form fields are displayed with its components
		Given screen breakpoint is set to "<breakpoint>"
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Cancer Type/Keyword" form section is displayed
		And help icon is displayed in "Cancer Type/Keyword" section with href "/about-cancer/treatment/clinical-trials/search/help#basicsearch"
		And "Cancer Type/Keyword" input field has a placeholder "Start typing to select a cancer type or keyword"
		And helper text "Leave blank to search all cancer types or keywords." is displayed
		And "Age" form section is displayed
		And help icon is displayed in "Age" section with href "/about-cancer/treatment/clinical-trials/search/help#age"
		And helper text "Your age helps determine which trials are right for you." is displayed
		And "U.S. Zip Code" form section is displayed
		And help icon is displayed in "U.S. Zip Code" section with href "/about-cancer/treatment/clinical-trials/search/help#basicsearch"
		And helper text "Show trials near this U.S. ZIP code." is displayed
		And button "Find Trials" is displayed

		Examples:
			| breakpoint |
			| desktop    |
			| mobile     |
			| tablet     |

	Scenario: User is able to search for and use autosuggested items for cancer type/keyword
		Given screen breakpoint is set to "desktop"
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Cancer Type/Keyword" input field has a placeholder "Start typing to select a cancer type or keyword"
		When user clicks on "Cancer Type/Keyword" field
		Then autocomplete dropdown is displayed
		When user types "breast cancer" in "Cancer Type/Keyword" field
		And user selects "Breast Cancer" from dropdown
		Then "Cancer Type/Keyword" input field has a value "Breast Cancer"
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 966 for your search "
		And the criteria table displays the following
			| Category                      | Selection     |
			| Primary Cancer Type/Condition | Breast Cancer |
		And the url query has the following corresponding code
			| parameter | value |
			| t         | C4872 |
			| loc       | 0     |
			| rl        | 1     |
		When user clicks on Modify Search Criteria button
		Then "Cancer Type/Condition" input field has a value "Breast Cancer"
		When user clicks on "Breast Cancer" button
		When user types "bra" in "Primary Cancer Type/Condition" field
		And user selects "Brain/Spinal Cord Tumor" from dropdown
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 645 for your search "
		And the criteria table displays the following
			| Category                      | Selection               |
			| Primary Cancer Type/Condition | Brain/Spinal Cord Tumor |
		And the url query has the following corresponding code
			| parameter | value |
			| t         | C9293 |
			| loc       | 0     |
			| rl        | 2     |


	Scenario: Negative: user is searching for a keyword that does not exist
		Given screen breakpoint is set to "tablet"
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Cancer Type/Keyword" input field has a placeholder "Start typing to select a cancer type or keyword"
		When user clicks on "Cancer Type/Keyword" field
		Then autocomplete dropdown is displayed
		When user types "asdf" in "Cancer Type/Keyword" field
		Then autocomplete dropdown is displayed with "No available options found. Your search will be based on the text above." text
		When user clicks on "Find Trials" button
		Then the search is executed and no results page is displayed
		And the url query has the following corresponding code
			| parameter | value |
			| q         | asdf  |
			| loc       | 0     |
			| rl        | 1     |

	Scenario: User is able to search for a specific age
		Given screen breakpoint is set to "mobile"
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Age" form section is displayed
		When user types "40" in "Age" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 6306 for your search "
		And the criteria table displays the following
			| Category | Selection |
			| Age      | 40        |
		And the url query has the following corresponding code
			| parameter | value |
			| a         | 40    |
			| loc       | 0     |
			| rl        | 1     |
		When user clicks on Modify Search Criteria button
		Then "Age" input field has a value "40"
		When user clears "Age" input field
		When user types "39" in "Age" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 6731 for your search "
		And the criteria table displays the following
			| Category | Selection |
			| Age      | 39        |
		And the url query has the following corresponding code
			| parameter | value |
			| a         | 39    |
			| loc       | 0     |
			| rl        | 2     |


	Scenario: Negative: User is not able to search for age out of boundaries
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Age" form section is displayed
		When user types "0" in "Age" field
		Then alert "Please enter a number between 1 and 120." is displayed in "Age" section
		When user clears "Age" input field
		Then alert is not displayed in "Age" section
		When user types "121" in "Age" field
		Then alert "Please enter a number between 1 and 120." is displayed in "Age" section
		When user clicks on "Find Trials" button
		Then the search is not executed and path is "/"

	Scenario: User is able to search for a specific zip code
		Given screen breakpoint is set to "tablet"
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "U.S. Zip Code" form section is displayed
		When user types "22182" in "U.S. Zip Code" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 1130 for your search "
		And the criteria table displays the following
			| Category      | Selection |
			| Near ZIP Code | 22182     |
		And the url query has the following corresponding code
			| parameter | value |
			| z         | 22182 |
			| loc       | 1     |
			| rl        | 1     |
		When user clicks on Modify Search Criteria button
		Then "U.S. Zip Code" input field has a value "22182"
		When user clears "U.S. Zip Code" input field
		When user types "22180" in "U.S. Zip Code" field
		When user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 1183 for your search "
		And the criteria table displays the following
			| Category      | Selection                 |
			| Near ZIP Code | within 100 miles of 22180 |
		And the url query has the following corresponding code
			| parameter | value |
			| z         | 22180 |
			| loc       | 1     |
			| rl        | 2     |
			| zp        | 100   |

	Scenario: Negative: User is not able to search for an incorrect zip code
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "U.S. Zip Code" form section is displayed
		When user types "999g9" in "U.S. Zip Code" field
		Then alert "Please enter a valid 5 digit U.S. zip code" is displayed in "U.S. Zip Code" section
		And user clicks on "Find Trials" button
		Then the search is not executed and path is "/"


	Scenario: User is able to search for a trials using age and keyword and then refine search
		Given screen breakpoint is set to "desktop"
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		When user types "breast cancer" in "Cancer Type/Keyword" field
		And user selects "Breast Cancer" from dropdown
		And user types "40" in "Age" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And the criteria table displays the following
			| Category                      | Selection     |
			| Primary Cancer Type/Condition | Breast Cancer |
			| Age                           | 40            |
		And results info has text "Results 1-10  of 894 for your search "
		And the url query has the following corresponding code
			| parameter | value |
			| loc       | 0     |
			| rl        | 1     |
			| t         | C4872 |
			| a         | 40    |
		When user clicks on Modify Search Criteria button
		Then "Age" input field has a value "40"
		And "Cancer Type/Condition" input field has a value "Breast Cancer"
		When user clears "Age" input field
		And user types "70" in "Age" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 952 for your search "
		And the criteria table displays the following
			| Category                      | Selection     |
			| Primary Cancer Type/Condition | Breast Cancer |
			| Age                           | 70            |
		And the url query has the following corresponding code
			| parameter | value |
			| loc       | 0     |
			| rl        | 2     |
			| t         | C4872 |
			| a         | 70    |

	Scenario: User is able to search for all trials without specifying any criteria
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 6821 for your search for: \"all trials\"   |  Start Over"
		And the url query has the following corresponding code
			| parameter | value |
			| loc       | 0     |
			| rl        | 1     |


	Scenario: User has an option to go to search results url directly and modify search
		Given the user navigates to "/r?a=30&loc=1&q=aids&rl=1&z=22182"
		Then trial info displays "Results 1-10  of 17 for your search "
		And the criteria table displays the following
			| Category         | Selection |
			| Keywords/Phrases | aids      |
			| Age              | 30        |
			| Near ZIP Code    | 22182     |
		When user clicks on Modify Search Criteria button
		Then "Age" input field has a value "30"
		And "Keywords/Phrases" input field has a value "aids"
		And "U.S. Zip Code" input field has a value "22182"
		When user clears "Age" input field
		And user types "40" in "Age" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 18 for your search "
		And the criteria table displays the following
			| Category         | Selection |
			| Age              | 40        |
			| Keywords/Phrases | aids      |
			| Near ZIP Code    | 22182     |
		And the url query has the following corresponding code
			| parameter | value |
			| loc       | 1     |
			| rl        | 2     |
			| q         | aids  |
			| a         | 40    |
			| z         | 22182 |
			| zp        | 100   |


	Scenario: User is able to search for everything and modify search
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		When user types "30" in "Age" field
		When user types "22182" in "U.S. Zip Code" field
		When user types "aids" in "Cancer Type/Keyword" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		Then trial info displays "Results 1-10  of 17 for your search "
		And the criteria table displays the following
			| Category         | Selection |
			| Keywords/Phrases | aids      |
			| Age              | 30        |
			| Near ZIP Code    | 22182     |
		And the url query has the following corresponding code
			| parameter | value |
			| loc       | 1     |
			| rl        | 1     |
			| q         | aids  |
			| a         | 30    |
			| z         | 22182 |
		When user clicks on Modify Search Criteria button
		When user clears "Age" input field
		And user types "40" in "Age" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 18 for your search "
		And the criteria table displays the following
			| Category         | Selection |
			| Age              | 40        |
			| Keywords/Phrases | aids      |
			| Near ZIP Code    | 22182     |
		And the url query has the following corresponding code
			| parameter | value |
			| loc       | 1     |
			| rl        | 2     |
			| q         | aids  |
			| a         | 40    |
			| z         | 22182 |
			| zp        | 100   |


	### meta data

	Scenario: As a search engine I want to have access to the meta data on a basic search page
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And the title tag should be "Find NCI-Supported Clinical Trials - National Cancer Institute"
		And the page contains meta tags with the following names
			| name        | content                                                                                                                       |
			| description | Find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
		And the page contains meta tags with the following properties
			| property       | content                                                                                                                       |
			| og:title       | Find NCI-Supported Clinical Trials                                                                                            |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/                                                         |
			| og:description | Find an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one. |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/"



	Scenario: As a user, I expect meta data to update accordingly when I search for criteria and modify my search
		Given the user navigates to "/"
		Then the page title is "Find NCI-Supported Clinical Trials"
		When user types "30" in "Age" field
		When user types "22182" in "U.S. Zip Code" field
		When user types "aids" in "Cancer Type/Keyword" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		Then trial info displays "Results 1-10  of 17 for your search "
		And the title tag should be "Clinical Trials Search Results - National Cancer Institute"
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                               |
			| og:title       | Clinical Trials Search Results                                                                        |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=30&loc=1&q=aids&rl=1&z=22182 |
			| og:description | Find an NCI-supported clinical trial - Search results                                                 |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=30&loc=1&q=aids&rl=1&z=22182"
		When user clicks on Modify Search Criteria button
		When user clears "Age" input field
		And user types "40" in "Age" field
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
		And user clicks on "Find Trials" button
		And browser waits
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 18 for your search "
		And the title tag should be "Clinical Trials Search Results - National Cancer Institute"
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                                      |
			| og:title       | Clinical Trials Search Results                                                                               |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=40&loc=1&q=aids&rl=2&z=22182&zp=100 |
			| og:description | Find an NCI-supported clinical trial - Search results                                                        |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=40&loc=1&q=aids&rl=2&z=22182&zp=100"


	Scenario: As a user, I expect meta data to update accordingly when I navigate to search results directly and modify my search
		Given the user navigates to "/r?a=30&loc=1&q=aids&rl=1&z=22182"
		Then trial info displays "Results 1-10  of 17 for your search "
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                               |
			| og:title       | Clinical Trials Search Results                                                                        |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=30&loc=1&q=aids&rl=1&z=22182 |
			| og:description | Find an NCI-supported clinical trial - Search results                                                 |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=30&loc=1&q=aids&rl=1&z=22182"
		And the title tag should be "Clinical Trials Search Results - National Cancer Institute"
		When user clicks on Modify Search Criteria button
		When user clears "Age" input field
		And user types "40" in "Age" field
		And browser waits
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
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displays "Results 1-10  of 18 for your search "
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                                      |
			| og:title       | Clinical Trials Search Results                                                                               |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=40&loc=1&q=aids&rl=2&z=22182&zp=100 |
			| og:description | Find an NCI-supported clinical trial - Search results                                                        |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=40&loc=1&q=aids&rl=2&z=22182&zp=100"
		And browser waits
		And the title tag should be "Clinical Trials Search Results - National Cancer Institute"
