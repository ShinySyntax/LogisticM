import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class NewProduct extends React.Component {
	initialState = {
		tokenId: null,
		purchaser: null
	}

	state = this.initialState;

	handleChangeTokenId = (event) => {
		this.setState({
			tokenId: event.target.value
		})
	}

	handleChangePurchaser = (event) => {
		this.setState({
			purchaser: event.target.value
		})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.drizzle.contracts.Logistic.methods.newItem.cacheSend(
			this.state.purchaser, this.state.tokenId
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
					placeholder="Purchaser"
					aria-label="Purchaser"
					onChange={this.handleChangePurchaser}
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

export default NewProduct;
