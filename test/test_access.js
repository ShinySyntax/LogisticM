const truffleAssert = require('truffle-assertions')
const ethersUtils = require('ethers').utils

const { ZERO_ADDRESS } = require('./utils')

const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')

contract('AccessImplementation & OwnerImplementation', async (accounts) => {
  const [owner, supplier, deliveryMan, other, namedSupplier, namedDeliveryMan] = accounts

  before(async function () {
    // Create proxy
    const ownedRegistry = await OwnedRegistry.deployed()
    const { logs } = await ownedRegistry.createProxy(version)
    const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
    this.instance = await LogisticInterface.at(proxy)
  })

  it('Owner', async function () {
    const actualOwner = await this.instance.getOwner()
    assert.equal(actualOwner, owner)

    assert.equal(await this.instance.getRole(owner), 3)

    // await this.instance.initializeOwner(owner, { from: OwnedRegistry.address })
    await truffleAssert.reverts(
      this.instance.initializeOwner(owner, { from: owner }),
      'Upgradeable: bad caller'
    )
  })

  it('transferOwnership', async function () {
    await this.instance.transferOwnership(other, { from: owner })
    assert.equal((await this.instance.getOwner()), other)
    await this.instance.transferOwnership(owner, { from: other })

    await truffleAssert.reverts(
      this.instance.transferOwnership(owner, { from: other }),
      'Owner: caller is not the owner'
    )

    await truffleAssert.reverts(
      this.instance.transferOwnership(ZERO_ADDRESS, { from: owner }),
      'Owner: new owner is the zero address'
    )
  })

  it('Getter', async function () {
    await truffleAssert.reverts(
      this.instance.isSupplier(ZERO_ADDRESS),
      'RolesLibrary: account is the zero address'
    )
    await truffleAssert.reverts(
      this.instance.isDeliveryMan(ZERO_ADDRESS),
      'RolesLibrary: account is the zero address'
    )
  })

  it('Add a supplier with name', async function () {
    const name = 'supplier'
    const nameBytes32 = ethersUtils.formatBytes32String(name)
    const result = await this.instance.addSupplierWithName(namedSupplier, nameBytes32, { from: owner })
    truffleAssert.eventEmitted(result, 'SupplierAdded', ev =>
      ev.account === namedSupplier
    )
    assert.isTrue((await this.instance.isSupplier(namedSupplier)))
    assert.equal(await this.instance.getName(namedSupplier), name)
    assert.equal(await this.instance.getAddress(nameBytes32), namedSupplier)
  })

  it('Add a delivery man with name', async function () {
    const name = 'delivery man'
    const nameBytes32 = ethersUtils.formatBytes32String(name)
    const result = await this.instance.addDeliveryManWithName(namedDeliveryMan, nameBytes32, { from: owner })
    truffleAssert.eventEmitted(result, 'DeliveryManAdded', ev =>
      ev.account === namedDeliveryMan
    )
    assert.isTrue((await this.instance.isDeliveryMan(namedDeliveryMan)))
    assert.equal(await this.instance.getName(namedDeliveryMan), name)
    assert.equal(await this.instance.getAddress(nameBytes32), namedDeliveryMan)
  })

  it('Add a supplier', async function () {
    await truffleAssert.reverts(
      this.instance.addSupplier(owner, { from: owner }),
      "Access: Owner can't be supplier"
    )

    assert.isFalse((await this.instance.isSupplier(supplier)))
    const result = await this.instance.addSupplier(supplier, { from: owner })
    truffleAssert.eventEmitted(result, 'SupplierAdded', ev =>
      ev.account === supplier
    )
    assert.isTrue((await this.instance.isSupplier(supplier)))

    await truffleAssert.reverts(
      this.instance.addSupplier(deliveryMan, { from: supplier }),
      'Ownable: caller is not the owner'
    )
  })

  describe('When other is supplier', function () {
    beforeEach(async function () {
      await this.instance.addSupplier(other, { from: owner })
    })
    it('Remove supplier', async function () {
      await this.instance.removeSupplier(other, { from: owner })
      assert.isFalse((await this.instance.isSupplier(other)))
      await truffleAssert.reverts(
        this.instance.removeSupplier(other, { from: owner }),
        'RolesLibrary: account is not supplier'
      )
    })

    it('Renounce supplier', async function () {
      await this.instance.renounceSupplier({ from: other })
      assert.isFalse((await this.instance.isSupplier(other)))

      await truffleAssert.reverts(
        this.instance.renounceSupplier({ from: other }),
        'Access: caller is not supplier'
      )
    })

    it("Other can't be delivery man", async function () {
      await truffleAssert.reverts(
        this.instance.addDeliveryMan(other, { from: owner }),
        'RolesLibrary: roles already defined'
      )
    })

    after(async function () {
      await this.instance.renounceSupplier({ from: other })
    })
  })

  it('Add delivery men', async function () {
    await truffleAssert.reverts(
      this.instance.addDeliveryMan(owner, { from: owner }),
      "Access: Owner can't be delivery man"
    )

    assert.isFalse((await this.instance.isDeliveryMan(deliveryMan)))
    const result = await this.instance.addDeliveryMan(deliveryMan, { from: owner })
    assert.isTrue((await this.instance.isDeliveryMan(deliveryMan)))
    truffleAssert.eventEmitted(result, 'DeliveryManAdded', ev =>
      ev.account === deliveryMan
    )

    await truffleAssert.reverts(
      this.instance.addDeliveryMan(deliveryMan, { from: other }),
      'Ownable: caller is not the owner'
    )
  })

  describe('When other is delivery man', function () {
    beforeEach(async function () {
      await this.instance.addDeliveryMan(other, { from: owner })
    })

    it('Remove delivery man', async function () {
      await this.instance.removeDeliveryMan(other, { from: owner })
      assert.isFalse((await this.instance.isDeliveryMan(other)))
      await truffleAssert.reverts(
        this.instance.removeDeliveryMan(other, { from: owner }),
        'RolesLibrary: account is not delivery man'
      )
    })

    it('Renounce delivery man', async function () {
      await this.instance.renounceDeliveryMan({ from: other })
      assert.isFalse((await this.instance.isDeliveryMan(other)))

      await truffleAssert.reverts(
        this.instance.renounceDeliveryMan({ from: other }),
        'Access: caller is not delivery man'
      )
    })

    it("Other can't be supplier", async function () {
      await truffleAssert.reverts(
        this.instance.addSupplier(other, { from: owner }),
        'RolesLibrary: roles already defined'
      )
    })
  })
})
