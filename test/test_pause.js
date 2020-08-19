const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticProxy = artifacts.require("LogisticProxy")
const LogisticInterface = artifacts.require("LogisticInterface")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const pauseTestSuite = async (instance, accounts) => {
	const [owner, other] = accounts

	describe("PauseImplementation", async () => {
		it("Pause and unpause", async () => {

			await truffleAssert.reverts(
				instance.pause({ from: other }),
				"Ownable: caller is not the owner"
			)
			await truffleAssert.reverts(
				instance.unpause({ from: other }),
				"Ownable: caller is not the owner"
			)

			await instance.pause({ from: owner })
			assert.equal((await instance.getPaused()), true)

			await instance.unpause({ from: owner })
			assert.equal((await instance.getPaused()), false)

		})

		// it("Pause when incorrect state", async () => {
		// 	await instance.transferOwnership(ZERO_ADDRESS, { from: owner })
		// 	await truffleAssert.reverts(
		// 			instance.transferOwnership(ZERO_ADDRESS, { from: owner }),
		// 			"Owner: new owner is the zero address"
		// 	)
		// 	assert.equal((await instance.getPaused()), true)
		// })
	})
}

module.exports.pauseTestSuite = pauseTestSuite
