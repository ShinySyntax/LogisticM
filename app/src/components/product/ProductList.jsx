import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProductLink from "./product-page/ProductLink"

class ProductList extends React.Component {
	initialState = {
		tokenIds: []
	}

	state = this.initialState;

	getTokens(totalSupply) {

		if (!this.props.tokenIds) {
			this.setState(this.initialState)
			for (var i = 0; i < totalSupply; i++) {
				this.props.drizzle.contracts.Logistic.methods.tokenByIndex(i)
				.call()
				.then(tokenId => {
					this.setState({ tokenIds: [tokenId, ...this.state.tokenIds]})
				})
			}
		}
		else {
			this.setState({ tokenIds: this.props.tokenIds })
		}
	}

	componentDidMount() {
		this.getTokens(this.props.totalSupply)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.totalSupply !== prevProps.totalSupply ||
			this.props.tokenIds !== prevProps.tokenIds ) {
			this.getTokens(this.props.totalSupply)
		}
	}

	render () {
		return (
			<ListGroup>
				{
					this.state.tokenIds.map((tokenId, idx) => {
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
								<ProductLink tokenId={tokenId} />
							</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}
}

ProductList.propTypes = {
	totalSupply: PropTypes.number,
	tokenItemComponent: PropTypes.any,
	tokenIds: PropTypes.array
};

export default ProductList;
