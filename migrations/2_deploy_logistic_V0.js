const RolesLibrary = artifacts.require('./RolesLibrary.sol')
const OwnerImplementation = artifacts.require('./OwnerImplementation.sol')
const AccessImplementation = artifacts.require('./AccessImplementation.sol')
const ERC721LogisticImplementation = artifacts.require('./ERC721LogisticImplementation.sol')
const NameImplementation = artifacts.require('./NameImplementation.sol')
const PauseImplementation = artifacts.require('./PauseImplementation.sol')
const ProductImplementation = artifacts.require('./ProductImplementation.sol')
const HandoverImplementation = artifacts.require('./HandoverImplementation.sol')

const OwnedRegistry = artifacts.require('./OwnedRegistry.sol')

module.exports = async (deployer) => {
	const version = "V0"

	await deployer.deploy(RolesLibrary)

	const ownedRegistry = await deployer.deploy(OwnedRegistry)

	await deployer.deploy(OwnerImplementation)
	await deployer.link(RolesLibrary, AccessImplementation);
	await deployer.deploy(AccessImplementation, OwnedRegistry.address, version)
	await deployer.deploy(ERC721LogisticImplementation)
	await deployer.deploy(NameImplementation)
	await deployer.deploy(PauseImplementation)
	await deployer.deploy(ProductImplementation)
	await deployer.deploy(HandoverImplementation, OwnedRegistry.address, version)

	// Register Version 0
	await ownedRegistry.addVersionFromName(version, 'createProduct(address,bytes32,bytes32,bytes32)', HandoverImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'send(address,bytes32)', HandoverImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'receive(address,bytes32)', HandoverImplementation.address)

	await ownedRegistry.addVersionFromName(version, 'transferOwnership(address)', OwnerImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'initializeOwner(address)', OwnerImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getOwner()', OwnerImplementation.address)

	await ownedRegistry.addVersionFromName(version, 'addSupplier(address)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'addSupplierWithName(address,bytes32)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'removeSupplier(address)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'renounceSupplier()', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'addDeliveryMan(address)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'addDeliveryManWithName(address,bytes32)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'removeDeliveryMan(address)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'renounceDeliveryMan()', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getRole(address)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'isSupplier(address)', AccessImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'isDeliveryMan(address)', AccessImplementation.address)

	await ownedRegistry.addVersionFromName(version, 'initializeERC721()', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'mint(address)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getCounter()', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'balanceOf(address)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'ownerOf(uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'safeTransferFrom(address,address,uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'transferFrom(address,address,uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'approve(address,uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getApproved(uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'setApprovalForAll(address,bool)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'isApprovedForAll(address,address)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'safeTransferFrom(address,address,uint256,bytes)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'name()', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'symbol()', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'tokenURI(uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'totalSupply()', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'tokenOfOwnerByIndex(address,uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'tokenByIndex(uint256)', ERC721LogisticImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'supportsInterface(bytes4)', ERC721LogisticImplementation.address)

	await ownedRegistry.addVersionFromName(version, 'setName(address,bytes32)', NameImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getName(address)', NameImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getAddress(bytes32)', NameImplementation.address)

	await ownedRegistry.addVersionFromName(version, 'getPaused()', PauseImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'pause()', PauseImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'unpause()', PauseImplementation.address)

	await ownedRegistry.addVersionFromName(version, 'newProduct(bytes32,address,uint256,bytes32)', ProductImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'setProductSent(bytes32,address,address)', ProductImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'setProductReceived(bytes32,address,address)', ProductImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getProductInfo(bytes32)', ProductImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'productSentFrom(bytes32,address)', ProductImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'productReceivedFrom(bytes32,address)', ProductImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'getHashFromTokenId(uint256)', ProductImplementation.address)
	await ownedRegistry.addVersionFromName(version, 'productExists(bytes32)', ProductImplementation.address)

	// Create proxy
    const { logs } = await ownedRegistry.createProxy(version)
	const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
	console.log(`Proxy created at ${proxy}`);
}
