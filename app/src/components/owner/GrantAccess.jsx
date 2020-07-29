import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class GrantAccess extends React.Component {
	state = {
		address: null,
		name: null
	};

	handleChangeAddress = (event) => {
		this.setState({ address: event.target.value })
	}

	handleChangeName = (event) => {
		this.setState({ name: event.target.value })
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { drizzle } = this.props;
    const contract = drizzle.contracts.Logistic;

		contract.methods[this.props.grandAccessMethod].cacheSend(
			this.state.address, this.state.name
		)
	}

	render () {
		return (
			<InputGroup>
				<FormControl
					placeholder="Account address"
					aria-label="Account address"
					onChange={this.handleChangeAddress}
				/>
				<FormControl
					placeholder="Account name"
					aria-label="Account name"
					onChange={this.handleChangeName}
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
