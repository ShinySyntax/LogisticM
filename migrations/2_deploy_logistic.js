const { registerV0 } = require("../registerer/registerV0");

const RolesLibrary = artifacts.require('./RolesLibrary.sol')
const OwnerImplementation = artifacts.require('./OwnerImplementation.sol')
const AccessImplementation = artifacts.require('./AccessImplementation.sol')
const ERC721LogisticImplementation = artifacts.require('./ERC721LogisticImplementation.sol')
const NameImplementation = artifacts.require('./NameImplementation.sol')
const PauseImplementation = artifacts.require('./PauseImplementation.sol')
const ProductImplementation = artifacts.require('./ProductImplementation.sol')

const Ownable = artifacts.require('./Ownable.sol')

const Registry = artifacts.require('./Registry.sol')

module.exports = async (deployer) => {
	await deployer.deploy(RolesLibrary)
	await deployer.link(RolesLibrary, AccessImplementation);

	await deployer.deploy(OwnerImplementation)
	await deployer.deploy(AccessImplementation)
	await deployer.deploy(ERC721LogisticImplementation)
	await deployer.deploy(NameImplementation)
	await deployer.deploy(PauseImplementation)
	await deployer.deploy(ProductImplementation)

	await deployer.deploy(Ownable)

	const registry = await deployer.deploy(Registry)

	await registerV0(registry, [
		OwnerImplementation.address,
		AccessImplementation.address,
		ERC721LogisticImplementation.address,
		NameImplementation.address,
		PauseImplementation.address,
		ProductImplementation.address
	])
}
