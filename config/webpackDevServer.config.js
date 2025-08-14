'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const paths = require('./paths');
const fs = require('fs');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function (proxy, allowedHost) {
	const config = {
		// This should be updated with a list of allowed hosts
		allowedHosts: ['localhost', allowedHost],
		// Enable gzip compression of generated files.
		compress: true,
		client: {
			logging: 'none',
			overlay: false,
		},
		devMiddleware: {
			publicPath: (paths.publicUrl || '/').slice(0, -1) || '/',
		},
		static: {
			directory: paths.appPublic,
			publicPath: (paths.publicUrl || '/').slice(0, -1) || '/',
			watch: {
				ignored: ignoredFiles(paths.appSrc),
			},
		},
		// Enable HTTPS if the HTTPS environment variable is set to 'true'
		server: protocol === 'https' ? 'https' : 'http',
		host,
		historyApiFallback: {
			// Paths with dots should still use the history fallback.
			// See https://github.com/facebook/create-react-app/issues/387.
			disableDotRule: true,
			// Exclude static assets from history fallback
			rewrites: [
				{ from: /^\/static\//, to: function(context) {
					return context.parsedUrl.pathname;
				}}
			]
		},
		proxy,
		webSocketServer: 'ws',
		setupMiddlewares: (middlewares, devServer) => {
			if (fs.existsSync(paths.proxySetup)) {
				// This registers user provided middleware for proxy reasons
				require(paths.proxySetup)(devServer.app);
			}

			// This lets us fetch source contents from webpack for the error overlay
			devServer.app.use(evalSourceMapMiddleware(devServer));
			// This lets us open files from the runtime error overlay.
			devServer.app.use(errorOverlayMiddleware());

			// This service worker file is effectively a 'no-op' that will reset any
			// previous service worker registered for the same host:port combination.
			// We do this in development to avoid hitting the production cache if
			// it used the same host and port.
			// https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
			devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrl));

			return middlewares;
		},
	};

	// Filter out any properties that might be added by react-dev-utils that are not valid for webpack-dev-server
	const validKeys = [
		'allowedHosts', 'bonjour', 'client', 'compress', 'devMiddleware', 'headers',
		'historyApiFallback', 'host', 'hot', 'ipc', 'liveReload', 'onListening',
		'open', 'port', 'proxy', 'server', 'app', 'setupExitSignals',
		'setupMiddlewares', 'static', 'watchFiles', 'webSocketServer'
	];

	const filteredConfig = {};
	validKeys.forEach(key => {
		if (config[key] !== undefined) {
			filteredConfig[key] = config[key];
		}
	});

	return filteredConfig;
};
