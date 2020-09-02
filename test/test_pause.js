const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const { version, ZERO_ADDRESS } = require("./utils");

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const OwnedRegistry = artifacts.require("OwnedRegistry")
const LogisticInterface = artifacts.require("LogisticInterface")

contract("Pause", async accounts => {
	const [owner, other] = accounts

	describe("PauseImplementation", async () => {
		before(async function () {
			// Create proxy
			const ownedRegistry = await OwnedRegistry.deployed()
		    const { logs } = await ownedRegistry.createProxy(version)
			const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
			instance = await LogisticInterface.at(proxy)
	    });

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
			await truffleAssert.reverts(
				instance.pause({ from: owner }),
				"Pausable: paused"
			)

			await instance.unpause({ from: owner })
			assert.equal((await instance.getPaused()), false)
			await truffleAssert.reverts(
				instance.unpause({ from: owner }),
				"Pausable: not paused"
			)
		})

		// it("Pause when incorrect state", async () => {
		// 	await instance.transferOwnership(ZERO_ADDRESS, { from: owner })
		// 	assert.equal((await instance.getPaused()), true)
		// })
	})
})
