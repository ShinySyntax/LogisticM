const truffleAssert = require('truffle-assertions')
const ethersUtils = require('ethers').utils

const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')

contract('Name', async accounts => {
  const [owner, other] = accounts

  before(async function () {
    // Create proxy
    const ownedRegistry = await OwnedRegistry.deployed()
    const { logs } = await ownedRegistry.createProxy(version)
    const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
    this.instance = await LogisticInterface.at(proxy)
  })

  beforeEach(async function () {
    await this.instance.pause({ from: owner })
    await this.instance.setLock(false, { from: owner })
  })

  afterEach(async function () {
    await this.instance.setLock(true, { from: owner })
    await this.instance.unpause({ from: owner })
  })

  it('Set name', async function () {
    const name = 'John Doe'
    const nameBytes32 = ethersUtils.formatBytes32String(name)
    await this.instance.setName(other, nameBytes32, { from: owner })
    await this.instance.setName(other, nameBytes32, { from: owner }) // "rename" but with same name
    assert.equal(await this.instance.getName(other), name)
    assert.equal(await this.instance.getAddress(nameBytes32), other)

    await truffleAssert.reverts(
      this.instance.setName(other, ethersUtils.formatBytes32String('Jack S.'), { from: owner }),
      'Name: invalid name'
    )
    await truffleAssert.reverts(
      this.instance.setName(owner, nameBytes32, { from: owner }),
      'Name: invalid address'
    )
  })
})
