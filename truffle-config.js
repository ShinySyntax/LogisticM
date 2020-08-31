const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + apiKey);
      },
      network_id: 3
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/" + apiKey);
      },
      network_id: 42
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.5",    // Fetch exact version from solc-bin (default: truffle's version)
      // optimizer: {
      //   enabled: true,
      //   runs: 200
      // }
    },
  },
  plugins: ["solidity-coverage"]
};
