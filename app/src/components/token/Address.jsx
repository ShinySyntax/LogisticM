import React from 'react'
import PropTypes from 'prop-types'

import { Badge } from 'react-bootstrap';

class Address extends React.Component {
	state = {
		dataKey: null
	}

	getName(address) {
		this.setState({
			dataKey: this.props.drizzle.contracts.Logistic.methods.name
			.cacheCall(address)
		})
	}

	componentDidMount() {
		this.getName(this.props.address)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.address !== prevProps.address) {
			this.getName(this.props.address)
		}
	}

	render () {
		const nameObject = this.props.drizzleState.contracts.Logistic
			.name[this.state.dataKey]

		let account = this.props.address;
		
		if (nameObject && nameObject.value) {
			account = nameObject.value
			if (this.props.useAddress) {
				account = `${this.props.address} (${account})`
			}
		}

		const variant =
			(this.props.drizzleState.accounts[0] === this.props.address)
			? 'primary'
			: 'secondary'

		return (
			<React.Fragment>
				<Badge variant={variant}>{account}</Badge>
			</React.Fragment>
		)
	}
}

Address.propTypes = {
	address: PropTypes.string.isRequired,
};

export default Address;
