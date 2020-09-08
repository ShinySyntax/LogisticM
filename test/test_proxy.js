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
    await truffleAssert.reverts(
      ownedRegistry.addVersionFromName(
        'v0', 'myMethod()', imp.address, { from: other }),
      'RegistryOwnership: Caller is not the registry owner'
    )
    const result = await ownedRegistry.addVersionFromName(
      'v0', 'myMethod()', imp.address, { from: owner })
    truffleAssert.eventEmitted(result, 'VersionAdded', ev =>
      ev.version === 'v0' &&
      ev.func === '0x70dce926' &&
      ev.implementation === imp.address
    )
    await truffleAssert.reverts(
      ownedRegistry.addVersionFromName(
        'v0', 'myMethod()', imp.address, { from: owner }),
      'Registry: func already defined'
    )
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
