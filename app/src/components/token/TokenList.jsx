import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

class TokenList extends React.Component {
	state = {
		dataKeyToken: null
	};

	componentDidMount() {
		let dataKeyToken = []
		for (var i = 0; i < this.props.n; i++) {
			dataKeyToken.push(
				this.props.drizzle.contracts.Logistic.methods.tokenByIndex
				 .cacheCall(i)
			)
		}

		this.setState({ dataKeyToken })
	}

	render () {
		if (!this.state.dataKeyToken) return null

		return (
			<ListGroup>
				{
					this.state.dataKeyToken.map((tokenDataKey, idx) => {
						return (
							<ListGroup.Item key={idx}>
								{ this.props.drizzleState.contracts.Logistic
									.tokenByIndex[tokenDataKey]
								 	&& this.props.drizzleState.contracts.Logistic
										.tokenByIndex[tokenDataKey].value }
							</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}
}

TokenList.propTypes = {
	n: PropTypes.number.isRequired
};

export default TokenList;
