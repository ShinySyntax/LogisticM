import React from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

class ProductLink extends React.Component {
	state = {
		dataKeyProductInfo: null
	}

	getProductInfo() {
		this.setState({ dataKeyProductInfo: this.props.drizzle.contracts
			.LogisticM.methods.getProductInfo.cacheCall(this.props.productHash) })
	}

	componentDidMount() {
		if (!this.props.productName) {
			this.getProductInfo()
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productHash !== prevProps.productHash && !this.props.productName) {
			this.getProductInfo()
		}
	}

	render () {
		let productName;
		if (!this.props.productName) {
			const productInfoObject = this.props.drizzleState.contracts.LogisticM
			.getProductInfo[this.state.dataKeyProductInfo]
			if (!productInfoObject) return null
			productName = productInfoObject.value.productName
		} else {
			productName = this.props.productName
		}

		const path = `/product/${productName}`

		if (this.props.as) {
			return (
				<div>
					<Link to={path}>
						<this.props.as>
							Details
						</this.props.as>
					</Link>
				</div>
			)
		}

		return (
			<Link to={path}>
				<span>{productName}</span>
			</Link>
		)
	}
}

ProductLink.propTypes = {
	productHash: PropTypes.string,
	productName: PropTypes.string
};

export default ProductLink;
