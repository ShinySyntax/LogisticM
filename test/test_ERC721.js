const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticProxy = artifacts.require("LogisticProxy")
const LogisticInterface = artifacts.require("LogisticInterface")

const ERC721TestSuite = async (accounts) => {
	const [owner, other] = accounts

	describe("ERC721", async () => {
		before(async function () {
			// Create proxy
			const registry = await Registry.deployed()
		    const { logs } = await registry.createProxy('0')
			const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
			instance = await LogisticInterface.at(proxy)
	    });

		beforeEach(async function () {
			await instance.setLock(false, { from: owner })
		})

		afterEach(async function () {
			await instance.setLock(true, { from: owner })
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
	})
}

module.exports.ERC721TestSuite = ERC721TestSuite
