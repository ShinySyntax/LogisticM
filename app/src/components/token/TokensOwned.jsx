import React from 'react'
import { ListGroup, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';

import TokenLink from "./token-page/TokenLink"

class TokensOwned extends React.Component {
	initialState = {
		tokenIds: []
	}

	state = this.initialState;

	getTokens(balance) {
		this.setState(this.initialState)
		for (var i = 0; i < balance; i++) {
			this.props.drizzle.contracts.Logistic.methods.tokenOfOwnerByIndex(
				this.props.drizzleState.accounts[0], i)
				.call()
				.then(tokenId => {
					this.setState({ tokenIds: [tokenId, ...this.state.tokenIds]})
				})
		}
	}

	componentDidMount() {
		this.getTokens(this.props.balance)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.balance !== prevProps.balance) {
			this.getTokens(this.props.balance)
		}
	}

	renderRow = (tokenId, idx) => {
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
				<TokenLink tokenId={tokenId} />
			</ListGroup.Item>
		)
	}

	render () {
		return (
			<Accordion>
				{
					this.state.tokenIds.map((tokenId, idx) => {
						return this.renderRow(tokenId, idx)
					})
				}
			</Accordion>
		)
	}
}

TokensOwned.propTypes = {
	balance: PropTypes.number.isRequired,
	tokenItemComponent: PropTypes.any
};

export default TokensOwned;
