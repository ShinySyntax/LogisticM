import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Web3 from "web3";
import { Drizzle } from "@drizzle/store";
import Web3Modal from "web3modal";

import Home from "./components/Home";
import HeaderBar from "./components/HeaderBar";
import ProductDetail from './components/product/product-page/ProductDetail'
import LoadingContainer from "./components/LoadingContainer";
import ContractLoader from "./components/ContractLoader";
import "./App.css";
import getDrizzleOptions from "./store/drizzleOptions";
import getStore from "./store/store";


const getDrizzle = async () => {
  const providerOptions = {
    /* See Provider Options Section */
  };

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    // cacheProvider: false, // optional
    // disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    providerOptions // required
  });

  return web3Modal.connect().then(provider => {
    const web3 = new Web3(provider);
    // const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const drizzleOptions = getDrizzleOptions(web3)
    const drizzleStore = getStore(drizzleOptions)
    return new Drizzle(drizzleOptions, drizzleStore)
  })
}

class App extends React.Component {
  state = {
    drizzle: null
  }

  componentDidMount() {
    getDrizzle().then(drizzle => {
      this.setState({ drizzle })
    })
  }

  render() {
    if (!this.state.drizzle) return "Loading..."
    console.log(this.state.drizzle);

    return (
      <DrizzleContext.Provider drizzle={this.state.drizzle}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;
            // console.log(drizzle, drizzleState);

            return (
              <LoadingContainer
                drizzleState={drizzleState}
                drizzle={drizzle}
                initialized={initialized}
              >
                <ContractLoader
                  drizzleState={drizzleState}
                  drizzle={drizzle}
                  initialized={initialized}
                >
                  <Router>
                    <HeaderBar drizzle={drizzle} drizzleState={drizzleState} />
                    <Route exact path="/">
                      <Home drizzle={drizzle} drizzleState={drizzleState} />
                    </Route>
                    <Route exact path="/product/:productName" render={(props) => {
                        return (
                          <ProductDetail {...props}
                            drizzle={drizzle}
                            drizzleState={drizzleState}
                            />
                        )}
                      }
                      />
                  </Router>
                </ContractLoader>
              </LoadingContainer>
            )
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    );
  }
}

export default App;
