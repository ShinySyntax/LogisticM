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

		it("Only Owner", async () => {
			await truffleAssert.reverts(
				instance.pause({ from: other }),
				"Ownable: caller is not the owner"
			)
			await truffleAssert.reverts(
				instance.unpause({ from: other }),
				"Ownable: caller is not the owner"
			)
		})

		it("Pause", async () => {
			await instance.pause({ from: owner })
			assert.isTrue((await instance.getPaused()))
			await truffleAssert.reverts(
				instance.pause({ from: owner }),
				"Pausable: paused"
			)
		})

		it("UnPause", async () => {
			await instance.unpause({ from: owner })
			assert.equal((await instance.getPaused()), false)
			await truffleAssert.reverts(
				instance.unpause({ from: owner }),
				"Pausable: not paused"
			)
		})

		it("when unlock", async () => {
			await instance.pause({ from: owner })
			await instance.setLock(false, { from: owner })

			await truffleAssert.reverts(
				instance.unpause({ from: owner }),
				"Pause: contract is unlock"
			)
		})

		// it("Pause when incorrect state", async () => {
		// 	await instance.transferOwnership(ZERO_ADDRESS, { from: owner })
		// 	assert.equal((await instance.getPaused()), true)
		// })
	})
})
