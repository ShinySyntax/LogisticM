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

import { ZERO_ADDRESS } from '../../../utils/constants';

class OwnedTokenItem extends React.Component {
	state = {
		show: true,
		open: false,
		address: null
	}

	componentDidMount() {
		this.tokenOwnedFilter(this.props.tokenId)
			.then(show => this.setState({ show }))
	}

	tokenIsInDelivery = (tokenId) => {
		return this.props.drizzle.contracts.Logistic.methods
			.pendingDeliveries(tokenId).call()
				.then(receiverAccount => receiverAccount !== ZERO_ADDRESS );
	}

	tokenOwnedFilter = (tokenId) => {
		return this.tokenIsInDelivery(tokenId)
			.then(inDelivery => !inDelivery)
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

	render () {
		if (!this.state.show) return null

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
								aria-controls="send-token"
								aria-expanded={this.state.open}
								>
								<span>Send</span>
							</Button>
						</Col>
						<Col md={10}>
							<Collapse
								in={this.state.open}
								timeout={0}
								className="ml-5"
								>
								<div id="send-token">
									<InputGroup className="mb-3">
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
												Validate
											</Button>
								    </InputGroup.Append>
								  </InputGroup>
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
