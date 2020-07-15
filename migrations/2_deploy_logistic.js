const Logistic = artifacts.require('./Logistic.sol')

module.exports = deployer => {
	deployer.deploy(Logistic)
}
