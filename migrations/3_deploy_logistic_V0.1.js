const Web3 = require('web3')
const { networks } = require('../truffle-config.js')
const { version } = require('../test/utils.js')

const RolesLibrary = artifacts.require('./RolesLibrary.sol')
const OwnerImplementation = artifacts.require('./OwnerImplementation.sol')
const AccessImplementation = artifacts.require('./AccessImplementation.sol')
const ERC721LogisticImplementation = artifacts.require('./ERC721LogisticImplementation.sol')
const NameImplementation = artifacts.require('./NameImplementation.sol')
const PauseImplementation = artifacts.require('./PauseImplementation.sol')
const ProductImplementation = artifacts.require('./ProductImplementation.sol')
const HandoverImplementation = artifacts.require('./HandoverImplementation.sol')

const OwnedRegistry = artifacts.require('./OwnedRegistry.sol')
const LogisticInterface = artifacts.require('./LogisticInterface.sol')
const LogisticProxy = artifacts.require('./LogisticProxy.sol')

const getAddress = async Contract => {
	let contract = await Contract.deployed()
	return contract.address
}

module.exports = async (deployer, network) => {
	let ownedRegistry = await OwnedRegistry.deployed()

	// Deploy new implementation
	let product = await deployer.deploy(ProductImplementation)

	// Register Version
	await ownedRegistry.addVersionFromName(version, 'createProduct(address,bytes32,bytes32,bytes32)', await getAddress(HandoverImplementation))
	await ownedRegistry.addVersionFromName(version, 'send(address,bytes32)', await getAddress(HandoverImplementation))
	await ownedRegistry.addVersionFromName(version, 'receive(address,bytes32)', await getAddress(HandoverImplementation))

	await ownedRegistry.addVersionFromName(version, 'transferOwnership(address)', await getAddress(OwnerImplementation))
	await ownedRegistry.addVersionFromName(version, 'initializeOwner(address)', await getAddress(OwnerImplementation))
	await ownedRegistry.addVersionFromName(version, 'getOwner()', await getAddress(OwnerImplementation))

	await ownedRegistry.addVersionFromName(version, 'addSupplier(address)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'addSupplierWithName(address,bytes32)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'removeSupplier(address)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'renounceSupplier()', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'addDeliveryMan(address)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'addDeliveryManWithName(address,bytes32)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'removeDeliveryMan(address)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'renounceDeliveryMan()', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'getRole(address)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'isSupplier(address)', await getAddress(AccessImplementation))
	await ownedRegistry.addVersionFromName(version, 'isDeliveryMan(address)', await getAddress(AccessImplementation))

	await ownedRegistry.addVersionFromName(version, 'initializeERC721()', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'mint(address)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'getCounter()', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'balanceOf(address)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'ownerOf(uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'safeTransferFrom(address,address,uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'transferFrom(address,address,uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'approve(address,uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'getApproved(uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'setApprovalForAll(address,bool)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'isApprovedForAll(address,address)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'safeTransferFrom(address,address,uint256,bytes)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'name()', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'symbol()', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'tokenURI(uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'totalSupply()', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'tokenOfOwnerByIndex(address,uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'tokenByIndex(uint256)', await getAddress(ERC721LogisticImplementation))
	await ownedRegistry.addVersionFromName(version, 'supportsInterface(bytes4)', await getAddress(ERC721LogisticImplementation))

	await ownedRegistry.addVersionFromName(version, 'setName(address,bytes32)', await getAddress(NameImplementation))
	await ownedRegistry.addVersionFromName(version, 'getName(address)', await getAddress(NameImplementation))
	await ownedRegistry.addVersionFromName(version, 'getAddress(bytes32)', await getAddress(NameImplementation))

	await ownedRegistry.addVersionFromName(version, 'getPaused()', await getAddress(PauseImplementation))
	await ownedRegistry.addVersionFromName(version, 'pause()', await getAddress(PauseImplementation))
	await ownedRegistry.addVersionFromName(version, 'unpause()', await getAddress(PauseImplementation))

	await ownedRegistry.addVersionFromName(version, 'newProduct(bytes32,address,bytes32)', await getAddress(ProductImplementation))
	await ownedRegistry.addVersionFromName(version, 'setProductSent(bytes32,address,address)', await getAddress(ProductImplementation))
	await ownedRegistry.addVersionFromName(version, 'setProductReceived(bytes32,address,address)', await getAddress(ProductImplementation))
	await ownedRegistry.addVersionFromName(version, 'getProductInfo(bytes32)', await getAddress(ProductImplementation))
	await ownedRegistry.addVersionFromName(version, 'productSentFrom(bytes32,address)', await getAddress(ProductImplementation))
	await ownedRegistry.addVersionFromName(version, 'productReceivedFrom(bytes32,address)', await getAddress(ProductImplementation))
	await ownedRegistry.addVersionFromName(version, 'getHashFromTokenId(uint256)', await getAddress(ProductImplementation))
	await ownedRegistry.addVersionFromName(version, 'productExists(bytes32)', await getAddress(ProductImplementation))

	// Create a web3 instance
	let provider;
	if (networks[network].provider) {
		provider = networks[network].provider()
	} else {
		provider = Web3.currentProvider || Web3.givenProvider || new Web3.providers.HttpProvider('http://localhost:8545')
	}
	const web3 = new Web3(provider)

	// Get the proxy address
	let web3Registry = new web3.eth.Contract(OwnedRegistry.abi, OwnedRegistry.address)
	let event = (await web3Registry.getPastEvents({ fromBlock: 0 })).find(event => {
		return event.event === "ProxyCreated"
	})

	// Upgrade the proxy
	let proxy = await LogisticInterface.at(event.returnValues.proxy)
	await proxy.upgradeTo(version)
}
