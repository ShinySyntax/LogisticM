import React from "react";

import OwnerPanel from './owner/OwnerPanel';
import SupplierPanel from './supplier/SupplierPanel';
import DeliveryManPanel from './delivery-man/DeliveryManPanel';
import CustomerPanel from './customer/CustomerPanel';
import Loading from './loading/Loading';

class Home extends React.Component {
	state = {
		dataKeyOwner: null,
		dataKeySupplier: null,
		dataKeyDeliveryMan: null
	};

	componentDidMount() {
		// this.props.drizzle.web3.eth.defaultAccount = this.props.drizzleState.accounts[0] //don't work

		const { drizzle, drizzleState } = this.props;

		const dataKeyOwner = drizzle.contracts.LogisticM.methods.getOwner.cacheCall();
		this.setState({ dataKeyOwner });

		const dataKeySupplier = drizzle.contracts.LogisticM.methods.isSupplier
		.cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeySupplier });

		const dataKeyDeliveryMan = drizzle.contracts.LogisticM.methods.isDeliveryMan
		.cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeyDeliveryMan });
	}

  render () {
    const { drizzle, drizzleState } = this.props;
    const { LogisticM } = drizzleState.contracts;

    const owner = LogisticM.getOwner[this.state.dataKeyOwner];
    const isSupplier = LogisticM.isSupplier[this.state.dataKeySupplier];
    const isDeliveryMan = LogisticM.isDeliveryMan[this.state.dataKeyDeliveryMan];

    if (!owner || !isSupplier || !isDeliveryMan) {
      return <Loading/>
    }

    if (owner.value === drizzleState.accounts[0]) {
      return (
        <OwnerPanel
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }

    if (isSupplier.value) {
      return (
        <SupplierPanel
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }

    if (isDeliveryMan.value) {
      return (
        <DeliveryManPanel
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }

    return (
      <CustomerPanel
        drizzle={drizzle}
        drizzleState={drizzleState}
      />
    )
  }
}

export default Home;
