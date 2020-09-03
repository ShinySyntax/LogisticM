const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const { version, products, getHash, ZERO_ADDRESS } = require('./utils')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const OwnedRegistry = artifacts.require("OwnedRegistry")
const LogisticInterface = artifacts.require("LogisticInterface")

contract("Product", async accounts => {
	const [owner, supplier, deliveryMan, purchaser, other] = accounts

	describe("ProductImplementation", async () =>{
		before(async function () {
			// Create proxy
			const ownedRegistry = await OwnedRegistry.deployed()
		    const { logs } = await ownedRegistry.createProxy(version)
			const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
			instance = await LogisticInterface.at(proxy)
	    });

		describe("When unlocked (i.e. called by the proxy)", async function () {
			beforeEach(async function () {
				await instance.pause({ from: owner })
				await instance.setLock(false, { from: owner })
			})

			afterEach(async function () {
				await instance.setLock(true, { from: owner })
				await instance.unpause({ from: owner })
			})

			it("New product", async () => {
				let result = await instance.newProduct(products[0].hash, purchaser,
					products[0].tokenId, products[0].nameBytes32, { from: supplier });

					truffleAssert.eventEmitted(result, 'NewProduct', ev =>
					ev.by === supplier &&
					ev.purchaser === purchaser &&
					ev.productHash === products[0].hash &&
					ev.productName === products[0].name
				);

				assert.equal(await instance.getHashFromTokenId(products[0].tokenId),
				products[0].hash);
				let info = await instance.getProductInfo(products[0].hash)
				assert.equal(info.purchaser, purchaser)
				assert.equal(info.productName, products[0].name)
				assert.equal(info.tokenId.words[0], products[0].tokenId)
				assert.isTrue(await instance.productExists(products[0].hash));
			})

			it("Set product sent", async () => {
				let result = await instance.setProductSent(products[0].hash,
					supplier, deliveryMan, { from: supplier });
				truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
					ev.from === supplier &&
					ev.to === deliveryMan &&
					ev.productHash === products[0].hash &&
					ev.productName === products[0].name
				);
				assert.equal(await instance.productSentFrom(products[0].hash,
					supplier), deliveryMan);
				await truffleAssert.reverts(
					instance.setProductSent(products[0].hash,
						ZERO_ADDRESS, deliveryMan, { from: deliveryMan }),
					"Product: from is the zero address"
				)
				await truffleAssert.reverts(
					instance.setProductSent(products[0].hash,
						supplier, ZERO_ADDRESS, { from: deliveryMan }),
					"Product: to is the zero address"
				)
			})

			it("Set product received", async () => {
				let result = await instance.setProductReceived(products[0].hash,
					supplier, deliveryMan, { from: deliveryMan });
					truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
					ev.from === supplier &&
					ev.by === deliveryMan &&
					ev.productHash === products[0].hash &&
					ev.productName === products[0].name
				);
				assert.equal(await instance.productReceivedFrom(products[0].hash,
					supplier), deliveryMan);
				await truffleAssert.reverts(
					instance.setProductReceived(products[0].hash,
						ZERO_ADDRESS, deliveryMan, { from: deliveryMan }),
					"Product: from is the zero address"
				)
				await truffleAssert.reverts(
					instance.setProductReceived(products[0].hash,
						supplier, ZERO_ADDRESS, { from: deliveryMan }),
					"Product: by is the zero address"
				)
			})
		})

		it("Should revert if locked", async () => {
			await truffleAssert.reverts(
				instance.newProduct(products[0].hash, purchaser,
					products[0].tokenId, products[0].nameBytes32, { from: supplier }),
				"Lock: locked"
			)
			await truffleAssert.reverts(
				instance.setProductReceived(products[0].hash,
					supplier, deliveryMan, { from: deliveryMan }),
				"Lock: locked"
			)
			await truffleAssert.reverts(
				instance.setProductSent(products[0].hash,
					supplier, deliveryMan, { from: supplier }),
				"Lock: locked"
			)
		})

		it("Product exists", async () => {
			assert.isFalse(await instance.productExists(getHash("a4165")))
			assert.isFalse(await instance.productExists(getHash("0")))
		})
	})
})
