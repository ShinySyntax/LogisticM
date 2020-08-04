var Web3 = require('web3');

export const createProduct = (drizzle, purchaser, productId, productName,
		purchaserName) => {
	if (purchaserName.length !== 0) {
		drizzle.contracts.Logistic.methods.createProductWithName.cacheSend(
				purchaser, Web3.utils.keccak256(productId), productName, purchaserName
			)
	}
	else {
		drizzle.contracts.Logistic.methods.createProduct.cacheSend(
			purchaser, Web3.utils.keccak256(productId), productName
		)
	}
}

export const send = (drizzle, account, productId) => {
	if (Web3.utils.isAddress(account)) {
		drizzle.contracts.Logistic.methods.send.cacheSend(
			account, Web3.utils.keccak256(productId)
		)
	}
	else {
		drizzle.contracts.Logistic.methods.sendWithName.cacheSend(
			account, Web3.utils.keccak256(productId))
	}
}

export const receive = (drizzle, sender, productId) => {
	if (Web3.utils.isAddress(sender)) {
		drizzle.contracts.Logistic.methods.receive.cacheSend(
			sender, Web3.utils.keccak256(productId)
		)
	}
	else {
		drizzle.contracts.Logistic.methods.receiveWithName.cacheSend(
			sender, Web3.utils.keccak256(productId)
		)
	}
}

export const sendToPurchaser = (drizzle, productId) => {
	drizzle.contracts.Logistic.methods
		.productsOrders(Web3.utils.keccak256(productId)).call()
		.then(purchaser => {
			send(drizzle, purchaser, productId)
		})
}
