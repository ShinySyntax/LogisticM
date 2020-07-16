import React from "react";

import OwnerPanel from './owner/OwnerPanel';
import MakerPanel from './maker/MakerPanel';
import MerchantPanel from './merchant/MerchantPanel';
import NoUserPanel from './NoUserPanel';

class Home extends React.Component {
  state = {
    dataKeyOwner: null,
    dataKeyMaker: null,
		dataKeyMerchant: null
  };

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;

    const dataKeyOwner = drizzle.contracts.Logistic.methods.owner.cacheCall();
    this.setState({ dataKeyOwner });

    const dataKeyMaker = drizzle.contracts.Logistic.methods.isMaker
      .cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeyMaker });

		const dataKeyMerchant = drizzle.contracts.Logistic.methods.isMerchant
      .cacheCall(drizzleState.accounts[0]);
		this.setState({ dataKeyMerchant });
  }

  render () {
    const { drizzle, drizzleState } = this.props;
    const { Logistic } = drizzleState.contracts;

    const owner = Logistic.owner[this.state.dataKeyOwner];
    const isMaker = Logistic.isMaker[this.state.dataKeyMaker];
    const isMerchant = Logistic.isMerchant[this.state.dataKeyMerchant];

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

    if (isMerchant && isMerchant.value) {
      return (
        <MerchantPanel
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }

    return <NoUserPanel/>
  }
}

export default Home;
