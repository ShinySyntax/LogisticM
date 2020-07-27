import React from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

class TokenLink extends React.Component {
	render () {
		const path = `/product/${this.props.tokenId}`

		if (this.props.as) {
			return (
				<div>
					<Link to={path}>
						<this.props.as>
							Details
						</this.props.as>
					</Link>
				</div>
			)
		}

		return (
			<Link to={path}>
					<span>{this.props.tokenId}</span>
			</Link>
		)
	}
}

TokenLink.propTypes = {
	tokenId: PropTypes.string.isRequired,
	label: PropTypes.string
};

export default TokenLink;
