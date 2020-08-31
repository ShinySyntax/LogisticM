// let drizzle know what contracts we want and how to access our test blockchain
// import Web3 from "web3";

import OwnedRegistry from "../contracts/OwnedRegistry.json";

const options = {
  contracts: [OwnedRegistry],
  events: {
    Logistic: ["ProxyCreated"]
  },
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545",
    },
  },
  // web3: {
  //   block: false,
  //   customProvider: new Web3("ws://localhost:8545"),
  // },
  // web3: {
  //   block: false,
  //   customProvider: new Web3(Web3.givenProvider || "ws://localhost:8545"),
  //   // customProvider: new Web3("wss://kovan.infura.io/ws/v3/5b2a79e624554c8ab922b9a84b076645"),
  // },
};

export default options;
