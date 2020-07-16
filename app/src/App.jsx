import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.css";

import drizzleOptions from "./drizzleOptions";
import drizzleStore from "./store";
import Home from "./components/Home";
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
      <ToastContainer />
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          console.log(drizzle, drizzleState);

          if (!initialized) {
            return "Loading..."
          }

          return (
            <Home drizzle={drizzle} drizzleState={drizzleState} />
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
