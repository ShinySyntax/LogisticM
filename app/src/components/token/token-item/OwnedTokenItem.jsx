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

import TokenLink from "../token-page/TokenLink";
import { ZERO_ADDRESS, NEW_ITEM } from '../../../store/constants';
import { getPastEvents,
	getEventFilterToken } from '../../../store/events-helpers'
import { PRODUCT_EVENT_NAMES } from '../../../store/constants'

class OwnedTokenItem extends React.Component {
	state = {
		dataKey: null,
		address: null
	}

	getPendingDelivery() {
		const dataKey = this.props.drizzle.contracts.Logistic.methods
		.pendingDeliveries.cacheCall(
			this.props.tokenId
		);
		this.setState({ dataKey });
	}

	componentDidMount() {
		getPastEvents(
			this.props.drizzle,
			PRODUCT_EVENT_NAMES,
			getEventFilterToken(this.props.tokenId)
		)
		this.getPendingDelivery()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.tokenId !== prevProps.tokenId) {
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

		contract.methods.send.cacheSend(
			this.state.address,
			this.props.tokenId
		)
	}

	sendToPurchaser = () => {
		const event = this.props.drizzleState.events.events.find(event => {
			return event.event === NEW_ITEM &&
				event.returnValues.tokenId === this.props.tokenId;
		})
		this.props.drizzle.contracts.Logistic.methods.send.cacheSend(
			event.returnValues.purchaser, this.props.tokenId
		)
	}

	render () {
		const tokenInDeliveryObject = this.props.drizzleState.contracts.Logistic
			.pendingDeliveries[this.state.dataKey]
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
							{this.props.tokenId}
						</span>
						<BsChevronDoubleDown />
		      </Accordion.Toggle>
		    </Card.Header>
		    <Accordion.Collapse eventKey={this.props.idx+1}>
		      <Card.Body>
						<Container fluid>
							<Row>
								<Col md={2}>
									<TokenLink
										tokenId={this.props.tokenId}
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

OwnedTokenItem.propTypes = {
	tokenId: PropTypes.string.isRequired
};

export default OwnedTokenItem
