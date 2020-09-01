import React, { useState } from 'react'
import QrReader from 'react-qr-reader'
import { BsCamera } from "react-icons/bs";
import { InputGroup, FormControl, Button, Modal } from 'react-bootstrap'

export default function InputAddress({ setAddress, onChange }) {
	const [show, setShow] = useState();
	const [scannedAddress, setScannedAddress] = useState('');

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleScan = data => {
		if (data) {
			setScannedAddress(data)
			setAddress(data)
			setShow(false)
		}
	}

	const handleChange = event => {
		onChange(event)
		setScannedAddress(event.target.value)
	}

	const handleError = err => {
		console.error(err)
	}

	return (
		<>
			<FormControl
				placeholder="Address"
				aria-label="Address"
				aria-describedby="Address"
				onChange={handleChange}
				value={scannedAddress}
			/>
			<InputGroup.Append>
				<Button onClick={handleShow} variant="outline-secondary"><BsCamera /></Button>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Scan the address</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<QrReader
							delay={300}
							onError={handleError}
							onScan={handleScan}
							style={{ width: '100%' }}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			</InputGroup.Append>
		</>
	)
}
