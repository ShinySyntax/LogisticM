const truffleAssert = require('truffle-assertions')
const truffleContract = require("@truffle/contract")
var Web3 = require('web3')

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Logistic = artifacts.require("Logistic")
const ERC721Restricted = artifacts.require("ERC721Restricted")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


contract("Proxy test", async accounts => {
	const owner = accounts[0]
	const user = accounts[1]
	let result;

	it("Test initialization", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await ERC721Restricted.deployed()
		let proxy = await ERC721Restricted.at(Logistic.address)
		// console.log(proxy);

		result = await proxy.howIsCalling({from: user});
		console.log(result.logs[0].args);
	})
})
