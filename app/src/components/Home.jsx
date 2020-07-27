import React from "react";

import OwnerPanel from './owner/OwnerPanel';
import SupplierPanel from './supplier/SupplierPanel';
import DeliveryManPanel from './delivery-man/DeliveryManPanel';
import NoUserPanel from './NoUserPanel';
import Loading from './Loading';

class Home extends React.Component {
  state = {
    dataKeyOwner: null,
    dataKeySupplier: null,
		dataKeyDeliveryMan: null
  };

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;

    const dataKeyOwner = drizzle.contracts.Logistic.methods.owner.cacheCall();
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

    const owner = Logistic.owner[this.state.dataKeyOwner];
    const isSupplier = Logistic.isSupplier[this.state.dataKeySupplier];
    const isDeliveryMan = Logistic.isDeliveryMan[this.state.dataKeyDeliveryMan];

    if (!owner || !isSupplier || !isDeliveryMan) {
      return <Loading/>
    }

    if (owner && owner.value === drizzleState.accounts[0]) {
      return (
        <OwnerPanel
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }

    if (isSupplier && isSupplier.value) {
      return (
        <SupplierPanel
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }

    if (isDeliveryMan && isDeliveryMan.value) {
      return (
        <DeliveryManPanel
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }

    return <NoUserPanel/>
  }
}

export default Home;
