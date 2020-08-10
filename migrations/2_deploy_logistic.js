const Logistic = artifacts.require('./Logistic.sol')
const ProductManager = artifacts.require('./ProductManager.sol')

module.exports = async deployer => {
	await deployer.deploy(ProductManager)
	await deployer.deploy(Logistic, ProductManager.address)
}
