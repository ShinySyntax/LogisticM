const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')
const ethersUtils = require('ethers').utils

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const OwnedRegistry = artifacts.require("OwnedRegistry")
const LogisticInterface = artifacts.require("LogisticInterface")

contract("Name", async accounts => {
	const [owner, other] = accounts

	before(async function () {
		// Create proxy
		const ownedRegistry = await OwnedRegistry.deployed()
	    const { logs } = await ownedRegistry.createProxy('0')
		const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
		instance = await LogisticInterface.at(proxy)
	});

	beforeEach(async function () {
		await instance.setLock(false, { from: owner })
	})

	afterEach(async function () {
		await instance.setLock(true, { from: owner })
	})

	it("Set name", async () => {
		let name = "John Doe"
		let nameBytes = ethersUtils.formatBytes32String(name)
		await instance.setName(other, nameBytes, { from: owner })
		await instance.setName(other, nameBytes, { from: owner }) // "rename" but with same name
		assert.equal(await instance.getName(other), name)
		assert.equal(await instance.getAddress(nameBytes), other)

		await truffleAssert.reverts(
			instance.setName(other, ethersUtils.formatBytes32String("Jack S."), { from: owner }),
			"Name: invalid name"
		)
		await truffleAssert.reverts(
			instance.setName(owner, nameBytes, { from: owner }),
			"Name: invalid address"
		)
	})
})
