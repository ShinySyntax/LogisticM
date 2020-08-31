import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ProductLink from "../product-page/ProductLink"

class ProductList extends React.Component {
	initialState = {
		productNameList: []
	}

	state = this.initialState;

	getProducts(totalSupply) {
		this.setState(this.initialState)
		for (var i = 0; i < totalSupply; i++) {
			this.props.drizzle.contracts.Logistic.methods.tokenByIndex(i)
			.call()
			.then(tokenId => {
				return this.props.drizzle.contracts.Logistic.methods.getHashFromTokenId(tokenId).call()
			})
			.then(productHash => {
				return this.props.drizzle.contracts.Logistic.methods.getProductInfo(productHash).call()
			})
			.then(productInfo => {
				return productInfo.productName
			})
			.then(productName => {
				this.setState({ productNameList: [productName, ...this.state.productNameList]})
			})
		}
	}

	componentDidMount() {
		this.getProducts(this.props.totalSupply)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.totalSupply !== prevProps.totalSupply ||
			this.props.productNameList !== prevProps.productNameList ) {
			this.getProducts(this.props.totalSupply)
		}
	}

	render () {
		return (
			<ListGroup>
				{this.state.productNameList.map((productName, idx) => {
					return (
						<ListGroup.Item key={idx}>
							<ProductLink productName={productName} />
						</ListGroup.Item>
					)
				})}
			</ListGroup>
		)
	}
}

ProductList.propTypes = {
	totalSupply: PropTypes.number
};

export default ProductList;
