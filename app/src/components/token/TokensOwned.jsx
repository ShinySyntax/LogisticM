import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

class TokensOwned extends React.Component {
	state = {
		dataKeyTokenIds: null
	};

	cacheCallTokens(balance) {
		let dataKeyTokenIds = []
		for (var i = 0; i < balance; i++) {
			dataKeyTokenIds.push(
				this.props.drizzle.contracts.Logistic.methods.tokenOfOwnerByIndex
				.cacheCall(this.props.drizzleState.accounts[0], i)
			)
		}
		this.setState({ dataKeyTokenIds })
	}

	componentDidMount() {
		this.cacheCallTokens(this.props.balance)
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.balance !== nextProps.balance) {
			this.cacheCallTokens(nextProps.balance)
		}
	}

	renderRow = (dataKey, idx) => {
		let tokenId = this.props.drizzleState.contracts.Logistic
			.tokenOfOwnerByIndex[dataKey]
			&& this.props.drizzleState.contracts.Logistic
				.tokenOfOwnerByIndex[dataKey].value

		if (!tokenId) return null

		if (this.props.tokenItemComponent) {
			return (
				<this.props.tokenItemComponent
					key={idx}
					drizzle={this.props.drizzle}
					drizzleState={this.props.drizzleState}
					tokenId={tokenId}
				/>
			)
		}
		return (
			<ListGroup.Item key={idx}>
				{tokenId}
			</ListGroup.Item>
		)
	}

	render () {
		if (!this.state.dataKeyTokenIds) return null

		return (
			<ListGroup>
				{
					this.state.dataKeyTokenIds.map((dataKey, idx) => {
						return this.renderRow(dataKey, idx)
					})
				}
			</ListGroup>
		)
	}
}

TokensOwned.propTypes = {
	balance: PropTypes.number.isRequired,
	tokenItemComponent: PropTypes.any
};

export default TokensOwned;
