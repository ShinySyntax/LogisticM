import React from 'react'
import { connect } from "react-redux";

import { getEventsAboutUser } from "../../store/selectors"
import { getPastEvents } from '../../utils/events-helpers'
import Loading from '../Loading';
import { PRODUCT_EVENT_NAMES } from '../../utils/constants'
import PurchaserPanel from "../purchaser/PurchaserPanel"
import NoUserPanel from "./NoUserPanel"

class CustomerPanel extends React.Component {
	getEvents () {
		const { drizzle } = this.props;
		const web3 = drizzle.web3;
		// TODO: refactor this
		const contract = new web3.eth.Contract(
			drizzle.contracts.Logistic.abi,
			drizzle.contracts.Logistic.address
		)

		getPastEvents(
			contract,
			PRODUCT_EVENT_NAMES,
			{}
		)
	}

	componentDidMount () {
		this.getEvents()
	}

	render () {
		if (!this.props.events) return <Loading/>

		let eventsUser = getEventsAboutUser(
			this.props.events,
			this.props.drizzleState.accounts[0]
		)

		let tokenIds = []
		eventsUser.forEach(event => {
			tokenIds.push(event.returnValues.tokenId)
		});

		if (!eventsUser.length) {
			return <NoUserPanel/>
		}

		return (
			<PurchaserPanel
				drizzle={this.props.drizzle}
				drizzleState={this.props.drizzleState}
				events={this.props.events}
				tokenIds={tokenIds}
			/>
		)
	}
}

const mapStateToProps = state => {
	return { events: state.eventsReducer.events }
};

export default connect(mapStateToProps)(CustomerPanel)
