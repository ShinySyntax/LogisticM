const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Logistic = artifacts.require("Logistic")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


contract("Pausable test", async accounts => {
	const owner = accounts[0]
	const user = accounts[1]

	it("Test initialization", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.pause({ from: user }),
			"Ownable: caller is not the owner"
		)
		await truffleAssert.reverts(
			instance.unpause({ from: user }),
			"Ownable: caller is not the owner"
		)

		await instance.pause({ from: owner })
		assert.equal((await instance.getPaused()), true)



		await instance.unpause({ from: owner })
		assert.equal((await instance.getPaused()), false)

	})
})
