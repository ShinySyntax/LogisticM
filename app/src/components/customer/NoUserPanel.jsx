import React from 'react'
import { Card } from 'react-bootstrap';

function NoUserPanel() {
	return (
		<div className="section">
			<h2>LogisticM</h2>

			<Card className="m-2 p-2">
				<p>You are not a user of the dApp</p>
			</Card>
		</div>
	)
}

export default NoUserPanel;
