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
import { ZERO_ADDRESS, NEW_PRODUCT } from '../../../store/constants';
import { getPastEvents } from '../../../store/events-helpers'

class OwnedProductItem extends React.Component {
	state = {
		dataKey: null,
		address: null
	}

	getPendingDelivery() {
		const dataKey = this.props.drizzle.contracts.Logistic.methods
		.productsSentFrom.cacheCall(
			this.props.productId,
			this.props.drizzleState.accounts[0]
		);
		this.setState({ dataKey });
	}

	componentDidMount() {
		getPastEvents(
			this.props.drizzle,
			[NEW_PRODUCT],
			{
				[NEW_PRODUCT]: {
					productId: this.props.productId,
					by: this.props.drizzleState.accounts[0]
				}
			}
		)
		this.getPendingDelivery()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.productId !== prevProps.productId) {
			this.getPendingDelivery()
		}
	}

	handleChange = (event) => {
		this.setState({ address: event.target.value })
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { drizzle } = this.props;
    const contract = drizzle.contracts.Logistic;

		if (this.state.address.startsWith('0x')
			&& this.state.address.length === 42) {
			contract.methods.send.cacheSend(
				this.state.address,
				this.props.productId
			)
		}
		else {
			contract.methods.sendWithName.cacheSend(
				this.state.address,
				this.props.productId
			)
		}
	}

	sendToPurchaser = () => {
		const event = this.props.drizzleState.events.events.find(event => {
			return event.event === NEW_PRODUCT &&
				event.returnValues.productId === this.props.productId;
		})
		this.props.drizzle.contracts.Logistic.methods.send.cacheSend(
			event.returnValues.purchaser, this.props.productId
		)
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
							{this.props.productId}
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
										productId={this.props.productId}
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
											placeholder="Recipient's address"
											aria-label="Recipient's address"
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
	productId: PropTypes.string.isRequired
};

export default OwnedProductItem
