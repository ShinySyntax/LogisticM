import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

export default function({ drizzle}) {
	const [productId, setProductId] = useState("");
	const [account, setAccount] = useState("");
	const [name, setName] = useState("");
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (submit) {
			drizzle.contracts.Logistic.methods.createProductWithName
			.cacheSend(account, productId, name)
			setSubmit(false)
		}
	}, [submit, productId, account, name,
		drizzle.contracts.Logistic.methods.createProductWithName]);

	return (
		<InputGroup className="mb-3">
			<FormControl
				placeholder="Product barcode"
				aria-label="Product barcode"
				onChange={event => setProductId(event.target.value)}
			/>
			<FormControl
				placeholder="Purchaser address"
				aria-label="Purchaser address"
				onChange={event => setAccount(event.target.value)}
			/>
			<FormControl
				placeholder="Purchaser name (optional)"
				aria-label="Purchaser name (optional)"
				onChange={event => setName(event.target.value)}
			/>
			<InputGroup.Append>
				<Button
					onClick={event => {event.preventDefault();setSubmit(true)}}
					variant="outline-primary"
				>
					Validate
				</Button>
			</InputGroup.Append>
		</InputGroup>
	)
}
