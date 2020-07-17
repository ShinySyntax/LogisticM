import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

class TokenList extends React.Component {
	state = {
		dataKeyTokens: null
	};

	componentDidMount() {
		let dataKeyTokens = []
		for (var i = 0; i < this.props.n; i++) {
			dataKeyTokens.push(
				this.props.drizzle.contracts.Logistic.methods.tokenByIndex
				 .cacheCall(i)
			)
		}

		this.setState({ dataKeyTokens })
	}

	render () {
		if (!this.state.dataKeyTokens) return null

		return (
			<ListGroup>
				{
					this.state.dataKeyTokens.map((dataKey, idx) => {
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
	n: PropTypes.number.isRequired,
	tokenItemComponent: PropTypes.any
};

export default TokenList;
