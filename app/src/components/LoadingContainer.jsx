import React from 'react'

import Loading from './Loading';

class LoadingContainer extends React.Component {
	render () {
		if (this.props.initialized &&
			this.props.drizzleState &&
			this.props.drizzleState.web3.status === "initialized") {
			return React.Children.only(this.props.children);
		}

		return <Loading/>
	}
}

export default LoadingContainer;
