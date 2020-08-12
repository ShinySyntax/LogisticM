const Logistic = artifacts.require('./Logistic.sol')
const ERC721Restricted = artifacts.require('./ERC721Restricted.sol')

module.exports = async (deployer) => {
	// await deployer.deploy(ERC721Restricted);
	// await deployer.deploy(Logistic, ERC721Restricted.address);

	deployer.deploy(ERC721Restricted)
	.then(() => {
		return deployer.deploy(Logistic, ERC721Restricted.address);
	})
	.then(() => {
		return ERC721Restricted.deployed()
	})
	.then(logisticBase => {
		logisticBase.setLogistic(Logistic.address);
	});
}
