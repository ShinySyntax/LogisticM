import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class NewProduct extends React.Component {
	state = {
		tokenId: null
	}

	handleChange = (event) => {
		this.setState({
			tokenId: event.target.value
		})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.drizzle.contracts.Logistic.methods.newItem.cacheSend(
			this.state.tokenId
		)
	}

	render () {
		return (
			<InputGroup className="mb-3">
				<FormControl
					placeholder="Product id"
					aria-label="Product id"
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
		)
	}
}

export default NewProduct;
