import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

class TokenList extends React.Component {
	initialState = {
		tokenIds: []
	}

	state = this.initialState;

	getTokens(totalSupply) {
		this.setState(this.initialState)
		for (var i = 0; i < totalSupply; i++) {
			this.props.drizzle.contracts.Logistic.methods.tokenByIndex(i)
				.call()
				.then(tokenId => {
					this.setState({ tokenIds: [tokenId, ...this.state.tokenIds]})
				})
		}
	}

	componentDidMount() {
		this.getTokens(this.props.totalSupply)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.totalSupply !== prevProps.totalSupply) {
			this.getTokens(this.props.totalSupply)
		}
	}

	render () {
		return (
			<ListGroup>
				{
					this.state.tokenIds.map((dataKey, idx) => {
						let tokenId = this.props.drizzleState.contracts.Logistic
							.tokenByIndex[dataKey]
							&& this.props.drizzleState.contracts.Logistic
								.tokenByIndex[dataKey].value

						if (!tokenId) return null

						if (this.props.tokenItemComponent) {
							return (
								<this.props.tokenItemComponent
									key={idx}
									drizzle={this.props.drizzle}
									drizzleState={this.props.drizzleState}
									tokenId={tokenId}
									idx={idx}
								/>
							)
						}
						return (
							<ListGroup.Item key={idx}>
								{tokenId}
							</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}
}

TokenList.propTypes = {
	totalSupply: PropTypes.number.isRequired,
	tokenItemComponent: PropTypes.any
};

export default TokenList;
