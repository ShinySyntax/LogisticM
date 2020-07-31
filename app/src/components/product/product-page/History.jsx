import React from 'react'
import PropTypes from 'prop-types'
import { BsArrowRight } from "react-icons/bs"
import { ListGroup  } from 'react-bootstrap';

import Address from "../Address"

class History extends React.Component {
	render () {
		return (
			<ListGroup>
				{this.props.handovers.map((handover, idx) => {
					return this.renderHandover(handover, idx)
				})}
			</ListGroup>
		)
	}

	renderHandover(handover, idx) {
		return (
			<ListGroup.Item key={idx}>
				<p>
					<Address
						drizzle={this.props.drizzle}
						drizzleState={this.props.drizzleState}
						address={handover.returnValues.from}
					/>
					<BsArrowRight size={25} />
					<Address
						drizzle={this.props.drizzle}
						drizzleState={this.props.drizzleState}
						address={handover.returnValues.to}
					/>
				</p>
			</ListGroup.Item>
		)
	}
}

History.propTypes = {
	// Handover events about the tokenId we want to see
	handovers: PropTypes.array.isRequired,
};

export default History;
