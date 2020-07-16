import React from 'react';
import PropTypes from 'prop-types'
import { Container,
	Row,
	Col,
	ListGroup,
	Button,
	Collapse,
	InputGroup,
	FormControl
 } from 'react-bootstrap';

class TokenItem extends React.Component {
	state = {
		open: false,
		address: null,
		stackId: null
	 }

	handleChange = (event) => {
		this.setState({ address: event.target.value })
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { drizzle } = this.props;
    const contract = drizzle.contracts.Logistic;

		const stackId = contract.methods.send.cacheSend(
			this.state.address,
			this.props.tokenId
		)
    this.setState({ stackId });
	}

	render () {
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
								      <Button onClick={this.handleSubmit} variant="outline-primary">Validate</Button>
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

TokenItem.propTypes = {
};

export default TokenItem;
