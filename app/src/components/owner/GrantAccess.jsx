import React from 'react'
import { Form, Button } from 'react-bootstrap';

class GrantAccess extends React.Component {
	state = {
		address: null
	};

	handleChange = (event) => {
		this.setState({ address: event.target.value })
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { drizzle } = this.props;
    const contract = drizzle.contracts.Logistic;

		contract.methods[this.props.grandAccessMethod].cacheSend(
			this.state.address
		)
	}

	render () {
		return (
			<Form onSubmit={this.handleSubmit}>
			  <Form.Group controlId="account">
			    <Form.Label>Account address</Form.Label>
			    <Form.Control placeholder="0x" onChange={this.handleChange} />
			    <Form.Text className="text-muted">
			      Enter the Ethereum Address of the account to be granted.
			    </Form.Text>
			  </Form.Group>
			  <Button variant="primary" type="submit">
			    Submit
			  </Button>
			</Form>
		)
	}
}

export default GrantAccess;
