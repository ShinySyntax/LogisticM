const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const { version, getHash } = require('./utils')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const OwnedRegistry = artifacts.require("OwnedRegistry")
const LogisticInterface = artifacts.require("LogisticInterface")

contract("ERC721 Token", async (accounts) => {
	const [owner, other] = accounts

	before(async function () {
		// Create proxy
		const ownedRegistry = await OwnedRegistry.deployed()
	    const { logs } = await ownedRegistry.createProxy(version)
		const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
		instance = await LogisticInterface.at(proxy)
	});

	beforeEach(async function () {
		await instance.setLock(false, { from: owner })
	})

	afterEach(async function () {
		await instance.setLock(true, { from: owner })
	})

	it("Initialize", async () => {
		await truffleAssert.reverts(
			instance.initializeERC721({ from: owner }),
			"Upgradeable: bad caller"
		)
	})

	it("Get counter", async () => {
		assert.equal((await instance.getCounter()), 0)
	})

	it("Mint", async () => {
		let result = await instance.mint(other)
		assert.equal((await instance.ownerOf(0)), other)
	})

	it("Approve", async () => {
		let result = await instance.approve(owner, 0, { from: other })
		assert.equal((await instance.getApproved(0)), owner)
	})

	it("Transfer", async () => {
		let result = await instance.transferFrom(other, owner, 0, { from: owner })
		assert.equal((await instance.ownerOf(0)), owner)
	})

	it("setApprovalForAll", async () => {
		await truffleAssert.reverts(
			instance.setApprovalForAll(owner, true, { from: other }),
			"ERC721Logistic: can not approve for all"
		);
	})

	it("safeTransferFrom", async () => {
		await truffleAssert.reverts(
			instance.safeTransferFrom(owner, other, 0),
			"ERC721Logistic: can not transfer"
		);
		await truffleAssert.reverts(
			instance.safeTransferFrom(owner, other, 0, getHash("0")),
			"ERC721Logistic: can not transfer"
		);
	})
})
