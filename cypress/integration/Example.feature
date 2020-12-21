Feature: Visit page and assert title
    
    Scenario: When user visits landing page he can see info
    Given the user navigates to "/about-cancer/treatment/clinical-trials/search"
    Then page title is "Find NCI-Supported Clinical Trials"
