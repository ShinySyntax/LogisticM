const getHash = (value) => {
	return web3.utils.keccak256(value)
}

const products = [
	{
		hash: getHash("car-1"),
		tokenId: 0,
		name: "Car"
	},
	{
		hash: getHash("Hoodie-8456"),
		tokenId: 1,
		name: "Hoodie"
	}
]

module.exports.products = products
module.exports.getHash = getHash
