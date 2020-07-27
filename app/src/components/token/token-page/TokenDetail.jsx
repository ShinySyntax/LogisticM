import React from 'react'
import { Card } from 'react-bootstrap';
import { connect } from "react-redux";

import { PRODUCT_EVENT_NAMES } from '../../../utils/constants'
import EventList from '../event/EventList';
import History from './History'
import { getPastEvents, getEventFilterToken } from '../../../utils/events-helpers'
import { getEventsAboutToken } from "../../../store/selectors"
import Loading from '../../Loading';

class TokenDetail extends React.Component {
	getEvents () {
		const { drizzle } = this.props;
		const web3 = drizzle.web3;

		const contract = new web3.eth.Contract(
			drizzle.contracts.Logistic.abi,
			drizzle.contracts.Logistic.address
		)

		getPastEvents(
			contract,
			PRODUCT_EVENT_NAMES,
			this.filters
		)
	}

	componentDidMount () {
		this.filters = getEventFilterToken(this.props.match.params.tokenId)
		this.getEvents()
	}

	render () {
		if (!this.props.events) return <Loading/>

		let tokenId = this.props.match.params.tokenId
		let events = getEventsAboutToken(this.props.events, tokenId)

		if (!events.length) {
			return (
				<div className="section">
					<h2>Logistic - Product Details</h2>
					<Card className="m-2 p-2">
						<p>This product does not exists.</p>
					</Card>
				</div>
			)
		}

		return (
			<div className="section">
				<h2>Logistic - Product Details</h2>
				<p>Product id: <em>{this.props.match.params.tokenId}</em></p>

				<Card className="m-2 p-2">
					<Card.Title>History</Card.Title>
					<History
						drizzle={this.props.drizzle}
						drizzleState={this.props.drizzleState}
						events={events}
					/>
				</Card>

				<Card className="m-2 p-2">
					<Card.Title>Activity</Card.Title>
						<EventList
							drizzle={this.props.drizzle}
							drizzleState={this.props.drizzleState}
							eventNames={PRODUCT_EVENT_NAMES}
							showAll={true}
							filters={this.filters}
							filter={{ tokenId }}
						/>
				</Card>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return { events: state.eventsReducer.events }
};

export default connect(mapStateToProps)(TokenDetail)
