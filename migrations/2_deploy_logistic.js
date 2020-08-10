const Logistic = artifacts.require('./Logistic.sol')
const LogisticBase = artifacts.require('./LogisticBase.sol')

module.exports = async (deployer) => {
	await deployer.deploy(LogisticBase);
	await deployer.deploy(Logistic, LogisticBase.address);

	deployer.deploy(LogisticBase)
	.then(() => {
		return deployer.deploy(Logistic, LogisticBase.address);
	})
	.then(() => {
		return LogisticBase.deployed()
	})
	.then(logisticBase => {
		logisticBase.setLogistic(Logistic.address);
	});
}
