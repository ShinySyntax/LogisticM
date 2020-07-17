// let drizzle know what contracts we want and how to access our test blockchain
// import Web3 from "web3";

import Logistic from "./contracts/Logistic.json";

const options = {
  contracts: [Logistic],
  events: {
    Logistic: [
      "MakerAdded",
      "MakerRemoved",
      "MerchantAdded",
      "MerchantRemoved",
      "OwnershipTransferred",
      "Transfer",
      "Approval"
    ]
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
};

export default options;
