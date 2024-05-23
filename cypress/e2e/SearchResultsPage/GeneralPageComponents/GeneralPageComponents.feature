Feature: Clinical Trials Search Results Page Components

	### delighters####

	Scenario: When user is on a search results page he can see all its items
		Given the user navigates to "/r?loc=0&rl=1"
		Then the page title is "Clinical Trials Search Results"
		And trial info displayes "Results 1-10  of 6821 for your search for: \"all trials\""
		And "Start Over" link has a href "/"
		And result list is displayed
		And there are 2 delighters present
		And the following delighters are displayed
			| delighter    | href                                               | title                              | text                                                                  |
			| cts-livehelp | /contact                                           | Have a question?We're here to help | Chat with us: LiveHelpCall us: 1-800-4-CANCER(1-800-422-6237)         |
			| cts-which    | /research/participate/clinical-trials-search/steps | Which trials are right for you?    | Use the checklist in our guide to gather the information you’ll need. |


	# # ###########Start Over###########
	Scenario: user can start over at the advanced search page after going to url directly
		Given the user navigates to "/r?a=40&loc=0&rl=2&t=C4872"
		And trial info displayes "Results 1-10  of 894 for your search "
		Then the criteria table displays the following
			| Category                      | Selection     |
			| Primary Cancer Type/Condition | Breast Cancer |
			| Age                           | 40            |
		When user clicks on "Start Over" link
		Then user is taken back to "Advanced" search page
		When user clicks on "All" button
		Then the following fields have been cleared out
			| Field               |
			| CancerTypeCondition |
			| Age                 |

	Scenario: user can start over at the basic search page after going to url directly
		Given the user navigates to "/r?a=40&loc=0&rl=1"
		And trial info displayes "Results 1-10  of 6306 for your search "
		Then the criteria table displays the following
			| Category | Selection |
			| Age      | 40        |
		When user clicks on "Start Over" link
		Then user is taken back to "Basic" search page
		Then the following fields have been cleared out
			| Field |
			| Age   |

	####### Search Criteria and Refine###############
	Scenario: as a user I expect that the search results page is displaying search criteria in an expected order when I refine to search for zipcode
		Given the user navigates to "/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lcnty=United%20States&lcty=Atlanta&lo=M%20D%20Anderson%20Cancer%20Center&loc=2&lst=GA&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment"
		And trial info displayes "Results 1-1  of 1 for your search "
		Then the criteria table displays the following
			| Category                      | Selection                       |
			| Primary Cancer Type/Condition | Breast Cancer                   |
			| Subtype                       | Ductal Carcinoma In Situ (DCIS) |
			| Stage                         | Early-Stage Breast Cancer       |
			| Age                           | 50                              |
			| Keywords/Phrases              | Breast                          |
			| Country                       | United States                   |
			| States                        | Georgia                         |
			| City                          | Atlanta                         |
			| Trial Type                    | Treatment                       |
			| Drug/Drug Family              | Radiosensitizing Agent          |
			| Other Treatments              | Radiation Therapy               |
			| Trial ID                      | NCI-2017-00476                  |
			| Trial Phase                   | Phase III                       |
			| Trial Investigators           | Benjamin David Smith            |
			| Lead Organizations            | M D Anderson Cancer Center      |
		When user clicks on Modify Search Criteria button
		And user selects "Zip" radio button
		And user types "30309" in "Zipcode" field
		And user clicks on "Find Trials" button
		And trial info displayes "Results 1-1  of 1 for your search "
		Then the criteria table displays the following
			| Category                      | Selection                       |
			| Primary Cancer Type/Condition | Breast Cancer                   |
			| Subtype                       | Ductal Carcinoma In Situ (DCIS) |
			| Stage                         | Early-Stage Breast Cancer       |
			| Age                           | 50                              |
			| Keywords/Phrases              | Breast                          |
			| Near ZIP Code                 | within 100 miles of 30309       |
			| Trial Type                    | Treatment                       |
			| Drug/Drug Family              | Radiosensitizing Agent          |
			| Other Treatments              | Radiation Therapy               |
			| Trial ID                      | NCI-2017-00476                  |
			| Trial Phase                   | Phase III                       |
			| Trial Investigators           | Benjamin David Smith            |
			| Lead Organizations            | M D Anderson Cancer Center      |
		And the url query has the following corresponding code
			| parameter | value                      |
			| a         | 50                         |
			| d         | C798                       |
			| i         | C15313                     |
			| in        | Benjamin David Smith       |
			| lo        | M D Anderson Cancer Center |
			| loc       | 1                          |
			| q         | Breast                     |
			| rl        | 2                          |
			| st        | C2924                      |
			| stg       | C94774                     |
			| t         | C4872                      |
			| tid       | NCI-2017-00476             |
			| tp        | iii                        |
			| tt        | treatment                  |
			| z         | 30309                      |
			| zp        | 100                        |


	Scenario: as a user I expect that the search results page is displaying search criteria in an expected order when I modify location to be hospitals
		Given the user navigates to "/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lcnty=United%20States&lcty=Atlanta&lo=M%20D%20Anderson%20Cancer%20Center&loc=2&lst=GA&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment"
		And trial info displayes "Results 1-1  of 1 for your search "
		When user clicks on Modify Search Criteria button
		And user selects "Hospital" radio button
		And user types "anderson" in "Hospitals / Institutions" autosuggest field
		And user clicks on "Find Trials" button
		And trial info displayes "Results 1-1  of 1 for your search "
		Then the criteria table displays the following
			| Category                      | Selection                       |
			| Primary Cancer Type/Condition | Breast Cancer                   |
			| Subtype                       | Ductal Carcinoma In Situ (DCIS) |
			| Stage                         | Early-Stage Breast Cancer       |
			| Age                           | 50                              |
			| Keywords/Phrases              | Breast                          |
			| At Hospital/Institution       | anderson                        |
			| Trial Type                    | Treatment                       |
			| Drug/Drug Family              | Radiosensitizing Agent          |
			| Other Treatments              | Radiation Therapy               |
			| Trial ID                      | NCI-2017-00476                  |
			| Trial Phase                   | Phase III                       |
			| Trial Investigators           | Benjamin David Smith            |
			| Lead Organizations            | M D Anderson Cancer Center      |
		And the url query has the following corresponding code
			| parameter | value                      |
			| a         | 50                         |
			| d         | C798                       |
			| hos       | anderson                   |
			| i         | C15313                     |
			| in        | Benjamin David Smith       |
			| lo        | M D Anderson Cancer Center |
			| loc       | 3                          |
			| q         | Breast                     |
			| rl        | 2                          |
			| st        | C2924                      |
			| stg       | C94774                     |
			| t         | C4872                      |
			| tid       | NCI-2017-00476             |
			| tp        | iii                        |
			| tt        | treatment                  |


	Scenario: as a user I expect that the search results page is displaying search criteria in an expected order when I modify location to be at NIH only
		Given the user navigates to "/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lcnty=United%20States&lcty=Atlanta&lo=M%20D%20Anderson%20Cancer%20Center&loc=2&lst=GA&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment"
		And trial info displayes "Results 1-1  of 1 for your search "
		When user clicks on Modify Search Criteria button
		And user selects "NIH" radio button
		And user clicks on "Find Trials" button
		Then the criteria table displays the following
			| Category                      | Selection                                                  |
			| Primary Cancer Type/Condition | Breast Cancer                                              |
			| Subtype                       | Ductal Carcinoma In Situ (DCIS)                            |
			| Stage                         | Early-Stage Breast Cancer                                  |
			| Age                           | 50                                                         |
			| Keywords/Phrases              | Breast                                                     |
			| At NIH                        | Only show trials at the NIH Clinical Center (Bethesda, MD) |
			| Trial Type                    | Treatment                                                  |
			| Drug/Drug Family              | Radiosensitizing Agent                                     |
			| Other Treatments              | Radiation Therapy                                          |
			| Trial ID                      | NCI-2017-00476                                             |
			| Trial Phase                   | Phase III                                                  |
			| Trial Investigators           | Benjamin David Smith                                       |
			| Lead Organizations            | M D Anderson Cancer Center                                 |
		And the url query has the following corresponding code
			| parameter | value                      |
			| a         | 50                         |
			| d         | C798                       |
			| i         | C15313                     |
			| in        | Benjamin David Smith       |
			| lo        | M D Anderson Cancer Center |
			| loc       | 4                          |
			| q         | Breast                     |
			| rl        | 2                          |
			| st        | C2924                      |
			| stg       | C94774                     |
			| t         | C4872                      |
			| tid       | NCI-2017-00476             |
			| tp        | iii                        |
			| tt        | treatment                  |


	#### no results page ######
	Scenario: user navigates to no Trials found page, modifies search and able to see results found
		Given the user navigates to "/r?fin=C18673&loc=0&rl=2&st=C8287&stg=C94774&t=C4872"
		And "No clinical trials matched your search.For assistance, please contact the Cancer Information Service. You can chat online or call 1-800-4-CANCER (1-800-422-6237).Try a new search" no trial info is displayed
		And the criteria table displays the following
			| Category                                           | Selection                 |
			| Primary Cancer Type/Condition                      | Breast Cancer             |
			| Subtype                                            | Bilateral Breast Cancer   |
			| Stage                                              | Early-Stage Breast Cancer |
			| Side Effects / Biomarkers / Participant Attributes | Cancer Survivor           |
		And "Start Over" link has a href "/advanced"
		And "No clinical trials matched your search" text is displayed as results header
		And text "For assistance, please contact the Cancer Information Service. You can chat online or call 1-800-4-CANCER (1-800-422-6237)." is displayed
		And "chat online" has a link "https://livehelp.cancer.gov/app/chat/chat_landing"
		And "Try a new search" link has a href "/advanced"
		When user clicks on Modify Search Criteria button
		When user removes "Cancer Survivor" from the "SideEffects" field
		And user clicks on "Find Trials" button
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

	Scenario: When user is on a no trials found page because of invalid url parameters
		Given the user navigates to "/r?loc=1&rl=1&z=200"
		And text "Sorry, you seem to have entered invalid criteria. Please check the following, and try your search again:" is displayed
		And the invalid criteria table displays the following
			| Criteria |
			| ZIP Code |
		And text "For assistance, please contact the Cancer Information Service. You can chat online or call 1-800-4-CANCER (1-800-422-6237)." is displayed
		And "chat online" has a link "https://livehelp.cancer.gov/app/chat/chat_landing"
		And "Try a new search" link has a href "/"
		When user clicks on chat online button
		Then the chat is opened

	Scenario: When user is on a no trials found page because of invalid url parameters with advanced form
		Given the user navigates to "/r?loc=1&rl=2&z=200"
		And text "Sorry, you seem to have entered invalid criteria. Please check the following, and try your search again:" is displayed
		And the invalid criteria table displays the following
			| Criteria |
			| ZIP Code |
		And text "For assistance, please contact the Cancer Information Service. You can chat online or call 1-800-4-CANCER (1-800-422-6237)." is displayed
		And "chat online" has a link "https://livehelp.cancer.gov/app/chat/chat_landing"
		And "Try a new search" link has a href "/advanced"
		When user clicks on chat online button
		Then the chat is opened
	### meta data

	Scenario: As a user, I expect meta data to update accordingly when I search for criteria and modify my search
		Given the user navigates to "/advanced"
		Then the page title is "Find NCI-Supported Clinical Trials"
		And "Age" form section is displayed
		When user types "40" in "Age" field
		And user clicks on "Find Trials" button
		Then the search is executed and results page is displayed
		And trial info displayes "Results 1-10  of 6306 for your search "
		And the title tag should be "Clinical Trials Search Results - NCI"
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                |
			| og:title       | Clinical Trials Search Results                                                         |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=40&loc=0&rl=2 |
			| og:description | Find an NCI-supported clinical trial - Search results                                  |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=40&loc=0&rl=2"
		When user clicks on Modify Search Criteria button
		When user clears "Age" input field
		And user types "39" in "Age" field
		And the title tag should be "Find NCI-Supported Clinical Trials - Advanced Search - NCI"
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
		And trial info displayes "Results 1-10  of 6731 for your search "
		And the title tag should be "Clinical Trials Search Results - NCI"
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                |
			| og:title       | Clinical Trials Search Results                                                         |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=39&loc=0&rl=2 |
			| og:description | Find an NCI-supported clinical trial - Search results                                  |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=39&loc=0&rl=2"


	Scenario: As a user, I expect meta data to update accordingly when I navigate to search results directly and modify my search
		Given the user navigates to "/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lcnty=United%20States&lcty=Atlanta&lo=M%20D%20Anderson%20Cancer%20Center&loc=2&lst=GA&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment"
		And trial info displayes "Results 1-1  of 1 for your search "
		And the title tag should be "Clinical Trials Search Results - NCI"
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                                                                                                                                                                                                                        |
			| og:title       | Clinical Trials Search Results                                                                                                                                                                                                                                                                 |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lcnty=United%20States&lcty=Atlanta&lo=M%20D%20Anderson%20Cancer%20Center&loc=2&lst=GA&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment |
			| og:description | Find an NCI-supported clinical trial - Search results                                                                                                                                                                                                                                          |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lcnty=United%20States&lcty=Atlanta&lo=M%20D%20Anderson%20Cancer%20Center&loc=2&lst=GA&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment"
		When user clicks on Modify Search Criteria button
		And user selects "Zip" radio button
		And user types "30309" in "Zipcode" field
		And the title tag should be "Find NCI-Supported Clinical Trials - Advanced Search - NCI"
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
		And trial info displayes "Results 1-1  of 1 for your search "
		And the title tag should be "Clinical Trials Search Results - NCI"
		And the page contains meta tags with the following names
			| name        | content                                               |
			| description | Find an NCI-supported clinical trial - Search results |
		And the page contains meta tags with the following properties
			| property       | content                                                                                                                                                                                                                                                             |
			| og:title       | Clinical Trials Search Results                                                                                                                                                                                                                                      |
			| og:url         | https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lo=M%20D%20Anderson%20Cancer%20Center&loc=1&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment&z=30309&zp=100 |
			| og:description | Find an NCI-supported clinical trial - Search results                                                                                                                                                                                                               |
		And there is a canonical link with the href "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?a=50&d=C798&i=C15313&in=Benjamin%20David%20Smith&lo=M%20D%20Anderson%20Cancer%20Center&loc=1&q=Breast&rl=2&st=C2924&stg=C94774&t=C4872&tid=NCI-2017-00476&tp=iii&tt=treatment&z=30309&zp=100"
