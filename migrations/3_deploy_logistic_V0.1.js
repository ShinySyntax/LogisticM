const Web3 = require('web3')
const { networks } = require('../truffle-config.js')
const { versions } = require('../versions')

const ProductImplementation = artifacts.require('./ProductImplementation.sol')

const OwnedRegistry = artifacts.require('./OwnedRegistry.sol')
const LogisticInterface = artifacts.require('./LogisticInterface.sol')

const getAddress = async Contract => {
  const contract = await Contract.deployed()
  return contract.address
}

module.exports = async (deployer, network) => {
  const version = versions[1]

  const registerFunction = async (registry, func, imp) => {
    try {
      await registry.addVersionFromName(version, func, imp)
    } catch (e) {
      console.error(e, func, imp)
    }
  }

  let ownedRegistry = await OwnedRegistry.deployed()
  if (!ownedRegistry) {
    console.log('Need to get deployed instance')
    ownedRegistry = await OwnedRegistry.deployed()
  }

  // Deploy new implementation
  await deployer.deploy(ProductImplementation)

  // Upgrade functions
  await ownedRegistry.upgradeFunctions(versions[0], versions[1])

  // Register Version
  await registerFunction(ownedRegistry, 'newProduct(bytes32,address,bytes32)', await getAddress(ProductImplementation))

  // Create a web3 instance
  let provider
  if (networks[network].provider) {
    provider = networks[network].provider()
    // deployer.provider = provider
  } else {
    provider = deployer.provider
  }
  const web3 = new Web3(provider)

  // Get the proxy address
  const web3Registry = new web3.eth.Contract(OwnedRegistry.abi, OwnedRegistry.address)
  const event = (await web3Registry.getPastEvents({ fromBlock: 0 })).find(event => {
    return event.event === 'ProxyCreated'
  })

  // Upgrade the proxy
  const proxy = await LogisticInterface.at(event.returnValues.proxy)
  await proxy.upgradeTo(version)
}
