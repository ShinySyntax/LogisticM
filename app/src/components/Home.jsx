import React from "react";

import OwnerPanel from './owner/OwnerPanel';
import MakerPanel from './maker/MakerPanel';
import DeliveryManPanel from './delivery-man/DeliveryManPanel';
import NoUserPanel from './NoUserPanel';
import Loading from './Loading';

class Home extends React.Component {
  state = {
    dataKeyOwner: null,
    dataKeyMaker: null,
		dataKeyDeliveryMan: null
  };

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;

    const dataKeyOwner = drizzle.contracts.Logistic.methods.owner.cacheCall();
    this.setState({ dataKeyOwner });

    const dataKeyMaker = drizzle.contracts.Logistic.methods.isMaker
      .cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeyMaker });

		const dataKeyDeliveryMan = drizzle.contracts.Logistic.methods.isDeliveryMan
      .cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeyDeliveryMan });
  }

  render () {
    const { drizzle, drizzleState } = this.props;
    const { Logistic } = drizzleState.contracts;

    const owner = Logistic.owner[this.state.dataKeyOwner];
    const isMaker = Logistic.isMaker[this.state.dataKeyMaker];
    const isDeliveryMan = Logistic.isDeliveryMan[this.state.dataKeyDeliveryMan];

    if (!owner || !isMaker || !isDeliveryMan) {
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

    if (isMaker && isMaker.value) {
      return (
        <MakerPanel
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
