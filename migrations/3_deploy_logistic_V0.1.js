const Web3 = require('web3')
const { networks } = require('../truffle-config.js')

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
	const version = "V0.1"

	const registerFunction = async (registry, func, imp) => {
		try {
			await registry.addVersionFromName(version, func, imp)
		} catch (e) {
			console.error(e, func, imp);
		}
	}

	let ownedRegistry = await OwnedRegistry.deployed()

	// Deploy new implementation
	let product = await deployer.deploy(ProductImplementation)

	// Register Version
	await registerFunction(ownedRegistry, 'createProduct(address,bytes32,bytes32,bytes32)', await getAddress(HandoverImplementation))
	await registerFunction(ownedRegistry, 'send(address,bytes32)', await getAddress(HandoverImplementation))
	await registerFunction(ownedRegistry, 'receive(address,bytes32)', await getAddress(HandoverImplementation))

	await registerFunction(ownedRegistry, 'transferOwnership(address)', await getAddress(OwnerImplementation))
	await registerFunction(ownedRegistry, 'initializeOwner(address)', await getAddress(OwnerImplementation))
	await registerFunction(ownedRegistry, 'getOwner()', await getAddress(OwnerImplementation))

	await registerFunction(ownedRegistry, 'addSupplier(address)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'addSupplierWithName(address,bytes32)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'removeSupplier(address)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'renounceSupplier()', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'addDeliveryMan(address)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'addDeliveryManWithName(address,bytes32)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'removeDeliveryMan(address)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'renounceDeliveryMan()', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'getRole(address)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'isSupplier(address)', await getAddress(AccessImplementation))
	await registerFunction(ownedRegistry, 'isDeliveryMan(address)', await getAddress(AccessImplementation))

	await registerFunction(ownedRegistry, 'initializeERC721()', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'mint(address)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'getCounter()', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'balanceOf(address)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'ownerOf(uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'safeTransferFrom(address,address,uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'transferFrom(address,address,uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'approve(address,uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'getApproved(uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'setApprovalForAll(address,bool)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'isApprovedForAll(address,address)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'safeTransferFrom(address,address,uint256,bytes)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'name()', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'symbol()', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'tokenURI(uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'totalSupply()', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'tokenOfOwnerByIndex(address,uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'tokenByIndex(uint256)', await getAddress(ERC721LogisticImplementation))
	await registerFunction(ownedRegistry, 'supportsInterface(bytes4)', await getAddress(ERC721LogisticImplementation))

	await registerFunction(ownedRegistry, 'setName(address,bytes32)', await getAddress(NameImplementation))
	await registerFunction(ownedRegistry, 'getName(address)', await getAddress(NameImplementation))
	await registerFunction(ownedRegistry, 'getAddress(bytes32)', await getAddress(NameImplementation))

	await registerFunction(ownedRegistry, 'getPaused()', await getAddress(PauseImplementation))
	await registerFunction(ownedRegistry, 'pause()', await getAddress(PauseImplementation))
	await registerFunction(ownedRegistry, 'unpause()', await getAddress(PauseImplementation))

	await registerFunction(ownedRegistry, 'newProduct(bytes32,address,bytes32)', await getAddress(ProductImplementation))
	await registerFunction(ownedRegistry, 'setProductSent(bytes32,address,address)', await getAddress(ProductImplementation))
	await registerFunction(ownedRegistry, 'setProductReceived(bytes32,address,address)', await getAddress(ProductImplementation))
	await registerFunction(ownedRegistry, 'getProductInfo(bytes32)', await getAddress(ProductImplementation))
	await registerFunction(ownedRegistry, 'productSentFrom(bytes32,address)', await getAddress(ProductImplementation))
	await registerFunction(ownedRegistry, 'productReceivedFrom(bytes32,address)', await getAddress(ProductImplementation))
	await registerFunction(ownedRegistry, 'getHashFromTokenId(uint256)', await getAddress(ProductImplementation))
	await registerFunction(ownedRegistry, 'productExists(bytes32)', await getAddress(ProductImplementation))

	// Create a web3 instance
	let provider;
	if (networks[network].provider) {
		provider = networks[network].provider()
		// deployer.provider = provider
	} else {
		provider = deployer.provider
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
