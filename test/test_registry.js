const truffleAssert = require('truffle-assertions')
const Web3 = require('web3')

const { ZERO_ADDRESS } = require('./utils')
const web3 = new Web3(Web3.givenProvider)

const OwnedRegistry = artifacts.require('OwnedRegistry')
const MockImplementationV0 = artifacts.require('MockImplementationV0')

contract('Proxy', async accounts => {
  const [owner, other] = accounts
  const methodSignature = 'myMethod()'

  before(async function () {
    // Create proxy
    this.ownedRegistry = await OwnedRegistry.deployed()
    this.imp = await MockImplementationV0.new()
  })

  it('addFallback', async function () {
    await truffleAssert.reverts(
      this.ownedRegistry.addFallback('v0', ZERO_ADDRESS, { from: other }),
      'RegistryOwnership: Caller is not the registry owner'
    )
    const result = await this.ownedRegistry.addFallback('v0', this.imp.address, { from: owner })
    truffleAssert.eventEmitted(result, 'FallbackAdded', ev =>
      ev.version === 'v0' &&
      ev.implementation === this.imp.address
    )
    await truffleAssert.reverts(
      this.ownedRegistry.addFallback('v0', ZERO_ADDRESS, { from: owner }),
      'Registry: fallback already defined'
    )
  })

  it('addVersionFromName', async function () {
    await truffleAssert.reverts(
      this.ownedRegistry.addVersionFromName(
        'v0', methodSignature, this.imp.address, { from: other }),
      'RegistryOwnership: Caller is not the registry owner'
    )
    const result = await this.ownedRegistry.addVersionFromName(
      'v0', methodSignature, this.imp.address, { from: owner })
    truffleAssert.eventEmitted(result, 'VersionAdded', ev =>
      ev.version === 'v0' &&
      ev.func === web3.eth.abi.encodeFunctionSignature(methodSignature) &&
      ev.implementation === this.imp.address
    )
    await truffleAssert.reverts(
      this.ownedRegistry.addVersionFromName(
        'v0', methodSignature, this.imp.address, { from: owner }),
      'Registry: func already defined'
    )
  })

  it('Add version from signature', async function () {
    const otherMethod = 'otherMethod(address)'

    const result = await this.ownedRegistry.addVersion(
      'v0', web3.eth.abi.encodeFunctionSignature(otherMethod),
      this.imp.address, { from: owner })
    truffleAssert.eventEmitted(result, 'VersionAdded', ev =>
      ev.version === 'v0' &&
      ev.func === web3.eth.abi.encodeFunctionSignature(otherMethod) &&
      ev.implementation === this.imp.address
    )
  })

  it('Upgrade functions', async function () {
    const count = (await this.ownedRegistry.getFunctionCount('v0')).toNumber()
    await this.ownedRegistry.upgradeFunctions('v0', 'v0.0-alpha')
    assert.equal(count, (await this.ownedRegistry.getFunctionCount('v0.0-alpha')).toNumber())
    const func = await this.ownedRegistry.getFunctionByIndex('v0.0-alpha', 0)
    assert.equal(func['0'], web3.eth.abi.encodeFunctionSignature(methodSignature))
    assert.equal(func['1'], this.imp.address)
  })
})
