import React from 'react'

import { getEventsAboutUser } from "../../store/selectors"
import { getPastEvents } from '../../store/events-helpers'
import Loading from '../Loading';
import { PRODUCT_EVENT_NAMES, NEW_PRODUCT } from '../../store/constants'
import PurchaserPanel from "../purchaser/PurchaserPanel"
import NoUserPanel from "./NoUserPanel"

class CustomerPanel extends React.Component {
	componentDidMount () {
		getPastEvents(
			this.props.drizzle,
			PRODUCT_EVENT_NAMES,
			{
				[NEW_PRODUCT]: { purchaser: this.props.drizzleState.accounts[0] }
			}
		)
	}

	render () {
		if (!this.props.drizzleState.events.events) return <Loading/>

		let productHashList = getEventsAboutUser(
			this.props.drizzleState.events.events,
			this.props.drizzleState.accounts[0]
		)
		.filter(event => event.returnValues.productHash)
		.map(event => event.returnValues.productHash)

		productHashList = [...new Set(productHashList)];

		if (!productHashList.length) {
			return <NoUserPanel/>
		}

		return (
			<PurchaserPanel
				drizzle={this.props.drizzle}
				drizzleState={this.props.drizzleState}
				events={this.props.drizzleState.events.events}
				productHashList={productHashList}
			/>
		)
	}
}

export default CustomerPanel
