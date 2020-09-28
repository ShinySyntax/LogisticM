import Web3 from 'web3'
import { utils } from 'ethers'

const getAddress = (account, drizzle) => {
	return new Promise((resolve, reject) => {
		if (Web3.utils.isAddress(account)) {
			resolve(account)
		} else {
			resolve(
				drizzle.contracts.LogisticM.methods.getAddress(
					utils.formatBytes32String(account))
				.call()
			)
		}
	})
}

export const createProduct = (drizzle, drizzleState, purchaser, productId, productName,
		purchaserName) => {
	drizzle.contracts.LogisticM.methods.createProduct.cacheSend(
		purchaser,
		Web3.utils.keccak256(productId),
		utils.formatBytes32String(productName),
		utils.formatBytes32String(purchaserName),
		{ from: drizzleState.accounts[0] }
	)
}

export const send = (drizzle, drizzleState, account, productHash) => {
	getAddress(account, drizzle).then(address => {
		drizzle.contracts.LogisticM.methods.send.cacheSend(
			address, productHash,
			{ from: drizzleState.accounts[0] }
		)

	})
}

export const receive = (drizzle, drizzleState, account, productHash) => {
	getAddress(account, drizzle).then(address => {
		drizzle.contracts.LogisticM.methods.receive.cacheSend(
			address, productHash, { from: drizzleState.accounts[0] }
		)
	})
}

export const sendToPurchaser = (drizzle, drizzleState, productHash) => {
	drizzle.contracts.LogisticM.methods.getProductInfo(productHash).call()
	.then(productInfo => {
		send(drizzle, drizzleState, productInfo.purchaser, productHash)
	})
}
