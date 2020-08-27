import React from 'react'
import { ListGroup, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProductLink from "./product-page/ProductLink"

class ProductsOwned extends React.Component {
	initialState = {
		productHashList: []
	}

	state = this.initialState;

	getTokens(balance) {
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
		this.getTokens(this.props.balance)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.balance !== prevProps.balance) {
			this.getTokens(this.props.balance)
		}
	}

	renderRow = (productHash, idx) => {
		if (this.props.tokenItemComponent) {
			return (
				<this.props.tokenItemComponent
					key={idx}
					drizzle={this.props.drizzle}
					drizzleState={this.props.drizzleState}
					productHash={productHash}
					idx={idx}
				/>
			)
		}
		return (
			<ListGroup.Item key={idx}>
				<ProductLink productHash={productHash} />
			</ListGroup.Item>
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
	tokenItemComponent: PropTypes.any
};

export default ProductsOwned;
