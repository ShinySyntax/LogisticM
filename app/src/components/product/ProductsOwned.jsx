import React from 'react'
import { ListGroup, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProductLink from "./product-page/ProductLink"

class ProductsOwned extends React.Component {
	initialState = {
		productIds: []
	}

	state = this.initialState;

	getTokens(balance) {
		this.setState(this.initialState)
		for (var i = 0; i < balance; i++) {
			this.props.drizzle.contracts.Logistic.methods.tokenOfOwnerByIndex(
				this.props.drizzleState.accounts[0], i)
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

	componentDidMount() {
		this.getTokens(this.props.balance)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.balance !== prevProps.balance) {
			this.getTokens(this.props.balance)
		}
	}

	renderRow = (productId, idx) => {
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
	}

	render () {
		return (
			<Accordion>
				{
					this.state.productIds.map((productId, idx) => {
						return this.renderRow(productId, idx)
					})
				}
			</Accordion>
		)
	}
}

ProductsOwned.propTypes = {
	balance: PropTypes.number.isRequired,
	tokenItemComponent: PropTypes.any
};

export default ProductsOwned;
