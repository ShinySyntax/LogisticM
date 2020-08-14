const OwnerImplementation = artifacts.require('./OwnerImplementation.sol')
const AccessImplementation = artifacts.require('./AccessImplementation.sol')
const ERC721LogisticImplementation = artifacts.require('./ERC721LogisticImplementation.sol')
const NameImplementation = artifacts.require('./NameImplementation.sol')
const PauseImplementation = artifacts.require('./PauseImplementation.sol')
const ProductImplementation = artifacts.require('./ProductImplementation.sol')

const Registry = artifacts.require('./Registry.sol')

module.exports = async (deployer) => {
	await deployer.deploy(OwnerImplementation)
	await deployer.deploy(AccessImplementation)
	await deployer.deploy(ERC721LogisticImplementation)
	await deployer.deploy(NameImplementation)
	await deployer.deploy(PauseImplementation)
	await deployer.deploy(ProductImplementation)

	const registry = await deployer.deploy(Registry)


	// Register V0 implementations
	await registry.addVersionFromName('0', 'transferOwnership(address)', OwnerImplementation.address)
	await registry.addVersionFromName('0', 'getOwner()', OwnerImplementation.address)

	await registry.addVersionFromName('0', 'addSupplier(address)', AccessImplementation.address)
	await registry.addVersionFromName('0', 'removeSupplier(address)', AccessImplementation.address)
	await registry.addVersionFromName('0', 'renounceSupplier()', AccessImplementation.address)
	await registry.addVersionFromName('0', 'addDeliveryMan(address)', AccessImplementation.address)
	await registry.addVersionFromName('0', 'removeDeliveryMan(address)', AccessImplementation.address)
	await registry.addVersionFromName('0', 'renounceDeliveryMan()', AccessImplementation.address)
	await registry.addVersionFromName('0', 'getRole(address)', AccessImplementation.address)
	await registry.addVersionFromName('0', 'isSupplier(address)', AccessImplementation.address)
	await registry.addVersionFromName('0', 'isDeliveryMan(address)', AccessImplementation.address)

	await registry.addVersionFromName('0', 'mint(address)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'getCounter()', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'balanceOf(address)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'ownerOf(uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'safeTransferFrom(address,address,uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'transferFrom(address,address,uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'approve(address,uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'getApproved(uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'setApprovalForAll(address,bool)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'isApprovedForAll(address,address)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'safeTransferFrom(address,address,uint256,bytes)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'name()', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'symbol()', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'tokenURI(uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'totalSupply()', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'tokenOfOwnerByIndex(address,uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'tokenByIndex(uint256)', ERC721LogisticImplementation.address)
	await registry.addVersionFromName('0', 'supportsInterface(bytes4)', ERC721LogisticImplementation.address)

	await registry.addVersionFromName('0', 'setName(address,string)', NameImplementation.address)
	await registry.addVersionFromName('0', 'getName(address)', NameImplementation.address)
	await registry.addVersionFromName('0', 'getAddress(string)', NameImplementation.address)

	await registry.addVersionFromName('0', 'getPaused()', PauseImplementation.address)
	await registry.addVersionFromName('0', 'pause()', PauseImplementation.address)
	await registry.addVersionFromName('0', 'internalPause()', PauseImplementation.address)
	await registry.addVersionFromName('0', 'unpause()', PauseImplementation.address)
	await registry.addVersionFromName('0', 'internalUnpause()', PauseImplementation.address)

	await registry.addVersionFromName('0', 'newProduct(bytes32,address,uint256,string)', ProductImplementation.address)
	await registry.addVersionFromName('0', 'setProductSent(bytes32,address,address,string)', ProductImplementation.address)
	await registry.addVersionFromName('0', 'setProductReceived(bytes32,address,address,string)', ProductImplementation.address)
	await registry.addVersionFromName('0', 'getProductInfo(bytes32)', ProductImplementation.address)
	await registry.addVersionFromName('0', 'productsSentFrom(bytes32,address)', ProductImplementation.address)
	await registry.addVersionFromName('0', 'productsReceivedFrom(bytes32,address)', ProductImplementation.address)
	await registry.addVersionFromName('0', 'productExists(bytes32,address)', ProductImplementation.address)

	// Create proxy
    await registry.createProxy('0')
}
