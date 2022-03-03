Feature: Search Results Page Pagination
	Scenario: user can page through results
		Given the user navigates to "/r?loc=0&rl=1"
		Then the page title is "Clinical Trials Search Results"
		And result list is displayed
		And pager displays the following navigation options
			| pages  |
			| 1      |
			| 2      |
			| ...    |
			| 683    |
			| Next > |
		And the page "1" is highlighted
		When user clicks on "Next >" button
		Then the user is redirected to "/r" with query parameters "loc=0&pn=2&rl=1"
		And pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| 2          |
			| 3          |
			| ...        |
			| 683        |
			| Next >     |
		And the page "2" is highlighted
		When user clicks on "Next >" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| 2          |
			| 3          |
			| 4          |
			| ...        |
			| 683        |
			| Next >     |
		And the page "3" is highlighted
		When user clicks on "Next >" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| 2          |
			| 3          |
			| 4          |
			| 5          |
			| ...        |
			| 683        |
			| Next >     |
		And the page "4" is highlighted
		When user clicks on "Next >" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| ...        |
			| 4          |
			| 5          |
			| 6          |
			| ...        |
			| 683        |
			| Next >     |
		And the page "5" is highlighted
		When user clicks on "683" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| ...        |
			| 682        |
			| 683        |
		And the page "683" is highlighted
		When user clicks on "< Previous" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| ...        |
			| 681        |
			| 682        |
			| 683        |
			| Next >     |
		And the page "682" is highlighted
		When user clicks on "< Previous" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| ...        |
			| 680        |
			| 681        |
			| 682       |
			| 683        |
			| Next >     |
		And the page "681" is highlighted
		When user clicks on "< Previous" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| ...        |
			| 679        |
			| 680        |
			| 681        |
			| 682        |
			| 683        |
			| Next >     |
		And the page "680" is highlighted
		When user clicks on "< Previous" button
		Then pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| ...        |
			| 678        |
			| 679        |
			| 680        |
			| ...        |
			| 683        |
			| Next >     |
		And the page "679" is highlighted
	Scenario: user can page through results on mobile
		Given screen breakpoint is set to "mobile"
		Given the user navigates to "/r?loc=0&rl=1"
		Then the page title is "Clinical Trials Search Results"
		And result list is displayed
		And pager displays the following navigation options
			| pages  |
			| 1      |
			| 2      |
			| ...    |
			| 683    |
			| Next > |
		And the page "1" is highlighted
		When user clicks on "Next >" button
		Then the user is redirected to "/r" with query parameters "loc=0&pn=2&rl=1"
		And pager displays the following navigation options
			| pages      |
			| < Previous |
			| 1          |
			| 2          |
			| 3          |
			| ...        |
			| 683        |
			| Next >     |
		And the page "2" is highlighted
