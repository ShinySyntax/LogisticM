const truffleAssert = require('truffle-assertions')

const { products, getHash, ZERO_ADDRESS } = require('./utils')
const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')

contract('Product', async accounts => {
  const [owner, supplier, deliveryMan, purchaser] = accounts

  describe('ProductImplementation', async function () {
    before(async function () {
      // Create proxy
      const ownedRegistry = await OwnedRegistry.deployed()
      const { logs } = await ownedRegistry.createProxy(version)
      const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
      this.instance = await LogisticInterface.at(proxy)
    })

    describe('When unlocked (i.e. called by the proxy)', async function () {
      beforeEach(async function () {
        await this.instance.pause({ from: owner })
        await this.instance.setLock(false, { from: owner })
      })

      afterEach(async function () {
        await this.instance.setLock(true, { from: owner })
        await this.instance.unpause({ from: owner })
      })

      it('New product', async function () {
        const result = await this.instance.newProduct(
          products[0].hash,
          purchaser,
          products[0].nameBytes32,
          { from: supplier }
        )

        truffleAssert.eventEmitted(result, 'NewProduct', ev =>
          ev.by === supplier &&
          ev.purchaser === purchaser &&
          ev.productHash === products[0].hash &&
          ev.productName === products[0].name
        )

        assert.equal(await this.instance.getHashFromTokenId(products[0].tokenId),
          products[0].hash)
        const info = await this.instance.getProductInfo(products[0].hash)
        assert.equal(info.purchaser, purchaser)
        assert.equal(info.productName, products[0].name)
        assert.equal(info.tokenId.words[0], products[0].tokenId)
        assert.isTrue(await this.instance.productExists(products[0].hash))
      })

      it('Set product sent', async function () {
        const result = await this.instance.setProductSent(products[0].hash,
          supplier, deliveryMan, { from: supplier })
        truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
          ev.from === supplier &&
          ev.to === deliveryMan &&
          ev.productHash === products[0].hash &&
          ev.productName === products[0].name
        )
        assert.equal(await this.instance.productSentFrom(products[0].hash,
          supplier), deliveryMan)
        await truffleAssert.reverts(
          this.instance.setProductSent(products[0].hash,
            ZERO_ADDRESS, deliveryMan, { from: deliveryMan }),
          'Product: from is the zero address'
        )
        await truffleAssert.reverts(
          this.instance.setProductSent(products[0].hash,
            supplier, ZERO_ADDRESS, { from: deliveryMan }),
          'Product: to is the zero address'
        )
        await truffleAssert.reverts(
          this.instance.setProductSent(products[2].hash,
            supplier, deliveryMan, { from: deliveryMan }),
          'Product: this product does not exist'
        )
      })

      it('Set product received', async function () {
        const result = await this.instance.setProductReceived(products[0].hash,
          supplier, deliveryMan, { from: deliveryMan })
        truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
          ev.from === supplier &&
          ev.by === deliveryMan &&
          ev.productHash === products[0].hash &&
          ev.productName === products[0].name
        )
        assert.equal(await this.instance.productReceivedFrom(products[0].hash,
          supplier), deliveryMan)
        await truffleAssert.reverts(
          this.instance.setProductReceived(products[0].hash,
            ZERO_ADDRESS, deliveryMan, { from: deliveryMan }),
          'Product: from is the zero address'
        )
        await truffleAssert.reverts(
          this.instance.setProductReceived(products[0].hash,
            supplier, ZERO_ADDRESS, { from: deliveryMan }),
          'Product: by is the zero address'
        )
        await truffleAssert.reverts(
          this.instance.setProductReceived(products[2].hash,
            supplier, deliveryMan, { from: deliveryMan }),
          'Product: this product does not exist'
        )
      })
    })

    it('Should revert if locked', async function () {
      await truffleAssert.reverts(
        this.instance.newProduct(products[0].hash, purchaser,
          products[0].nameBytes32, { from: supplier }),
        'Lock: locked'
      )
      await truffleAssert.reverts(
        this.instance.setProductReceived(products[0].hash,
          supplier, deliveryMan, { from: deliveryMan }),
        'Lock: locked'
      )
      await truffleAssert.reverts(
        this.instance.setProductSent(products[0].hash,
          supplier, deliveryMan, { from: supplier }),
        'Lock: locked'
      )
    })

    it('Product exists', async function () {
      assert.isFalse(await this.instance.productExists(getHash('a4165')))
      assert.isFalse(await this.instance.productExists(getHash('0')))
    })
  })
})
