import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProductLink from "./product-page/ProductLink"

class ProductList extends React.Component {
	initialState = {
		productNames: []
	}

	state = this.initialState;

	getTokens(totalSupply) {

		if (!this.props.productNames) {
			this.setState(this.initialState)
			for (var i = 0; i < totalSupply; i++) {
				this.props.drizzle.contracts.Logistic.methods.tokenByIndex(i)
				.call()
				.then(tokenId => {
					return this.props.drizzle.contracts.Logistic.methods
					.getProductName(tokenId).call()
				})
				.then(productName => {
					this.setState({ productNames: [productName, ...this.state.productNames]})
				})
			}
		}
		else {
			this.setState({ productNames: this.props.productNames })
		}
	}

	componentDidMount() {
		this.getTokens(this.props.totalSupply)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.totalSupply !== prevProps.totalSupply ||
			this.props.productNames !== prevProps.productNames ) {
			this.getTokens(this.props.totalSupply)
		}
	}

	render () {
		return (
			<ListGroup>
				{
					this.state.productNames.map((productName, idx) => {
						if (this.props.tokenItemComponent) {
							return (
								<this.props.tokenItemComponent
									key={idx}
									drizzle={this.props.drizzle}
									drizzleState={this.props.drizzleState}
									productName={productName}
									idx={idx}
								/>
							)
						}
						return (
							<ListGroup.Item key={idx}>
								<ProductLink productName={productName} />
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
	productNames: PropTypes.array
};

export default ProductList;
