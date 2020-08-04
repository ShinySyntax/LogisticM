import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProductLink from "./product-page/ProductLink"

class ProductList extends React.Component {
	initialState = {
		productIds: []
	}

	state = this.initialState;

	getTokens(totalSupply) {

		if (!this.props.productIds) {
			this.setState(this.initialState)
			for (var i = 0; i < totalSupply; i++) {
				this.props.drizzle.contracts.Logistic.methods.tokenByIndex(i)
				.call()
				.then(tokenId => {
					return this.props.drizzle.contracts.Logistic.methods
					.getProductName(tokenId).call()
				})
				.then(productName => {
					this.setState({ productIds: [productName, ...this.state.productIds]})
				})
			}
		}
		else {
			this.setState({ productIds: this.props.productIds })
		}
	}

	componentDidMount() {
		this.getTokens(this.props.totalSupply)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.totalSupply !== prevProps.totalSupply ||
			this.props.productIds !== prevProps.productIds ) {
			this.getTokens(this.props.totalSupply)
		}
	}

	render () {
		return (
			<ListGroup>
				{
					this.state.productIds.map((productId, idx) => {
						if (this.props.tokenItemComponent) {
							return (
								<this.props.tokenItemComponent
									key={idx}
									drizzle={this.props.drizzle}
									drizzleState={this.props.drizzleState}
									productId={productId}
									idx={idx}
								/>
							)
						}
						return (
							<ListGroup.Item key={idx}>
								<ProductLink productId={productId} />
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
	productIds: PropTypes.array
};

export default ProductList;
