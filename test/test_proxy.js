const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const { products, getHash } = require('./utils')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticInterface = artifacts.require("LogisticInterface")

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

contract("Proxy", async accounts => {
	const [owner, supplier, deliveryMan, purchaser, other] = accounts

	before(async function () {
		// Create proxy
		const registry = await Registry.deployed()
		const { logs } = await registry.createProxy('0')
		const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
		instance = await LogisticInterface.at(proxy)
	});


})
