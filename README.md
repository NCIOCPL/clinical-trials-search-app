
# Mock API Directions

## /mock-api/clinical-trial
This is the mock for clinicaltrialsapi.cancer.gov/v1/clinical-trial/:id. It only supports gets.
To create a mock:
1. Fetch a single clinical trial from the API and place the JSON response into the folder `support/mock-data/clinical-trial` with a file name of `<NCI_ID>.json` where `NCI_ID` is the trial's nci id. (e.g. `NCI-2015-01918.json`) 

>*_NOTE:_* You can also use the NCT ID in place of the NCI_ID for any tests for the urls like `/v?id=NCI123435`. This ID *is* supported on the `/v` route, however within the search app, all links to the `/v` route are generated with the NCI ID. The NCT id is for backwards compatibility and certain other dynamic elements outside of the clinical trials search.


## /mock-api/clinical-trials
This is the mock for clinicaltrialsapi.cancer.gov/v1/clinical-trials. It only supports posts right now as our app only uses posts.

To create a mock:
1. Make some descriptive name to describe this scenario to be used in the file name, e.g. org_name_query. This will be referred to as `<scenario_name>` in the preceeding steps. 
1. Copy the JSON of a request made to the api endpoint and store it in `support/mock-data/clinical-trials/<scenario_name>-request.json`.
1. Copy the JSON of a response returned from the api endpoint and store it in `support/mock-data/clinical-trials/<scenario_name>-response.json`.

The mock api server should return the correct response if the parameters of the request match. We use deep-equal to perform the comparison.




This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
