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
const LogisticProxy = artifacts.require("LogisticProxy")
const LogisticInterface = artifacts.require("LogisticInterface")

contract("Logistic", async accounts => {
	const [owner, supplier, deliveryMan1, deliveryMan2, purchaser, other] = accounts
	let instance;

	before(async function () {
		// Create proxy
		const registry = await Registry.deployed()
	    const { logs } = await registry.createProxy('0')
		const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
		instance = await LogisticInterface.at(proxy)
    });

	it("Implementations", async () => {
		await accessTestSuite(instance, accounts)
		await nameTestSuite(instance, accounts)
		await pauseTestSuite(instance, accounts)
		await productTestSuite(instance, accounts)
		await ERC721TestSuite(instance, accounts)
	})

	describe("Logistic", async function () {
		before(async function () {
			await instance.addSupplier(supplier, { from: owner })
			await instance.addDeliveryMan(deliveryMan1, { from: owner })
			await instance.addDeliveryMan(deliveryMan2, { from: owner })
		})

		it("Create product", async () => {
			// await truffleAssert.reverts(
			// 	instance.createProduct(purchaser, products[1].hash,
			// 		products[1].name, "John",
			// 		{ from: other }),
			// 	"Logistic: Caller is not Supplier"
			// );
			// await truffleAssert.reverts(
			// 	instance.createProduct(deliveryMan1, products[1].hash,
			// 		products[1].name, "John",
			// 		{ from: supplier }),
			// 	"Logistic: Invalid purchaser"
			// );

			// await instance.setLock(false, { from: owner })
			// await instance.newProduct(getHash("99"), purchaser,
			// 	products[0].tokenId, products[0].nameBytes32, { from: supplier });
			// await instance.setLock(true, { from: owner })
			// await truffleAssert.reverts(
			// 	instance.createProduct(purchaser, getHash("99"),
			// 		products[1].name, "John",
			// 		{ from: supplier }),
			// 	"Logistic: This product already exists"
			// );
			// console.log(await instance.getCounter()); // BN 0

			let result = await instance.createProduct(
				purchaser, products[1].hash, products[1].name, "John",
				{ from: supplier })
			assert.equal(await instance.getHashFromTokenId(products[1].tokenId),products[1].hash);
			let info = await instance.getProductInfo(products[1].hash)
			assert.equal(info.purchaser, purchaser)
			assert.equal(info.productName, products[1].name)
			assert.equal(info.tokenId.words[1], products[1].tokenId)
			assert.isTrue(await instance.productExists(products[1].hash));
		})

		// describe("Handover supplier -> deliveryMan1", async function () {
		// 	it("Send product", async () => {
		// 		let result = await instance.send(deliveryMan1, products[1].hash,
		// 			{ from: supplier })
		// 		})
		// 	it("Receive product", async () => {
		// 		let result = await instance.receive(supplier, products[1].hash,
		// 			{ from: deliveryMan1 })
		// 		truffleAssert.eventEmitted(result, 'Handover', ev =>
		// 			ev.from === supplier &&
		// 			ev.to === deliveryMan1 &&
		// 			ev.productHash === products[1].hash &&
		// 			ev.productName === products[1].name
		// 		);
		// 	})
		// })
		//
		// describe("Handover deliveryMan1 -> deliveryMan2", async function () {
		// 	it("Receive product", async () => {
		// 		let result = await instance.receive(deliveryMan1, products[1].hash,
		// 			{ from: deliveryMan2 })
		// 	})
		// 	it("Send product", async () => {
		// 		let result = await instance.send(deliveryMan2, products[1].hash,
		// 			{ from: deliveryMan1 })
		// 		truffleAssert.eventEmitted(result, 'Handover', ev =>
		// 			ev.from === supplier &&
		// 			ev.to === deliveryMan1 &&
		// 			ev.productHash === products[1].hash &&
		// 			ev.productName === products[1].name
		// 		);
		// 	})
		// })
		//
		// describe("When paused", async function() {
		// 	before(async function() {
		// 		await instance.pause({ from: owner })
		// 	})
		//
		// 	it("Create product", async () => {
		// 		await truffleAssert.reverts(
		// 			instance.createProduct(
		// 				purchaser, products[1].hash, products[1].name, "John",
		// 				{ from: supplier }),
		// 			"Pausable: paused"
		// 		)
		// 	})
		// 	it("Send product", async () => {
		// 		await truffleAssert.reverts(
		// 			instance.send(deliveryMan1, products[1].hash,
		// 				{ from: supplier }),
		// 			"Pausable: paused"
		// 		)
		// 	})
		// })
	})
})
