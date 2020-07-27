import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap';
import { newContextComponents } from "@drizzle/react-components";

import { getEventsAboutToken } from "../../store/selectors"
import History from '../token/token-page/History'

const { AccountData } = newContextComponents;

class PurchaserPanel extends React.Component {
	// { '1561561111': [event1, event2...]}
	state = {}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.tokenIds !== prevProps.tokenIds) {
			let state = {}
			this.props.tokenIds.forEach(tokenId => {
				let eventsToken = getEventsAboutToken(this.props.events, tokenId)
				state[tokenId] = eventsToken
			});
			console.log(state);
			this.setState(state);
		}
	}

	render () {
		return (
			<div>
				<div className="section">
					<h2>Logistic - Purchaser Panel</h2>

					<Card className="m-2 p-2">
						<AccountData
							drizzle={this.props.drizzle}
							drizzleState={this.props.drizzleState}
							accountIndex={0}
							units="ether"
							precision={5}
						/>
					</Card>

					{
						Object.entries(this.state).map(([tokenId, events], idx) => {
							return (
								<Card className="m-2 p-2" key={idx}>
									<Card.Title>Product id: {tokenId}</Card.Title>
									<History
										drizzle={this.props.drizzle}
										drizzleState={this.props.drizzleState}
										events={events}
									/>
								</Card>
							)
						})
					}

				</div>
			</div>
		)
	}
}

PurchaserPanel.propTypes = {
	events: PropTypes.array.isRequired, // Events about the user
	tokenIds: PropTypes.array.isRequired // Tokens for the user
};

export default PurchaserPanel;
