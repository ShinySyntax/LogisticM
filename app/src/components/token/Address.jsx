import React from 'react'
import PropTypes from 'prop-types'
import { DrizzleContext } from "@drizzle/react-plugin";

import { Badge } from 'react-bootstrap';

class Address extends React.Component {
	render () {

		return (
			<DrizzleContext.Consumer>
        {drizzleContext => {
					const variant =
						(drizzleContext.drizzleState.accounts[0] === this.props.address)
						? 'primary'
						: 'secondary'

					return (
						<React.Fragment>
							<Badge variant={variant}>{this.props.address}</Badge>
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
