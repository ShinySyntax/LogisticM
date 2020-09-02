const { registerV0 } = require("../registerer/registerV0");

const RolesLibrary = artifacts.require('./RolesLibrary.sol')
const OwnerImplementation = artifacts.require('./OwnerImplementation.sol')
const AccessImplementation = artifacts.require('./AccessImplementation.sol')
const ERC721LogisticImplementation = artifacts.require('./ERC721LogisticImplementation.sol')
const NameImplementation = artifacts.require('./NameImplementation.sol')
const PauseImplementation = artifacts.require('./PauseImplementation.sol')
const ProductImplementation = artifacts.require('./ProductImplementation.sol')

const OwnedRegistry = artifacts.require('./OwnedRegistry.sol')

module.exports = async (deployer) => {
	await deployer.deploy(RolesLibrary)
	await deployer.link(RolesLibrary, AccessImplementation);

	const ownedRegistry = await deployer.deploy(OwnedRegistry)

	await deployer.deploy(OwnerImplementation)
	await deployer.deploy(AccessImplementation, OwnedRegistry.address, '0')
	await deployer.deploy(ERC721LogisticImplementation)
	await deployer.deploy(NameImplementation)
	await deployer.deploy(PauseImplementation)
	await deployer.deploy(ProductImplementation)

	await registerV0(ownedRegistry, [
		OwnerImplementation.address,
		AccessImplementation.address,
		ERC721LogisticImplementation.address,
		NameImplementation.address,
		PauseImplementation.address,
		ProductImplementation.address
	])
}
