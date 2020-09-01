import React, { useState } from 'react'
import { InputGroup, Button } from 'react-bootstrap';

import InputAddress from '../InputAddress'

export default function RevokeRole({ drizzle, drizzleState, methodName }) {
	const [address, setAddress] = useState('');

	const handleChangeAddress = event => {
		setAddress(event.target.value)
	}

	const handleSubmit = () => {
		drizzle.contracts.Logistic.methods[methodName].cacheSend(
			address,
			{ from: drizzleState.accounts[0] }
		)
	}

	return (
		<InputGroup>
			<InputAddress
				setAddress={setAddress}
				onChange={handleChangeAddress}
			/>
			<InputGroup.Append>
				<Button
					onClick={handleSubmit}
					variant="outline-primary"
				>
					<span>Revoke access</span>
				</Button>
			</InputGroup.Append>
		</InputGroup>
	)
}
