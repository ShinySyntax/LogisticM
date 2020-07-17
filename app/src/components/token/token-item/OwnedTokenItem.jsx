import React from 'react';
import { Container,
	Row,
	Col,
	ListGroup,
	Button,
	Collapse,
	InputGroup,
	FormControl
 } from 'react-bootstrap';
import { BsChevronDoubleRight } from "react-icons/bs";

import { ZERO_ADDRESS } from '../../../utils/constants';

class OwnedTokenItem extends React.Component {
	state = {
		dataKey: null,
		show: true,
		open: false,
		address: null
	}

	componentDidMount() {
		const dataKey = this.props.drizzle.contracts.Logistic.methods
			.pendingDeliveries.cacheCall(
			this.props.tokenId
		);
		this.setState({ dataKey });
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

	sendToBuyer = () => {
		this.props.drizzle.contracts.Logistic.methods.sendToBuyer.cacheSend(
			this.props.tokenId
		)
	}

	render () {
		const tokenInDeliveryObject = this.props.drizzleState.contracts.Logistic
			.pendingDeliveries[this.state.dataKey]
		if (!tokenInDeliveryObject) return null
		const tokenInDelivery = tokenInDeliveryObject.value

		if (tokenInDelivery !== ZERO_ADDRESS) return null

		return (
			<ListGroup.Item>
				<Container fluid>
					<Row>
						<Col md={1}>
							<span className="m-2">
								{ this.props.tokenId }
							</span>
						</Col>
						<Col md={1}>
							<Button
								onClick={() => this.setState({ open: !this.state.open })}
								aria-controls="send-product"
								aria-expanded={this.state.open}
							>
								<BsChevronDoubleRight />
							</Button>
						</Col>
						<Col md={10}>
							<Collapse
								in={this.state.open}
								timeout={0}
								className="ml-5"
							>
								<div id="send-product">
									<Container fluid>
										<Row>
											<Col md={1}>
												<Button onClick={this.sendToBuyer}>
													<span>Send to buyer</span>
												</Button>
											</Col>
											<Col>
												<InputGroup>
													<FormControl
														placeholder="Recipient's address"
														aria-label="Recipient's address"
														aria-describedby="basic-addon2"
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
								</div>
							</Collapse>
						</Col>
				  </Row>
				</Container>
			</ListGroup.Item>
		)
	}
}

export default OwnedTokenItem;
