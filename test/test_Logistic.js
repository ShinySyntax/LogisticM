const truffleAssert = require('truffle-assertions')
var Web3 = require('web3');

const uri = "http://localhost:8545";
var web3 = new Web3(uri);

const Logistic = artifacts.require("Logistic")
const LogisticBase = artifacts.require("LogisticBase")
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const getHash = (value) => {
  return web3.utils.keccak256(value)
}

// https://stackoverflow.com/a/56061448
function intFromBytes(byteArr) {
	return byteArr.reduce((a,c,i)=> a+c*2**(56-i*8),0)
}

contract("Logistic test", async accounts => {
	console.log(accounts);
	const owner = accounts[0]
	const supplier = accounts[1]
	const deliveryMan1 = accounts[2]
	const deliveryMan2 = accounts[3]
	const deliveryMan3 = accounts[4]
	const purchaser1 = accounts[5]
	const purchaser2 = accounts[6]
	const user = accounts[7]
	const attacker = accounts[8]

	const product1 = getHash("1");
	const product2 = getHash("2");
	const product3 = getHash("3");
	const product4 = getHash("4");
	const product5 = getHash("5");
	const product6 = getHash("6");

	it("Test initialization", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		assert.isFalse((await logisticBase.isSupplier(owner)))
		assert.isFalse((await logisticBase.isDeliveryMan(owner)))
	})

	it("Add a supplier", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logisticBase.addSupplier(owner, "supplier", { from: owner }),
			"Logistic: Owner can't be supplier"
		)

		assert.isFalse((await logisticBase.isSupplier(supplier)))
		const result = await logisticBase.addSupplier(supplier, "supplier", { from: owner })
		truffleAssert.eventEmitted(result, 'SupplierAdded', ev =>
			ev.account === supplier &&
			ev.name === "supplier"
		);
		assert.equal((await logisticBase.names(supplier)), "supplier")
		assert.equal((await logisticBase.addresses("supplier")), supplier)
		assert.isTrue((await logisticBase.isSupplier(supplier)))

		await truffleAssert.reverts(
			logisticBase.addSupplier(deliveryMan3, "supplier", { from: supplier }),
			"Ownable: caller is not the owner"
		)
		await truffleAssert.reverts(
			logisticBase.addDeliveryMan(supplier, "supplier", { from: owner }),
			"Logistic: Account is supplier"
		)
	})

	it("Add delivery men", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logisticBase.addDeliveryMan(owner, "delivery man", { from: owner }),
			"Logistic: Owner can't be delivery man"
		)

		assert.isFalse((await logisticBase.isDeliveryMan(deliveryMan1)))
		const result = await logisticBase.addDeliveryMan(deliveryMan1, "delivery man", { from: owner })
		assert.equal((await logisticBase.names(deliveryMan1)), "delivery man")
		assert.equal((await logisticBase.addresses("delivery man")), deliveryMan1)
		assert.isTrue((await logisticBase.isDeliveryMan(deliveryMan1)))
		truffleAssert.eventEmitted(result, 'DeliveryManAdded', ev =>
			ev.account === deliveryMan1 &&
			ev.name === "delivery man"
		);
		await truffleAssert.reverts(
			logisticBase.addDeliveryMan(deliveryMan2, "delivery man", { from: owner }),
			"NamedAccount: invalid address"
		)
		await logisticBase.addDeliveryMan(deliveryMan2, "delivery man2", { from: owner })
		await logisticBase.addDeliveryMan(deliveryMan3, "delivery man3", { from: owner })

		await truffleAssert.reverts(
			logisticBase.addSupplier(deliveryMan1, "deliveryMan1", { from: owner }),
			"Logistic: Account is delivery man"
		)

		await truffleAssert.reverts(
			logisticBase.addDeliveryMan(owner, "delivery man", { from: owner }),
			"Logistic: Owner can't be delivery man"
		)

		await truffleAssert.reverts(
			logisticBase.addDeliveryMan(deliveryMan3, "delivery man", { from: deliveryMan1 }),
			"Ownable: caller is not the owner"
		)
	})

	it("Supplier mint", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.createProduct(purchaser1, product1, "product1", { from: deliveryMan1 }),
			"Logistic: caller is not supplier"
		)
		await truffleAssert.reverts(
			logistic.createProduct(supplier, product1, "product1", { from: supplier }),
			"Logistic: Can't create for supplier nor owner nor delivery man"
		)
		await truffleAssert.reverts(
			logistic.createProduct(owner, product1, "product1", { from: supplier }),
			"Logistic: Can't create for supplier nor owner nor delivery man"
		)
		await truffleAssert.reverts(
			logistic.createProduct(deliveryMan1, product1, "product1", { from: supplier }),
			"Logistic: Can't create for supplier nor owner nor delivery man"
		)

		await logistic.createProductWithName(purchaser1, product1, "product1",
			"John", { from: supplier })
		assert.equal((await logisticBase.balanceOf(supplier)).toNumber(), 1)
		assert.equal((await logisticBase.ownerOf(0)), supplier)
		assert.equal((await logisticBase.productsOrders(product1)), purchaser1)
		assert.equal((await logisticBase.getProductHash(0)), product1)
		assert.equal((await logisticBase.getProductName(0)), "product1")
		let result = await logistic.createProduct(purchaser2, product2,
			"product2", { from: supplier })
		truffleAssert.eventEmitted(result, 'NewProduct', ev =>
			ev.by === supplier &&
			ev.purchaser === purchaser2 &&
			ev.productHash === product2
		);

		await truffleAssert.reverts(
			logistic.createProduct(purchaser1, product1, "product1",
			  { from: supplier }),
			"Logistic: This product already exists"
		)
		await truffleAssert.reverts(
			logistic.createProductWithName(purchaser1, product3, "product3",
				"Billy", { from: supplier }),
			"NamedAccount: invalid name"
		)
	})

	it("Supplier send product to delivery man 1", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.send(deliveryMan3, product1, { from: owner }),
			"Logistic: caller is not supplier nor delivery man"
		)
		await truffleAssert.reverts(
			logistic.send(deliveryMan1, product1, { from: deliveryMan2 }),
			"ERC721: approve caller is not owner nor approved for all"
		)

		let result = await logistic.sendWithName("delivery man", product1,
			{ from: supplier })
		truffleAssert.eventEmitted(result, 'Approval', ev =>
			ev.owner === supplier &&
			ev.approved === deliveryMan1 &&
			ev.tokenId.toNumber() === 0
		);
		truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
			ev.from === supplier &&
			ev.to === deliveryMan1 &&
			ev.productHash === product1
		);
		assert.equal(await logisticBase.productsSentFrom(product1, supplier),
			deliveryMan1)
		assert.equal(await logisticBase.getApproved(0), deliveryMan1)
	})

	it("Receive fail with bad msg.sender", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.receive(owner, product1, { from: deliveryMan1 }),
			"Logistic: sender is not delivery man nor supplier"
		)
		await truffleAssert.reverts(
			logistic.receive(deliveryMan3, product1, { from: user }),
			"Logistic: This purchaser has not ordered this product"
		)
		await truffleAssert.reverts(
			logistic.receive(deliveryMan3, product1, { from: owner }),
			"Logistic: caller is owner"
		)
		await truffleAssert.reverts(
			logistic.receive(deliveryMan3, product1, { from: supplier }),
			"SupplierRole: caller has the Supplier role"
		)
	})

	it("Delivery man 1 receive the product", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		let result = await logistic.receiveWithName(
		  "supplier", product1, { from: deliveryMan1 })
		truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
			ev.from === supplier &&
			ev.by === deliveryMan1 &&
			ev.productHash === product1
		);
		assert.equal((await logisticBase.ownerOf(0)), deliveryMan1)
		assert.equal((await logisticBase.productsReceivedFrom(product1, supplier)),
			deliveryMan1)
	})

	it("Delivery man 1 can't receive twice", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.receive(supplier, product1, { from: deliveryMan1 }),
			"Logistic: Already received"
		)
	})

	it("User can't send a product not owned", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.send(deliveryMan2, product1, { from: deliveryMan3 }),
			"ERC721: approve caller is not owner nor approved for all"
		)
	})

	it("Delivery man 1 send the product", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		let result = await logistic.send(deliveryMan2, product1, { from: deliveryMan1 })
		truffleAssert.eventEmitted(result, 'Approval', ev =>
			ev.owner === deliveryMan1 &&
			ev.approved === deliveryMan2 &&
			ev.tokenId.toNumber() === 0
		);
		truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
			ev.from === deliveryMan1 &&
			ev.to === deliveryMan2 &&
			ev.productHash === product1
		);
		assert.equal(await logistic.productsSentFrom(product1, deliveryMan1), deliveryMan2)
		assert.equal(await logistic.getApproved(0), deliveryMan2)
	})

	it("Delivery man 1 can't send twice", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.send(deliveryMan2, product1, { from: deliveryMan1 }),
			"Logistic: Can't send a product in pending delivery"
		)
	})

	it("Delivery man 2 receive the product", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await logistic.receive(deliveryMan1, product1, { from: deliveryMan2 })
		assert.equal((await logistic.ownerOf(0)), deliveryMan2)
		assert.equal((await logistic.productsReceivedFrom(product1, deliveryMan1)),
			deliveryMan2)
	})

	it("Delivery man 2 can't send to supplier nor owner", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.send(supplier, product1, { from: deliveryMan2 }),
			"Logistic: Can't send to supplier nor owner"
		)

		await truffleAssert.reverts(
			logistic.send(owner, product1, { from: deliveryMan2 }),
			"Logistic: Can't send to supplier nor owner"
		)
	})

	it("Final delivery man (2) send to purchaser", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logistic.send(purchaser1, product1, { from: owner }),
			"Logistic: caller does not have the Supplier role nor the DeliveryMan role"
		)

		await truffleAssert.reverts(
			logistic.send(purchaser2, product1, { from: deliveryMan2 }),
			"Logistic: This purchaser has not ordered this product"
		)

		let result = await logistic.send(purchaser1, product1, { from: deliveryMan2 })
		assert.equal(await logisticBase.productsSentFrom(product1, deliveryMan2), purchaser1)
		assert.equal(await logisticBase.getApproved(0), purchaser1)
		truffleAssert.eventEmitted(result, 'Approval', ev =>
			ev.owner === deliveryMan2 &&
			ev.approved === purchaser1 &&
			ev.tokenId.toNumber() === 0
		);
		truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
			ev.from === deliveryMan2 &&
			ev.to === purchaser1 &&
			ev.productHash === product1
		);
	})

	it("Purchaser1 receive the product1", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await logistic.receive(deliveryMan2, product1, { from: purchaser1 })
		assert.equal((await logisticBase.ownerOf(0)), purchaser1)
		assert.equal((await logisticBase.productsReceivedFrom(product1, deliveryMan2)),
			purchaser1)
	})

	it("User can't approve", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logisticBase.approve(deliveryMan3, product1, { from: user }),
			"Logistic: restricted mode activated"
		)

		await truffleAssert.reverts(
			logisticBase.setApprovalForAll(deliveryMan3, true, { from: deliveryMan2 }),
			"Logistic: cannot approve for all"
		)
	})

	it("User can't transfert", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logisticBase.transferFrom(deliveryMan3, user, 1, { from: supplier }),
			"Logistic: restricted mode activated"
		)

		await truffleAssert.reverts(
			logisticBase.safeTransferFrom(deliveryMan3, user, 1, { from: supplier }),
			"Logistic: restricted mode activated"
		)
	})

	it("One purchaser order multiple products", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await logistic.createProduct(purchaser1, product3, "product3",
		  { from: supplier })
		await logistic.createProduct(purchaser1, product4, "product4",
		  { from: supplier })
		let result = await logistic.send(purchaser1, product3, { from: supplier })
		assert.equal((await logisticBase.productsSentFrom(product3, supplier)),
			purchaser1)
		result = await logistic.send(purchaser1, product4, { from: supplier })
		assert.equal((await logisticBase.productsSentFrom(product4, supplier)),
			purchaser1)
		await logistic.createProduct(purchaser1, product5, "product5",
		  { from: supplier })
	})

	it("deliveryMan1 receive product before sending", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		let result = await logistic.receive(
		  supplier, product5, { from: deliveryMan1 })
		truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
			ev.from === supplier &&
			ev.by === deliveryMan1 &&
			ev.productHash === product5
		);
		assert.equal((await logisticBase.ownerOf(4)), supplier)
		assert.equal((await logisticBase.productsReceivedFrom(product5, supplier)),
			deliveryMan1)
	})

	it("Supplier send product after receiving", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		let result = await logistic.send(deliveryMan1, product5,
			{ from: supplier })
		truffleAssert.eventNotEmitted(result, 'Approval');
		truffleAssert.eventEmitted(result, 'Transfer', ev =>
			ev.from === supplier &&
			ev.to === deliveryMan1 &&
			ev.tokenId.toNumber() === 4
		);
		truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
			ev.from === supplier &&
			ev.to === deliveryMan1 &&
			ev.productHash === product5
		);
		truffleAssert.eventEmitted(result, 'Handover', ev =>
			ev.from === supplier &&
			ev.to === deliveryMan1 &&
			ev.productHash === product5
		);
		assert.equal(await logisticBase.productsSentFrom(product5, supplier), deliveryMan1)
		assert.equal(await logisticBase.getApproved(4), 0)
	})

	it("deliveryMan1 send product to deliveryMan2", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		let result = await logistic.send(deliveryMan2, product5,
			{ from: deliveryMan1 })
		truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
			ev.from === deliveryMan1 &&
			ev.to === deliveryMan2 &&
			ev.productHash === product5
		);
		truffleAssert.eventEmitted(result, 'Approval', ev =>
			ev.owner === deliveryMan1 &&
			ev.approved === deliveryMan2 &&
			ev.tokenId.toNumber() === 4
		);
		assert.equal(await logisticBase.productsSentFrom(product5, deliveryMan1), deliveryMan2)
		assert.equal(await logisticBase.getApproved(4), deliveryMan2)
		assert.equal((await logisticBase.ownerOf(4)), deliveryMan1)
	})

	it("deliveryMan2 received product", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		let result = await logistic.receive(deliveryMan1, product5,
			{ from: deliveryMan2 })

		truffleAssert.eventEmitted(result, 'Handover', ev =>
			ev.from === deliveryMan1 &&
			ev.to === deliveryMan2 &&
			ev.productHash === product5
		);
		truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
			ev.from === deliveryMan1 &&
			ev.by === deliveryMan2 &&
			ev.productHash === product5
		);
		assert.equal((await logisticBase.productsReceivedFrom(product5, deliveryMan1)),
			deliveryMan2)
		assert.equal(await logisticBase.getApproved(4), 0)
		assert.equal((await logisticBase.ownerOf(4)), deliveryMan2)
	})

	it("Purchaser receive before intermediary received", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await logistic.createProduct(purchaser1, product6, "product6",
		  { from: supplier })

		let result1 = await logistic.receive(
			deliveryMan1, product6, { from: purchaser1 })

		let result2 = await logistic.send(deliveryMan1, product6,
			{ from: supplier })

		let result3 = await logistic.receive(
			supplier, product6, { from: deliveryMan1 })
		truffleAssert.eventEmitted(result3, 'Handover', ev =>
			ev.from === supplier &&
			ev.to === deliveryMan1 &&
			ev.productHash === product6
		);

		let result4 = await logistic.send(purchaser1, product6,
			{ from: deliveryMan1 })
		truffleAssert.eventEmitted(result4, 'Handover', ev =>
			ev.from === deliveryMan1 &&
			ev.to === purchaser1 &&
			ev.productHash === product6
		);
	})

	it("Manage ownership", async () => {
		let logistic = await Logistic.deployed()
		let logisticBase = await LogisticBase.deployed()

		await truffleAssert.reverts(
			logisticBase.transferOwnership(ZERO_ADDRESS, { from: owner }),
			"Ownable: new owner is the zero address"
		)
		await logisticBase.transferOwnership(user, { from: owner })
		await truffleAssert.reverts(
			logisticBase.transferOwnership(user, { from: owner }),
			"Ownable: caller is not the owner"
		)
		await logisticBase.renounceDeliveryMan({ from: deliveryMan1 })
		await truffleAssert.reverts(
			logisticBase.renounceDeliveryMan({ from: deliveryMan1 }),
			"Roles: account does not have role"
		)
		await logisticBase.renounceSupplier({ from: supplier })
	})
})
