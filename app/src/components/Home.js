import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';

const { AccountData, ContractData, ContractForm } = newContextComponents;

class Home extends React.Component {

  onClick() {
    console.log("onClick");
    toast.info('🦄 Wow so easy!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  render () {
    const { drizzle, drizzleState } = this.props;

    return (
      <div>

        <div>
          <h1>Drizzle Examples</h1>
          <p>
            Examples of how to get started with Drizzle in various situations.
          </p>
        </div>

        <div className="section">
          <h2>Active Account</h2>
          <AccountData
            drizzle={drizzle}
            drizzleState={drizzleState}
            accountIndex={0}
            units="ether"
            precision={3}
            />
        </div>

        <div className="section">
          <h2>Logistic</h2>
          <p>
            This shows a simple ContractData component, along
            with a form to set its value.
          </p>
          <p>
            <strong>Owner of token 0: </strong>
            <ContractData
              drizzle={drizzle}
              drizzleState={drizzleState}
              contract="Logistic"
              method="pendingDeliveries"
              methodArgs={[0]}
              />
          </p>
          <ContractForm drizzle={drizzle} contract="Logistic" method="send" />
          <br/>
          <Button variant="primary" onClick={this.onClick} >Primary</Button>{' '}
            <Button variant="secondary">Secondary</Button>{' '}
              <Button variant="success">Success</Button>{' '}
              </div>
            </div>
          );
  }
}

export default Home;
