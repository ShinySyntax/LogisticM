const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticProxy = artifacts.require("LogisticProxy")
const LogisticInterface = artifacts.require("LogisticInterface")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


contract("Pausable test", async ([owner, other]) => {
	// Create proxy
	registry = Registry.deployed()
	instance = new web3.eth.Contract(Registry.abi, Registry.address)
	let events = await instance.getPastEvents('ProxyCreated', {fromBlock: 0})
	const proxyAddress = events[0].returnValues.proxy
	proxy = await LogisticProxy.at(proxyAddress)
	instance = await LogisticInterface.at(proxy.address)

	it("Pause", async () => {

		await truffleAssert.reverts(
			proxy.pause({ from: other }),
			"Ownable: caller is not the owner"
		)
		await truffleAssert.reverts(
			proxy.unpause({ from: other }),
			"Ownable: caller is not the owner"
		)

		await proxy.pause({ from: owner })
		assert.equal((await proxy.getPaused()), true)

		await proxy.unpause({ from: owner })
		assert.equal((await proxy.getPaused()), false)

	})
})
