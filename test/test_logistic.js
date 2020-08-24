const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const { products, getHash } = require('./utils')

const { accessTestSuite }  = require('./test_access')
const { nameTestSuite }  = require('./test_name')
const { pauseTestSuite }  = require('./test_pause')
const { productTestSuite }  = require('./test_product')
const { ERC721TestSuite }  = require('./test_ERC721')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticInterface = artifacts.require("LogisticInterface")

contract("Logistic", async accounts => {
	const [owner, supplier, deliveryMan1, deliveryMan2, purchaser, other] = accounts
	let instance;

	describe("Logistic", async function () {
		before(async function () {
			// Create proxy
			const registry = await Registry.deployed()
		    const { logs } = await registry.createProxy('0')
			const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
			instance = await LogisticInterface.at(proxy)

			await instance.addSupplier(supplier, { from: owner })
			await instance.addDeliveryMan(deliveryMan1, { from: owner })
			await instance.addDeliveryMan(deliveryMan2, { from: owner })
		})

		it("Create product", async () => {
			await truffleAssert.reverts(
				instance.createProduct(purchaser, products[1].hash,
					products[1].name, "John",
					{ from: other }),
				"Logistic: Caller is not Supplier"
			);
			await truffleAssert.reverts(
				instance.createProduct(deliveryMan1, products[1].hash,
					products[1].name, "John",
					{ from: supplier }),
				"Logistic: Invalid purchaser"
			);

			let result = await instance.createProduct(
				purchaser, products[0].hash, products[0].name, "John",
				{ from: supplier });
			assert.equal(await instance.getHashFromTokenId(products[0].tokenId), products[0].hash);
			assert.equal(await instance.ownerOf(products[0].tokenId), supplier);
			let info = await instance.getProductInfo(products[0].hash);
			assert.equal(info.purchaser, purchaser)
			assert.equal(info.productName, products[0].name)
			assert.equal(info.tokenId.words[0], products[0].tokenId)
			assert.isTrue(await instance.productExists(products[0].hash));

			await truffleAssert.reverts(
				instance.createProduct(
					purchaser, products[0].hash, products[0].name, "John",
					{ from: supplier }),
				"Logistic: This product already exists"
			);
		})

		describe("Handover supplier -> deliveryMan1", async function () {
			it("Send product", async () => {
				let result = await instance.send(deliveryMan1, products[0].hash,
					{ from: supplier })
				})
			it("Receive product", async () => {
				let result = await instance.receive(supplier, products[0].hash,
					{ from: deliveryMan1 })
				truffleAssert.eventEmitted(result, 'Handover', ev =>
					ev.from === supplier &&
					ev.to === deliveryMan1 &&
					ev.productHash === products[0].hash &&
					ev.productName === products[0].name
				);
			})
		})

		describe("Handover deliveryMan1 -> deliveryMan2", async function () {
			it("Receive product", async () => {
				let result = await instance.receive(deliveryMan1, products[0].hash,
					{ from: deliveryMan2 })
			})
			it("Send product", async () => {
				let result = await instance.send(deliveryMan2, products[0].hash,
					{ from: deliveryMan1 })
				truffleAssert.eventEmitted(result, 'Handover', ev =>
					ev.from === deliveryMan1 &&
					ev.to === deliveryMan2 &&
					ev.productHash === products[0].hash &&
					ev.productName === products[0].name
				);
			})
		})

		describe("When paused", async function() {
			before(async function() {
				await instance.pause({ from: owner })
			})

			it("Create product", async () => {
				await truffleAssert.reverts(
					instance.createProduct(
						purchaser, products[0].hash, products[0].name, "John",
						{ from: supplier }),
					"Pausable: paused"
				)
			})
			it("Send product", async () => {
				await truffleAssert.reverts(
					instance.send(deliveryMan1, products[0].hash,
						{ from: supplier }),
					"Pausable: paused"
				)
			})
		})
	})
})
