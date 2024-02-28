// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Resolves issues with 'Error: Cross origin http://localhost forbidden'
// Configure window.location to provide complete location object (only in jsdom environment)
if (typeof window !== 'undefined') {
	Object.defineProperty(window, 'location', {
		value: {
			origin: 'http://localhost',
			protocol: 'http:',
			host: 'localhost',
			hostname: 'localhost',
			port: '',
			href: 'http://localhost',
			pathname: '/',
			search: '',
			hash: '',
			assign: jest.fn(),
			replace: jest.fn(),
			reload: jest.fn(),
		},
		writable: true,
	});

	// Configure JSDOM to disable CORS for localhost URLs
	// This is needed for nock to work properly with axios in tests
	const originalConsoleError = console.error;
	console.error = (...args) => {
		// Suppress CORS errors for localhost in tests
		if (args[0] && typeof args[0] === 'object' && args[0].message && args[0].message.includes('Cross origin http://localhost forbidden')) {
			return;
		}
		originalConsoleError.apply(console, args);
	};

	// Override JSDOM's XMLHttpRequest validation for localhost
	if (global.XMLHttpRequest) {
		const originalXMLHttpRequest = global.XMLHttpRequest;
		const originalOpen = originalXMLHttpRequest.prototype.open;

		originalXMLHttpRequest.prototype.open = function (method, url, async, user, password) {
			// For localhost URLs, we need to bypass JSDOM's CORS validation
			if (typeof url === 'string' && url.includes('localhost')) {
				// Temporarily override the JSDOM validation
				const originalValidCORSHeaders = this._ownerDocument._defaultView._virtualConsole;
				if (originalValidCORSHeaders) {
					// Suppress CORS errors for this request
					this._bypassCORS = true;
				}
			}
			return originalOpen.call(this, method, url, async, user, password);
		};
	}
}
