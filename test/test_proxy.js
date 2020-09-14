const truffleAssert = require('truffle-assertions')

const { ZERO_ADDRESS } = require('./utils')
const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')
const MockImplementationV0 = artifacts.require('MockImplementationV0')

contract('Proxy', async accounts => {
  const [owner, other] = accounts

  before(async function () {
    // Create proxy
    this.ownedRegistry = await OwnedRegistry.deployed()
    const { logs } = await this.ownedRegistry.createProxy(version)
    const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
    this.instance = await LogisticInterface.at(proxy)
    this.mockInstance = await MockImplementationV0.at(proxy)
  })

  it('upgradeTo', async function () {
    await this.instance.upgradeTo('v1', { from: owner })
    await truffleAssert.reverts(
      this.instance.upgradeTo('v2', { from: other }),
      'OwnedUpgradeabilityProxy: Caller is the proxy owner'
    )
  })

  it('transferRegistryOwnership', async function () {
    await truffleAssert.reverts(
      this.ownedRegistry.transferRegistryOwnership(ZERO_ADDRESS, { from: owner }),
      "RegistryOwnership: Can't transfer ownership to the zero address"
    )
    await this.ownedRegistry.transferRegistryOwnership(other, { from: owner })
    assert.equal(await this.ownedRegistry.registryOwner(), other)
    await truffleAssert.reverts(
      this.ownedRegistry.transferRegistryOwnership(other, { from: owner }),
      'RegistryOwnership: Caller is not the registry owner'
    )
  })

  it('transferProxyOwnership', async function () {
    await truffleAssert.reverts(
      this.instance.transferProxyOwnership(ZERO_ADDRESS, { from: owner }),
      "OwnedUpgradeabilityProxy: Can't transfer proxy ownership to the zero address"
    )
    await this.instance.transferProxyOwnership(other, { from: owner })
    assert.equal(await this.instance.proxyOwner(), other)
    await truffleAssert.reverts(
      this.instance.transferProxyOwnership(other, { from: owner }),
      'OwnedUpgradeabilityProxy: Caller is the proxy owner'
    )
  })

  it('Revert when unknow func', async function () {
    await truffleAssert.reverts(
      this.mockInstance.myMethod(),
      'Proxy: implementation not found'
    )
  })
})
