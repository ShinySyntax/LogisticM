import React from 'react';
import PropTypes from 'prop-types'
import { Container,
	Row,
	Col,
	ListGroup,
	Button } from 'react-bootstrap';

import { PRODUCT_SHIPPED,
 	PRODUCT_RECEIVED } from "../../../store/constants"
import ProductLink from "../product-page/ProductLink";
import { getPastEvents } from '../../../store/events-helpers'
import { receive } from '../../../contract-call'

class WillReceiveProductItem extends React.Component {
	state = {
		dataKeyProductInfo: null
	}

	getProductInfo() {
		this.setState({ dataKeyProductInfo: this.props.drizzle.contracts
			.Logistic.methods.getProductInfo.cacheCall(this.props.productHash) })
	}

	componentDidMount () {
		getPastEvents(
			this.props.drizzle,
			[PRODUCT_SHIPPED, PRODUCT_RECEIVED],
			{
				[PRODUCT_SHIPPED]: {
					to: this.props.drizzleState.accounts[0],
					productHash: this.props.productHash
				},
				[PRODUCT_RECEIVED]: {
					by: this.props.drizzleState.accounts[0],
					productHash: this.props.productHash
				}
			}
		)
		this.getProductInfo()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productHash !== prevProps.productHash) {
			this.getProductInfo()
		}
	}

	receive = () => {
		const event = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_SHIPPED &&
				event.returnValues.productHash === this.props.productHash &&
				event.returnValues.to === this.props.drizzleState.accounts[0];
		})
		receive(this.props.drizzle, this.props.drizzleState, event.returnValues.from, this.props.productHash)
	}

	render () {
		const eventShip = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_SHIPPED &&
				event.returnValues.productHash === this.props.productHash &&
				event.returnValues.to === this.props.drizzleState.accounts[0];
		})
		const eventReceive = this.props.drizzleState.events.events.find(event => {
			return event.event === PRODUCT_RECEIVED &&
				event.returnValues.productHash === this.props.productHash &&
				event.returnValues.by === this.props.drizzleState.accounts[0];
		})

		if (!eventShip || eventReceive) return null

		const productInfoObject = this.props.drizzleState.contracts.Logistic
			.getProductInfo[this.state.dataKeyProductInfo]
		if (!productInfoObject) return null
		const productName = productInfoObject.value.productName

		return (
			<ListGroup.Item>
				<Container fluid>
				  <Row>
				    <Col md={10}>
							<span className="m-2">
								<ProductLink
									productName={productName}
								/>
							</span>
						</Col>
						<Col md={1}>
							<Button
								onClick={this.receive}
								aria-controls="receive-product"
							>
								<span>Receive</span>
							</Button>
						</Col>
				  </Row>
				</Container>

			</ListGroup.Item>
		)
	}
}

WillReceiveProductItem.propTypes = {
	productHash: PropTypes.string.isRequired
};

export default WillReceiveProductItem
