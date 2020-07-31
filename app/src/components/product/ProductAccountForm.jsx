import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

export default function({accountLabel, handleSubmit}) {
	const [tokenId, setTokenId] = useState("");
	const [account, setAccount] = useState("");
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (submit) {
			handleSubmit(tokenId, account)
			setSubmit(false)
		}
	}, [submit, handleSubmit, tokenId, account]);

	return (
		<InputGroup className="mb-3">
			<FormControl
				placeholder="Product barcode"
				aria-label="Product barcode"
				onChange={event => setTokenId(event.target.value)}
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
