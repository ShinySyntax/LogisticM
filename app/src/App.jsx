import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import drizzleOptions from "./drizzleOptions";
import drizzleStore from "./store";
import Home from "./components/Home";
import TokenDetail from './components/token/token-page/TokenDetail'
import LoadingContainer from "./components/LoadingContainer";
import "./App.css";

const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
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
              initialized={initialized}
            >
              <Router>
                <Route exact path="/">
                  <Home drizzle={drizzle} drizzleState={drizzleState} />
                </Route>
                <Route exact path="/product/:tokenId" render={(props) => {
                    return (
                      <TokenDetail {...props}
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                      />
                    )}
                  }
                />
              </Router>
            </LoadingContainer>
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
