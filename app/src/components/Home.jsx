import React from "react";

import OwnerPanel from './owner/OwnerPanel';
import SupplierPanel from './supplier/SupplierPanel';
import DeliveryManPanel from './delivery-man/DeliveryManPanel';
import CustomerPanel from './customer/CustomerPanel';
import Loading from './Loading';

class Home extends React.Component {
	state = {
		dataKeyOwner: null,
		dataKeySupplier: null,
		dataKeyDeliveryMan: null
	};

	componentDidMount() {
		// this.props.drizzle.web3.eth.defaultAccount = this.props.drizzleState.accounts[0] //don't work

		const { drizzle, drizzleState } = this.props;

		const dataKeyOwner = drizzle.contracts.Logistic.methods.getOwner.cacheCall();
		this.setState({ dataKeyOwner });

		const dataKeySupplier = drizzle.contracts.Logistic.methods.isSupplier
		.cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeySupplier });

		const dataKeyDeliveryMan = drizzle.contracts.Logistic.methods.isDeliveryMan
		.cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeyDeliveryMan });
	}

  render () {
    const { drizzle, drizzleState } = this.props;
    const { Logistic } = drizzleState.contracts;

    const owner = Logistic.getOwner[this.state.dataKeyOwner];
    const isSupplier = Logistic.isSupplier[this.state.dataKeySupplier];
    const isDeliveryMan = Logistic.isDeliveryMan[this.state.dataKeyDeliveryMan];

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
