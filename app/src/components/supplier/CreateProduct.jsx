import React, { useState, useEffect } from 'react';
import { Form, Col, FormControl, InputGroup, Button } from 'react-bootstrap';
import { createProduct } from '../../contract-call'
import InputAddress from "../InputAddress"

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
		<Form>
			<Form.Row>
				<Form.Group as={Col}>
					<FormControl
						placeholder="Product barcode"
						aria-label="Product barcode"
						onChange={event => setProductId(event.target.value)}
					/>
				</Form.Group>
				<Form.Group as={Col}>
					<FormControl
						placeholder="Product name (id)"
						aria-label="Product name (id)"
						onChange={event => setProductName(event.target.value)}
					/>
				</Form.Group>
			</Form.Row>
			<Form.Row>
				<Form.Group as={Col}>
					<FormControl
						placeholder="Purchaser name"
						aria-label="Purchaser name"
						onChange={event => setPurchaserName(event.target.value)}
					/>
				</Form.Group>
				<Form.Group as={Col}>
					<InputGroup>
						<InputAddress
							setAddress={ account => { setAccount(account) } }
							onChange={event => setAccount(event.target.value)}
							placeholder="Purchaser address"
						/>
					</InputGroup>
				</Form.Group>
			</Form.Row>
			<Form.Row>
				<Form.Group as={Col}>
					<Button
						onClick={event => {event.preventDefault(); setSubmit(true)}}
						variant="outline-primary"
						>
						Validate
					</Button>
				</Form.Group>
			</Form.Row>
		</Form>
	)
}
