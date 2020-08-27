import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { createProduct } from '../../contract-call'

export default function({ drizzle, drizzleState }) {
	const [productId, setProductId] = useState("");
	const [account, setAccount] = useState("");
	const [productName, setProductName] = useState("");
	const [purchaserName, setPurchaserName] = useState("");
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (submit) {
			createProduct(drizzle, drizzleState, account, productId, productName, purchaserName)
			setSubmit(false)
		}
	}, [submit, productId, account, purchaserName, productName, drizzle, drizzleState]);

	return (
		<InputGroup className="mb-3">
			<FormControl
				placeholder="Product barcode"
				aria-label="Product barcode"
				onChange={event => setProductId(event.target.value)}
			/>
			<FormControl
				placeholder="Product name (id)"
				aria-label="Product name (id)"
				onChange={event => setProductName(event.target.value)}
			/>
			<FormControl
				placeholder="Purchaser address"
				aria-label="Purchaser address"
				onChange={event => setAccount(event.target.value)}
			/>
			<FormControl
				placeholder="Purchaser name"
				aria-label="Purchaser name"
				onChange={event => setPurchaserName(event.target.value)}
			/>
			<InputGroup.Append>
				<Button
					onClick={event => {event.preventDefault(); setSubmit(true)}}
					variant="outline-primary"
				>
					Validate
				</Button>
			</InputGroup.Append>
		</InputGroup>
	)
}
