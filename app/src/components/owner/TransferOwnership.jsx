import React, { useState } from 'react'

import { InputGroup, Button } from 'react-bootstrap';

import InputAddress from '../InputAddress'

export default function TransferOwnership({ drizzle, drizzleState }) {
	const [address, setAddress] = useState('');

	const handleChangeAddress = event => {
		setAddress(event.target.value)
	}

	const handleSubmit = () => {
		drizzle.contracts.LogisticM.methods.transferOwnership.cacheSend(
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
					<span>Transfer ownership</span>
				</Button>
			</InputGroup.Append>
		</InputGroup>
	)
}
