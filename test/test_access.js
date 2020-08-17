const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticProxy = artifacts.require("LogisticProxy")
const LogisticInterface = artifacts.require("LogisticInterface")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const RolesLibrary = artifacts.require('./RolesLibrary.sol')
const OwnerImplementation = artifacts.require('./OwnerImplementation.sol')
const AccessImplementation = artifacts.require('./AccessImplementation.sol')
const ERC721LogisticImplementation = artifacts.require('./ERC721LogisticImplementation.sol')
const NameImplementation = artifacts.require('./NameImplementation.sol')
const PauseImplementation = artifacts.require('./PauseImplementation.sol')
const ProductImplementation = artifacts.require('./ProductImplementation.sol')

contract("Access", async accounts => {
	const [owner, supplier, deliveryMan, other] = accounts
	console.log(accounts);
	let instance;

	before(async function () {
		// Create proxy
		const registry = Registry.deployed()
		const registeryWeb3 = new web3.eth.Contract(Registry.abi, Registry.address)
		const proxyAddress = (await registeryWeb3.getPastEvents('ProxyCreated', {fromBlock: 0}))[0].returnValues.proxy
		// const proxy = await LogisticProxy.at(proxyAddress)
		instance = await LogisticInterface.at(proxyAddress)
		console.log("proxy       ", proxyAddress);
		console.log("registery   ", Registry.address);
    });

	it("Owner", async () => {
		let actualOwner = await instance.getOwner()
		console.log("actualOwner ", actualOwner);
		assert.equal(actualOwner, owner)
	})

	it("transferOwnership", async () => {
		await instance.transferOwnership(other, { from: owner })
		let actualOwner = await instance.getOwner()
		assert.equal(actualOwner, other)
		await instance.transferOwnership(owner, { from: other })
	})

	it("Add a supplier", async () => {
		let actualOwner = await instance.getOwner()
		console.log("actualOwner ", actualOwner);
		assert.equal(actualOwner, owner)
		await truffleAssert.reverts(
			instance.addSupplier(owner, { from: owner }),
			"Access: Owner can't be supplier"
		)

		assert.isFalse((await instance.isSupplier(supplier)))
		const result = await instance.addSupplier(supplier, { from: owner })
		truffleAssert.eventEmitted(result, 'SupplierAdded', ev =>
			ev.account === supplier
		);
		assert.isTrue((await instance.isSupplier(supplier)))

		await truffleAssert.reverts(
			instance.addSupplier(deliveryMan, { from: supplier }),
			"Ownable: caller is not the owner"
		)
	})

	describe('When other is supplier', function () {
		beforeEach(async function () {
			await instance.addSupplier(other, { from: owner })
		});
		it("Remove supplier", async () => {
			await instance.removeSupplier(other, { from: owner })
			assert.isFalse((await instance.isSupplier(other)))
		})

		it("Renounce supplier", async () => {
			await instance.renounceSupplier({ from: other })
			assert.isFalse((await instance.isSupplier(other)))
		})

		it("Other can't be delivery man", async () => {
			await truffleAssert.reverts(
				instance.addDeliveryMan(deliveryMan, { from: owner }),
				"RolesLibrary: roles already defined"
			)
		})

		after(async function () {
			await instance.renounceSupplier({ from: other })
		})
	})

	it("Add delivery men", async () => {
		await truffleAssert.reverts(
			instance.addDeliveryMan(owner, { from: owner }),
			"Access: Owner can't be delivery man"
		)

		assert.isFalse((await instance.isDeliveryMan(deliveryMan)))
		const result = await instance.addDeliveryMan(deliveryMan, { from: owner })
		assert.isTrue((await instance.isDeliveryMan(deliveryMan)))
		truffleAssert.eventEmitted(result, 'DeliveryManAdded', ev =>
			ev.account === deliveryMan
		);

		await truffleAssert.reverts(
			instance.addDeliveryMan(deliveryMan, { from: other }),
			"Ownable: caller is not the owner"
		)
	})

	describe('When other is delivery man', function () {
		beforeEach(async function () {
			await instance.addDeliveryMan(other, { from: owner })
		});
		it("Remove delivery man", async () => {
			await instance.removeDeliveryMan(other, { from: owner })
			assert.isFalse((await instance.isDeliveryMan(other)))
		})

		it("Renounce delivery man", async () => {
			await instance.renounceDeliveryMan({ from: other })
			assert.isFalse((await instance.isDeliveryMan(other)))
		})

		it("Other can't be supplier", async () => {
			await truffleAssert.reverts(
				instance.addSupplier(supplier, { from: owner }),
				"RolesLibrary: roles already defined"
			)
		})
	})
})
