const registerV0 = async (ownedRegistry, [OwnerAddress,
AccessAddress,
ERC721LogisticAddress,
NameAddress,
PauseAddress,
ProductAddress]) => {
	// Register V0 implementations
	await ownedRegistry.addVersionFromName('0', 'transferOwnership(address)', OwnerAddress)
	await ownedRegistry.addVersionFromName('0', 'initializeOwner(address)', OwnerAddress)
	await ownedRegistry.addVersionFromName('0', 'getOwner()', OwnerAddress)

	await ownedRegistry.addVersionFromName('0', 'addSupplier(address)', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'removeSupplier(address)', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'renounceSupplier()', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'addDeliveryMan(address)', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'removeDeliveryMan(address)', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'renounceDeliveryMan()', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'getRole(address)', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'isSupplier(address)', AccessAddress)
	await ownedRegistry.addVersionFromName('0', 'isDeliveryMan(address)', AccessAddress)

	await ownedRegistry.addVersionFromName('0', 'initializeERC721()', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'mint(address)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'getCounter()', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'balanceOf(address)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'ownerOf(uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'safeTransferFrom(address,address,uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'transferFrom(address,address,uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'approve(address,uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'getApproved(uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'setApprovalForAll(address,bool)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'isApprovedForAll(address,address)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'safeTransferFrom(address,address,uint256,bytes)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'name()', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'symbol()', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'tokenURI(uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'totalSupply()', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'tokenOfOwnerByIndex(address,uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'tokenByIndex(uint256)', ERC721LogisticAddress)
	await ownedRegistry.addVersionFromName('0', 'supportsInterface(bytes4)', ERC721LogisticAddress)

	await ownedRegistry.addVersionFromName('0', 'setName(address,bytes32)', NameAddress)
	await ownedRegistry.addVersionFromName('0', 'getName(address)', NameAddress)
	await ownedRegistry.addVersionFromName('0', 'getAddress(bytes32)', NameAddress)

	await ownedRegistry.addVersionFromName('0', 'getPaused()', PauseAddress)
	await ownedRegistry.addVersionFromName('0', 'pause()', PauseAddress)
	await ownedRegistry.addVersionFromName('0', 'unpause()', PauseAddress)

	await ownedRegistry.addVersionFromName('0', 'newProduct(bytes32,address,uint256,bytes32)', ProductAddress)
	await ownedRegistry.addVersionFromName('0', 'setProductSent(bytes32,address,address)', ProductAddress)
	await ownedRegistry.addVersionFromName('0', 'setProductReceived(bytes32,address,address)', ProductAddress)
	await ownedRegistry.addVersionFromName('0', 'getProductInfo(bytes32)', ProductAddress)
	await ownedRegistry.addVersionFromName('0', 'productSentFrom(bytes32,address)', ProductAddress)
	await ownedRegistry.addVersionFromName('0', 'productReceivedFrom(bytes32,address)', ProductAddress)
	await ownedRegistry.addVersionFromName('0', 'getHashFromTokenId(uint256)', ProductAddress)
	await ownedRegistry.addVersionFromName('0', 'productExists(bytes32)', ProductAddress)

	// Create proxy
	await ownedRegistry.createProxy('0')
    // const { logs } = await ownedRegistry.createProxy('0')
	// const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
	// return proxy
}

module.exports.registerV0 = registerV0
