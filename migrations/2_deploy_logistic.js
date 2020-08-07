const Logistic = artifacts.require('./Logistic.sol')
const ProductLibrary = artifacts.require('./ProductLibrary.sol')

module.exports = deployer => {
	deployer.deploy(ProductLibrary)
	deployer.link(ProductLibrary, Logistic)
	deployer.deploy(Logistic)
}
