import React from 'react'

import Loading from './Loading';

import LogisticInterface from "../../contracts/LogisticInterface.json";
import { EVENT_NAMES } from "../../store/constants";

class ContractLoader extends React.Component {
	state = {
		contractAdded: false
	}

	componentDidMount() {
		const contractRegistryWeb3 = new this.props.drizzle.web3.eth.Contract(
			this.props.drizzle.contracts.OwnedRegistry.abi,
			this.props.drizzle.contracts.OwnedRegistry.address
		)
		contractRegistryWeb3.getPastEvents("ProxyCreated", { fromBlock: 0 })
		.then(events => {
			let proxyAddress = events[0].returnValues.proxy
			var contractConfig = {
				contractName: "Logistic",
				web3Contract: new this.props.drizzle.web3.eth.Contract(
					LogisticInterface.abi,
					proxyAddress
				)
			}

			this.props.drizzle.addContract(contractConfig, EVENT_NAMES)
		}).then(() => {
			this.setState({ contractAdded: true })
		})
	}

	render () {
		if (this.props.drizzleState.drizzleStatus.initialized &&
			this.state.contractAdded) {
			return React.Children.only(this.props.children);
		}

		return <Loading/>
	}
}

export default ContractLoader;
