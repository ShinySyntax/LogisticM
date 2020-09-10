const truffleAssert = require('truffle-assertions')
const Web3 = require('web3')

const { ZERO_ADDRESS } = require('./utils')
const web3 = new Web3(Web3.givenProvider)
const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')
const MockImplementationV0 = artifacts.require('MockImplementationV0')

contract('Proxy', async accounts => {
  const [owner, other] = accounts

  before(async function () {
    // Create proxy
    ownedRegistry = await OwnedRegistry.deployed()
    const { logs } = await ownedRegistry.createProxy(version)
    const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
    instance = await LogisticInterface.at(proxy)
    imp = await MockImplementationV0.new()
    mockInstance = await MockImplementationV0.at(proxy)
  })

  it('addFallback', async () => {
    await truffleAssert.reverts(
      ownedRegistry.addFallback('v0', ZERO_ADDRESS, { from: other }),
      'RegistryOwnership: Caller is not the registry owner'
    )
    const result = await ownedRegistry.addFallback('v0', imp.address, { from: owner })
    truffleAssert.eventEmitted(result, 'FallbackAdded', ev =>
      ev.version === 'v0' &&
      ev.implementation === imp.address
    )
    await truffleAssert.reverts(
      ownedRegistry.addFallback('v0', ZERO_ADDRESS, { from: owner }),
      'Registry: fallback already defined'
    )
  })

  it('addVersionFromName', async () => {
    const methodSignature = 'myMethod()'

    await truffleAssert.reverts(
      ownedRegistry.addVersionFromName(
        'v0', methodSignature, imp.address, { from: other }),
      'RegistryOwnership: Caller is not the registry owner'
    )
    const result = await ownedRegistry.addVersionFromName(
      'v0', methodSignature, imp.address, { from: owner })
    truffleAssert.eventEmitted(result, 'VersionAdded', ev =>
      ev.version === 'v0' &&
      ev.func === web3.eth.abi.encodeFunctionSignature(methodSignature) &&
      ev.implementation === imp.address
    )
    await truffleAssert.reverts(
      ownedRegistry.addVersionFromName(
        'v0', methodSignature, imp.address, { from: owner }),
      'Registry: func already defined'
    )
  })

  it('Add version from signature', async () => {
    const otherMethod = "otherMethod(address)"

    const result = await ownedRegistry.addVersion(
      'v0', web3.eth.abi.encodeFunctionSignature(otherMethod),
      imp.address, { from: owner })
    truffleAssert.eventEmitted(result, 'VersionAdded', ev =>
      ev.version === 'v0' &&
      ev.func === web3.eth.abi.encodeFunctionSignature(otherMethod) &&
      ev.implementation === imp.address
    )
  })
})
