import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { utils } from 'ethers'

import InputAddress from "../InputAddress"

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
			this.state.address, { from: this.props.drizzleState.accounts[0]}
		)
		let nameBytes32 =  utils.formatBytes32String(this.state.name)
		contract.methods.setName.cacheSend(
			this.state.address, nameBytes32, { from: this.props.drizzleState.accounts[0]}
		)
	}

	setAddress = (address) => {
		this.setState({ address })
	}

	render () {
		return (
			<InputGroup>
				<InputAddress
					setAddress={this.setAddress}
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
