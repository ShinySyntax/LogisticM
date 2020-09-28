const truffleAssert = require('truffle-assertions')

const { ZERO_ADDRESS, getHash } = require('./utils')
const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticMInterface = artifacts.require('LogisticMInterface')

contract('ERC721LogisticMImplementation', async (accounts) => {
  const [owner, other] = accounts

  before(async function () {
    // Create proxy
    const ownedRegistry = await OwnedRegistry.deployed()
    const { logs } = await ownedRegistry.createProxy(version)
    const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
    this.instance = await LogisticMInterface.at(proxy)
  })

  beforeEach(async function () {
    await this.instance.pause({ from: owner })
    await this.instance.setLock(false, { from: owner })
  })

  afterEach(async function () {
    await this.instance.setLock(true, { from: owner })
    await this.instance.unpause({ from: owner })
  })

  it('Initialize', async function () {
    await truffleAssert.reverts(
      this.instance.initializeERC721({ from: owner }),
      'Upgradeable: bad caller'
    )
  })

  it('Name', async function () {
    assert.equal(await this.instance.name(), 'LogisticM')
  })

  it('Get counter', async function () {
    assert.equal((await this.instance.getCounter()), 0)
  })

  it('Mint', async function () {
    const result = await this.instance.mint(other)
    truffleAssert.eventEmitted(result, 'Transfer', ev =>
      ev.from === ZERO_ADDRESS &&
      ev.to === other &&
      ev.tokenId.toNumber() === 0
    )
    assert.equal((await this.instance.ownerOf(0)), other)
  })

  it('Approve', async function () {
    const result = await this.instance.approve(owner, 0, { from: other })
    truffleAssert.eventEmitted(result, 'Approval', ev =>
      ev.owner === other &&
      ev.approved === owner &&
      ev.tokenId.toNumber() === 0
    )
    assert.equal((await this.instance.getApproved(0)), owner)
  })

  it('Transfer', async function () {
    const result = await this.instance.transferFrom(other, owner, 0, { from: owner })
    truffleAssert.eventEmitted(result, 'Transfer', ev =>
      ev.from === other &&
      ev.to === owner &&
      ev.tokenId.toNumber() === 0
    )
    assert.equal((await this.instance.ownerOf(0)), owner)
  })

  it('setApprovalForAll', async function () {
    await truffleAssert.reverts(
      this.instance.setApprovalForAll(owner, true, { from: other }),
      'ERC721LogisticM: can not approve for all'
    )
  })

  it('safeTransferFrom', async function () {
    await truffleAssert.reverts(
      this.instance.safeTransferFrom(owner, other, 0),
      'ERC721LogisticM: can not transfer'
    )
    await truffleAssert.reverts(
      this.instance.safeTransferFrom(owner, other, 0, getHash('0')),
      'ERC721LogisticM: can not transfer'
    )
  })
})
