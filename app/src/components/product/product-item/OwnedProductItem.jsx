import React from 'react';
import { Container,
	Row,
	Col,
	Button,
	InputGroup,
	FormControl,
	Accordion,
	Card,
	ListGroup
 } from 'react-bootstrap';
import { BsChevronDoubleDown } from "react-icons/bs";
import PropTypes from 'prop-types'

import ProductLink from "../product-page/ProductLink";
import { ZERO_ADDRESS, HANDOVER } from '../../../store/constants';
import { send, sendToPurchaser } from '../../../contract-call'
import { getEventsAboutProductHash } from '../../../store/selectors';
import InputAddress from "../../InputAddress"

class OwnedProductItem extends React.Component {
	state = {
		dataKeyProductSentFrom: null,
		dataKeyProductInfo: null,
		account: ""
	}

	getPendingDelivery() {
		const dataKeyProductSentFrom = this.props.drizzle.contracts.Logistic.methods
		.productSentFrom.cacheCall(
			this.props.productHash,
			this.props.drizzleState.accounts[0]
		);
		this.setState({ dataKeyProductSentFrom })
	}

	getProductInfo() {
		this.setState({ dataKeyProductInfo: this.props.drizzle.contracts
			.Logistic.methods.getProductInfo.cacheCall(this.props.productHash) })
	}

	componentDidMount() {
		this.getPendingDelivery()
		this.getProductInfo()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productHash !== prevProps.productHash) {
			this.getPendingDelivery()
			this.getProductInfo()
		}
	}

	handleChange = (event) => {
		this.setState({ account: event.target.value })
	}

	handleSubmit = (event) => {
		event.preventDefault()
		if (this.state.account !== "") {
			send(this.props.drizzle, this.props.drizzleState, this.state.account, this.props.productHash)
		}
	}

	sendToPurchaser = () => {
		sendToPurchaser(this.props.drizzle, this.props.drizzleState, this.props.productHash)
	}

	render () {
		let event = getEventsAboutProductHash(
			this.props.drizzleState.events.events,
			this.props.productHash
		).find(event => {
			return event.event === HANDOVER && event.returnValues.to === this.props.drizzleState.accounts[0]
		})
		if (event) {
			// there is a handover with to is ourself, so just show the product link
			// because if it show 'send to purchaser', as purchaser is ourself, transaction will fail
			return (
				<ListGroup.Item key={this.props.idx}>
					<ProductLink
						drizzle={this.props.drizzle}
						drizzleState={this.props.drizzleState}
						productHash={this.props.productHash}
					/>
				</ListGroup.Item>
			)
		}

		const tokenInDeliveryObject = this.props.drizzleState.contracts.Logistic
			.productSentFrom[this.state.dataKeyProductSentFrom]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value
		if (tokenInDelivery !== ZERO_ADDRESS) {
			// The product is shipped
			return null
		}

		const productInfoObject = this.props.drizzleState.contracts.Logistic
			.getProductInfo[this.state.dataKeyProductInfo]
		if (!productInfoObject) return null
		const productName = productInfoObject.value.productName

		return (
			<Card>
				<Card.Header>
					<Accordion.Toggle
						as={Button}
						variant="link"
						eventKey={this.props.idx+1}
					>
						<span className="mr-2">
							{productName}
						</span>
						<BsChevronDoubleDown />
					</Accordion.Toggle>
				</Card.Header>
				<Accordion.Collapse eventKey={this.props.idx+1}>
					<Card.Body>
						<Container fluid>
							<Row>
								<Col md={2}>
									<ProductLink
										productName={productName}
										as={Button}
									/>
								</Col>
								<Col md={4}>
									<Button onClick={this.sendToPurchaser}>
										<span>Send to purchaser</span>
									</Button>
								</Col>
								<Col md={6}>
									<InputGroup>
										<InputAddress
											setAddress={ account => { this.setState({account}) } }
											onChange={event => { this.setState({ account: event.target.value }) } }
										/>
										<InputGroup.Append>
											<Button
												onClick={this.handleSubmit}
												variant="outline-primary"
											>
												<span>Send</span>
											</Button>
										</InputGroup.Append>
									</InputGroup>
								</Col>
							</Row>
						</Container>
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		)
	}
}

OwnedProductItem.propTypes = {
	productHash: PropTypes.string.isRequired,
	idx: PropTypes.number.isRequired
};

export default OwnedProductItem
