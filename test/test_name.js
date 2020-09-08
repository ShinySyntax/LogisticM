const truffleAssert = require('truffle-assertions')
const ethersUtils = require('ethers').utils

const { version } = require('./utils')

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')

contract('Name', async accounts => {
  const [owner, other] = accounts

  before(async function () {
    // Create proxy
    const ownedRegistry = await OwnedRegistry.deployed()
    const { logs } = await ownedRegistry.createProxy(version)
    const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
    instance = await LogisticInterface.at(proxy)
  })

  beforeEach(async function () {
    await instance.pause({ from: owner })
    await instance.setLock(false, { from: owner })
  })

  afterEach(async function () {
    await instance.setLock(true, { from: owner })
    await instance.unpause({ from: owner })
  })

  it('Set name', async () => {
    const name = 'John Doe'
    const nameBytes32 = ethersUtils.formatBytes32String(name)
    await instance.setName(other, nameBytes32, { from: owner })
    await instance.setName(other, nameBytes32, { from: owner }) // "rename" but with same name
    assert.equal(await instance.getName(other), name)
    assert.equal(await instance.getAddress(nameBytes32), other)

    await truffleAssert.reverts(
      instance.setName(other, ethersUtils.formatBytes32String('Jack S.'), { from: owner }),
      'Name: invalid name'
    )
    await truffleAssert.reverts(
      instance.setName(owner, nameBytes32, { from: owner }),
      'Name: invalid address'
    )
  })
})
