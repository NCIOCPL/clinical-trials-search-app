const zip_codes = require('./test_data/zip_codes.json');

/**
 * Mock ZIP code to Geolocation service.
 * 
 * Responds to requests sent to /service/zip_lookup/ZIP_CODE
 * where ZIP_CODE is the zip code to lookup.
 * 
 * The actual path will likely change.
 */
module.exports = function(app) {

    app.use(
        '/service/zip_lookup/:zip_code',
        function (req, res) {

            const zip = req.params.zip_code;
            const loc = zip_codes[zip];

            if( loc != null ) {
                res
                    .status(200)
                    .json(loc);
            }
            else {
                res.sendStatus(404);
            }

        }
    );
};