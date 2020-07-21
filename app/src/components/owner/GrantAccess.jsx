import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

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
			<InputGroup>
				<FormControl
					placeholder="Account address"
					aria-label="Account address"
					onChange={this.handleChange}
				/>
				<InputGroup.Append>
					<Button
						onClick={this.handleSubmit}
						variant="outline-primary"
					>
						<span>Grant access</span>
					</Button>
				</InputGroup.Append>
			</InputGroup>
		)
	}
}

export default GrantAccess;
