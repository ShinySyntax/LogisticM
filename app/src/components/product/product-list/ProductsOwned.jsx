import React from 'react'
import { ListGroup, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProductItem from "../product-item/ProductItem"

class ProductsOwned extends React.Component {
	initialState = {
		productHashList: []
	}

	state = this.initialState;

	getProducts(balance) {
		this.setState(this.initialState)
		for (var i = 0; i < balance; i++) {
			this.props.drizzle.contracts.Logistic.methods.tokenOfOwnerByIndex(
				this.props.drizzleState.accounts[0], i).call()
			.then(tokenId => {
				return this.props.drizzle.contracts.Logistic.methods.getHashFromTokenId(tokenId).call()
			})
			.then(productHash => {
				this.setState({ productHashList: [productHash, ...this.state.productHashList]})
			})
		}
	}

	componentDidMount() {
		this.getProducts(this.props.balance)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.balance !== prevProps.balance) {
			this.getProducts(this.props.balance)
		}
	}

	renderRow = (productHash, idx) => {
		if (this.props.productItemComponent) {
			return (
				<this.props.productItemComponent
					key={idx}
					drizzle={this.props.drizzle}
					drizzleState={this.props.drizzleState}
					productHash={productHash}
					idx={idx}
				/>
			)
		}
		return (
			<ProductItem
				key={idx}
				drizzle={this.props.drizzle}
				drizzleState={this.props.drizzleState}
				productHash={productHash}
				idx={idx}
			/>
		)
	}

	render () {
		return (
			<Accordion>
				{
					this.state.productHashList.map((productHash, idx) => {
						return this.renderRow(productHash, idx)
					})
				}
			</Accordion>
		)
	}
}

ProductsOwned.propTypes = {
	balance: PropTypes.number.isRequired,
	productItemComponent: PropTypes.any
};

export default ProductsOwned;
