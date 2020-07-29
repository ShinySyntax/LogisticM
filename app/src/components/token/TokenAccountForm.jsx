import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class TokenAccountForm extends React.Component {
	initialState = {
		tokenId: null,
		account: null
	}

	state = this.initialState;

	handleChangeTokenId = (event) => {
		this.setState({
			tokenId: event.target.value
		})
	}

	handleChangeSender = (event) => {
		this.setState({
			account: event.target.value
		})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.callBack(this.state.tokenId, this.state.account)
	}

	render () {
		return (
			<InputGroup className="mb-3">
				<FormControl
					placeholder="Token id"
					aria-label="Token id"
					onChange={this.handleChangeTokenId}
				/>
				<FormControl
					placeholder={this.props.accountLabel}
					aria-label={this.props.accountLabel}
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

export default TokenAccountForm;
