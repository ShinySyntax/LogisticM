import React from 'react'
import { Card } from 'react-bootstrap';

import { PRODUCT_EVENT_NAMES, HANDOVER } from '../../../store/constants'
import EventList from '../event/EventList';
import History from './History'
import { getPastEvents,
	getEventFilterProduct } from '../../../store/events-helpers'
import { getEventsAboutProductName } from "../../../store/selectors"
import Loading from '../../loading/Loading';
import ProductLink from './ProductLink'

class ProductDetail extends React.Component {
	componentDidMount () {
		this.filters = getEventFilterProduct(this.props.match.params.productName)
		getPastEvents(
			this.props.drizzle,
			PRODUCT_EVENT_NAMES,
			this.filters
		)
	}

	render () {
		if (!this.props.drizzleState.events.events) return <Loading/>

		const productName = this.props.match.params.productName
		const events = getEventsAboutProductName(this.props.drizzleState.events.events,
			productName)
		const handovers = events.filter(event => event.event === HANDOVER)

		if (!events.length) {
			return (
				<div className="section">
					<h2>Product Details</h2>
					<Card className="m-2 p-2">
						<p>This product does not exists.</p>
					</Card>
				</div>
			)
		}

		return (
			<div className="section">
				<h2>LogisticM - Product Details</h2>
				<p>Product id: <strong>
					<ProductLink productName={productName} /></strong></p>

				<Card className="m-2 p-2">
					<Card.Title>History</Card.Title>
					<History
						drizzle={this.props.drizzle}
						drizzleState={this.props.drizzleState}
						handovers={handovers}
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
							filter={{ productName }}
						/>
				</Card>
			</div>
		)
	}
}

export default ProductDetail
