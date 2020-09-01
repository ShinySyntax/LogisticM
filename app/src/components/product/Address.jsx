import React, { useState, useEffect, useRef } from 'react'

import QRCode from 'qrcode.react';
import { Badge, Overlay, Tooltip } from 'react-bootstrap';

export default function Address({ drizzle, drizzleState, address, useAddress }) {
	const [dataKey, setDataKey] = useState();
	const [show, setShow] = useState(false);
	const target = useRef(null);

	useEffect(() => {
		setDataKey(drizzle.contracts.Logistic.methods.getName
			.cacheCall(address))
	}, [setDataKey, drizzle, address]);

	const nameObject = drizzleState.contracts.Logistic.getName[dataKey]

	let account = address;

	if (nameObject && nameObject.value) {
		account = nameObject.value
		if (useAddress) {
			account = `${address} (${account})`
		}
	}

	const variant =
		(drizzleState.accounts[0] === address)
		? 'primary'
		: 'secondary'

	return (
		<React.Fragment>
			<Badge
				style={{cursor: 'pointer'}}
				ref={target}
				onClick={() => setShow(!show)}
				variant={variant}>{account}
			</Badge>
			<Overlay target={target.current} show={show} placement="bottom">
				{(props) => (
					<Tooltip id="address-qr-code" {...props}>
						<QRCode value={address} size={170} />
					</Tooltip>
				)}
			</Overlay>
		</React.Fragment>
	)
}
