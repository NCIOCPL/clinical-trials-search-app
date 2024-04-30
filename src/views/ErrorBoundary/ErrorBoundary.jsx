// ErrorBoundary.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GenericErrorPage from './GenericErrorPage';
import PageNotFound from './PageNotFound';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			hasError: false,
		};
	}

	static getDerivedStateFromError(error) {
		return {
			error,
			hasError: true,
		};
	}

	componentDidCatch(error, errorInfo) {
		console.error('Error caught by ErrorBoundary:', error, errorInfo);
	}

	render() {
		const { error, hasError } = this.state;

		if (hasError) {
			if (error.response && error.response.status === 404) {
				return <PageNotFound />;
			} else {
				return <GenericErrorPage />;
			}
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,
};

export default ErrorBoundary;
