import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class ReceiveProduct extends React.Component {
	initialState = {
		tokenId: null,
		sender: null
	}

	state = this.initialState;

	handleChangeTokenId = (event) => {
		this.setState({
			tokenId: event.target.value
		})
	}

	handleChangeSender = (event) => {
		this.setState({
			sender: event.target.value
		})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.drizzle.contracts.Logistic.methods.receive.cacheSend(
			this.state.sender, this.state.tokenId
		)
	}

	render () {
		return (
			<InputGroup className="mb-3">
				<FormControl
					placeholder="Product id"
					aria-label="Product id"
					onChange={this.handleChangeTokenId}
				/>
				<FormControl
					placeholder="Sender"
					aria-label="Sender"
					onChange={this.handleChangeSender}
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
		)
	}
}

export default ReceiveProduct;
