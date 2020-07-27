import React from 'react'
import PropTypes from 'prop-types'
import { DrizzleContext } from "@drizzle/react-plugin";

import { Badge } from 'react-bootstrap';

class Address extends React.Component {
	render () {

		return (
			<DrizzleContext.Consumer>
        {drizzleContext => {
					let you = ""
					if (drizzleContext.drizzleState.accounts[0] === this.props.address) {
						you += ' (you)'
					}

					return (
						<React.Fragment>
							<Badge variant="info">{this.props.address}</Badge>
							<span className="text-secondary">{you}</span>
						</React.Fragment>
					)
				}}
			</DrizzleContext.Consumer>
		)
	}
}

Address.propTypes = {
	address: PropTypes.string.isRequired,
};

export default Address;
