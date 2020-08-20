const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')
const ethersUtils = require('ethers').utils

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticProxy = artifacts.require("LogisticProxy")
const LogisticInterface = artifacts.require("LogisticInterface")

const nameTestSuite = async (instance, accounts) => {
	const [owner, other] = accounts

	describe("NameImplementation", async () => {
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
			assert.equal(await instance.getName(other), name)
			assert.equal(await instance.getAddress(nameBytes), other)
		})
	})
}

module.exports.nameTestSuite = nameTestSuite
