const truffleAssert = require('truffle-assertions')

const { ZERO_ADDRESS, getHash } = require('./utils')
const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')

contract('ERC721LogisticImplementation', async (accounts) => {
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

  it('Initialize', async () => {
    await truffleAssert.reverts(
      instance.initializeERC721({ from: owner }),
      'Upgradeable: bad caller'
    )
  })

  it('Name', async () => {
    assert.equal(await instance.name(), 'LogisticM')
  })

  it('Get counter', async () => {
    assert.equal((await instance.getCounter()), 0)
  })

  it('Mint', async () => {
    const result = await instance.mint(other)
    truffleAssert.eventEmitted(result, 'Transfer', ev =>
      ev.from === ZERO_ADDRESS &&
      ev.to === other &&
      ev.tokenId.toNumber() === 0
    )
    assert.equal((await instance.ownerOf(0)), other)
  })

  it('Approve', async () => {
    const result = await instance.approve(owner, 0, { from: other })
    truffleAssert.eventEmitted(result, 'Approval', ev =>
      ev.owner === other &&
      ev.approved === owner &&
      ev.tokenId.toNumber() === 0
    )
    assert.equal((await instance.getApproved(0)), owner)
  })

  it('Transfer', async () => {
    const result = await instance.transferFrom(other, owner, 0, { from: owner })
    truffleAssert.eventEmitted(result, 'Transfer', ev =>
      ev.from === other &&
      ev.to === owner &&
      ev.tokenId.toNumber() === 0
    )
    assert.equal((await instance.ownerOf(0)), owner)
  })

  it('setApprovalForAll', async () => {
    await truffleAssert.reverts(
      instance.setApprovalForAll(owner, true, { from: other }),
      'ERC721Logistic: can not approve for all'
    )
  })

  it('safeTransferFrom', async () => {
    await truffleAssert.reverts(
      instance.safeTransferFrom(owner, other, 0),
      'ERC721Logistic: can not transfer'
    )
    await truffleAssert.reverts(
      instance.safeTransferFrom(owner, other, 0, getHash('0')),
      'ERC721Logistic: can not transfer'
    )
  })
})
