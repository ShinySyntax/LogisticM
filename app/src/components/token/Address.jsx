import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Badge } from 'react-bootstrap';

export default function Address({ drizzle, drizzleState, address, useAddress }) {
	const [dataKey, setDataKey] = useState();

  useEffect(() => {
		setDataKey(drizzle.contracts.Logistic.methods.name.cacheCall(address))
	}, [setDataKey, drizzle, address]);

	const nameObject = drizzleState.contracts.Logistic.name[dataKey]

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
			<Badge variant={variant}>{account}</Badge>
		</React.Fragment>
	)
}
