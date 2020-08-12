const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Logistic = artifacts.require("Logistic")
const LogisticBase = artifacts.require("LogisticBase")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


contract("Pausable test", async accounts => {
	const owner = accounts[0]
	const user = accounts[1]

	it("Test initialization", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logisticBase.pause({ from: user }),
			"Ownable: caller is not the owner"
		)
		await truffleAssert.reverts(
			logisticBase.unpause({ from: user }),
			"Ownable: caller is not the owner"
		)

		await logisticBase.pause({ from: owner })
		assert.equal((await logisticBase.getPaused()), true)



		await logisticBase.unpause({ from: owner })
		assert.equal((await logisticBase.getPaused()), false)

	})
})
