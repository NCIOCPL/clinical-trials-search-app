const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/cts_api/**',
    proxy({ 
      target : 'https://ncigovcdode283.prod.acquia-sites.com',
      changeOrigin: true,
    })
  );
}