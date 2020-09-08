const truffleAssert = require('truffle-assertions')

const { version, ZERO_ADDRESS } = require('./utils')

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

  it('upgradeTo', async () => {
    await instance.upgradeTo('v1', { from: owner })
    await truffleAssert.reverts(
      instance.upgradeTo('v2', { from: other }),
      'OwnedUpgradeabilityProxy: Caller is the proxy owner'
    )
  })

  it('transferRegistryOwnership', async () => {
    await truffleAssert.reverts(
      ownedRegistry.transferRegistryOwnership(ZERO_ADDRESS, { from: owner }),
      "RegistryOwnership: Can't transfer ownership to the zero address"
    )
    await ownedRegistry.transferRegistryOwnership(other, { from: owner })
    assert.equal(await ownedRegistry.registryOwner(), other)
    await truffleAssert.reverts(
      ownedRegistry.transferRegistryOwnership(other, { from: owner }),
      'RegistryOwnership: Caller is not the registry owner'
    )
  })

  it('transferProxyOwnership', async () => {
    await truffleAssert.reverts(
      instance.transferProxyOwnership(ZERO_ADDRESS, { from: owner }),
      "OwnedUpgradeabilityProxy: Can't transfer proxy ownership to the zero address"
    )
    await instance.transferProxyOwnership(other, { from: owner })
    assert.equal(await instance.proxyOwner(), other)
    await truffleAssert.reverts(
      instance.transferProxyOwnership(other, { from: owner }),
      'OwnedUpgradeabilityProxy: Caller is the proxy owner'
    )
  })

  it('Revert when unknow func', async () => {
    await truffleAssert.reverts(
      mockInstance.myMethod(),
      'Proxy: implementation not found'
    )
  })
})
