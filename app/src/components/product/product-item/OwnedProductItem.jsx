import React from 'react';
import { Container,
	Row,
	Col,
	Button,
	InputGroup,
	FormControl,
	Accordion,
	Card
 } from 'react-bootstrap';
import { BsChevronDoubleDown } from "react-icons/bs";
import PropTypes from 'prop-types'

import ProductLink from "../product-page/ProductLink";
import { ZERO_ADDRESS } from '../../../store/constants';
import { send, sendToPurchaser } from '../../../contract-call'
import Web3 from "web3";

class OwnedProductItem extends React.Component {
	state = {
		dataKey: null,
		account: null
	}

	getPendingDelivery() {
		const dataKey = this.props.drizzle.contracts.Logistic.methods
		.productsSentFrom.cacheCall(
			Web3.utils.keccak256(this.props.productName),
			this.props.drizzleState.accounts[0]
		);
		this.setState({ dataKey });
	}

	componentDidMount() {
		this.getPendingDelivery()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productName !== prevProps.productName) {
			this.getPendingDelivery()
		}
	}

	handleChange = (event) => {
		this.setState({ account: event.target.value })
	}

	handleSubmit = (event) => {
		event.preventDefault();
		send(this.props.drizzle, this.state.account, this.props.productName)
	}

	sendToPurchaser = () => {
		sendToPurchaser(this.props.drizzle, this.props.productName)
	}

	render () {
		const tokenInDeliveryObject = this.props.drizzleState.contracts.Logistic
			.productsSentFrom[this.state.dataKey]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value

		if (tokenInDelivery !== ZERO_ADDRESS) {
			// The token is shipped
			return null
		}

		return (
		  <Card>
		    <Card.Header>
		      <Accordion.Toggle
						as={Button}
						variant="link"
						eventKey={this.props.idx+1}
					>
						<span className="mr-2">
							{this.props.productName}
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
										productName={this.props.productName}
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
										<FormControl
											placeholder="Recipient"
											aria-label="Recipient"
											onChange={this.handleChange}
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
	productName: PropTypes.string.isRequired
};

export default OwnedProductItem
