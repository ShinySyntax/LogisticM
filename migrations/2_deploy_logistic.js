const Logistic = artifacts.require('./Logistic.sol')
const ProductManager = artifacts.require('./ProductManager.sol')
const Pausable = artifacts.require('./Pausable.sol')
const ERC721Restricted = artifacts.require('./ERC721Restricted.sol')
const NamedAccount = artifacts.require('./NamedAccount.sol')

module.exports = async deployer => {
	await deployer.deploy(ERC721Restricted)

	await deployer.deploy(NamedAccount)
	await deployer.link(NamedAccount, Pausable);
	await deployer.deploy(Pausable)

	await deployer.deploy(ProductManager)
	await deployer.deploy(Logistic, ProductManager.address)
}
