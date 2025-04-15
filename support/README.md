# Clinical Trial Search API Proxy

The Clinical Trial Search API doesn't support running against arbitrary URLs, including `localhost`.

These are support files to proxy the Clinical Trials API for local development.  It also supports a mock proxy for use when running tests.

## `src` directory

Files under `src` are the actual proxy. The main entry point is `setupProxy.js` which sets up the various routes.  The additional files contain the logic for supporting individual routes as well as the mock API.

## `mock-data` directory

These files support the returns on the various endpoints.

### `mock-data/clinical-trial`

<details>
Data files for the `/cts/mock-api/v2/trials/:id` endpoint.

File names are of the format `<trial_id>.json`, where `<trial_id>` is the trial ID. (e.g. The data file for trial `NCI-2020-08118` would be `NCI-2020-08118.json`).  The file contents are the body of the API's response.
</details>

### `mock-data/clinical-trials`

<details>
Data files for the `/cts/mock-api/v2/trials` endpoint

These are pairs of files.

`<descriptive>-request.json` and<br>
`<descriptive>-response.json`

where `<descriptive>` is a very brief (2 or 3 word) description of the request.

The `-request` file contains the body of the HTTP **request** that is sent to the API.

The `-response` files contains the body of the HTTP **response** the API sends back.

To add new data files to this collection:

1. Launch the clinical trials search app.
2. Open the browser's Developer Tools and switch to the network tab.
3. Perform a search.
4. Find the request going to the Clinical Trials API.
5. Switch to the `Payload` tab, go to the "view source" or "raw" sub-tab and copy its contents to `<descriptive>-request.json`.
6. Switch to the `Response` tab and copy its contents to the `<descriptive>-response.json`.

Alternatively:

1. Launch the clinical trials search app.
2. Open the browser's Developer Tools and switch to the network tab.
3. Perform a search.
4. Find the request going to the Clinical Trials API.
5. Right-click and choose "Copy as curl"
6. Save the `--data-raw` value (minus the surrounding single-quotes) as `<descriptive>-request.json`.
7. Paste the command in a terminal window and add the arguments `--compressed --output '<descriptive>-response.json'`.
	 - Be sure to include the `--compressed` switch, the API doesn't send back the proper header to signal that the response is gzip'ped.
</details>

### `mock-data/diseases`

<details>

Data files for the `/cts/mock-api/v2/diseases` endpoint.

</details>

### `mock-data/interventions`

<details>

Data files for the `/cts/mock-api/v2/interventions` endpoint.

</details>

### `mock-data/terms`

<details>

Data files for the `/cts/mock-api/v2/organizations` endpoint.

</details>

### `mock-data/v2/organizations`

<details>

Data files for the `/cts/mock-api/v2/organizations` endpoint.

</details>

### `mock-data/v2/trials`

<details>

Data files for the `/v1/term/:term_key` and `/v1/terms` endpoints.

</details>

### `mock-data/zip_code_lookup`

<details>

Data files for the `/zip_code_lookup` endpoint.

These are simple JSON files containing the latitude and longitude for a given ZIP code.

File names match the ZIP code.

<details>
