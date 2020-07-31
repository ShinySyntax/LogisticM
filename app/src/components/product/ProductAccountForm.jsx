import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

export default function({accountLabel, handleSubmit}) {
	const [productId, setProductId] = useState("");
	const [account, setAccount] = useState("");
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (submit) {
			handleSubmit(productId, account)
			setSubmit(false)
		}
	}, [submit, handleSubmit, productId, account]);

	return (
		<InputGroup className="mb-3">
			<FormControl
				placeholder="Product barcode"
				aria-label="Product barcode"
				onChange={event => setProductId(event.target.value)}
			/>
			<FormControl
				placeholder={accountLabel}
				aria-label={accountLabel}
				onChange={event => setAccount(event.target.value)}
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
