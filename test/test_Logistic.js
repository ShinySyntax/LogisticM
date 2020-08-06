const truffleAssert = require('truffle-assertions')
var Web3 = require('web3');

const uri = "http://localhost:8545";
var web3 = new Web3(uri);

const Logistic = artifacts.require("Logistic")
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
		let instance = await Logistic.deployed()

		assert.isFalse((await instance.isSupplier(owner)))
		assert.isFalse((await instance.isDeliveryMan(owner)))
	})

	it("Add a supplier", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.addSupplier(owner, "supplier", { from: owner }),
			"Logistic: Owner can't be supplier"
		)

		assert.isFalse((await instance.isSupplier(supplier)))
		const result = await instance.addSupplier(supplier, "supplier", { from: owner })
		truffleAssert.eventEmitted(result, 'SupplierAdded', ev =>
			ev.account === supplier &&
			ev.name === "supplier"
		);
		assert.equal((await instance.getNameByAddress(supplier)), "supplier")
		assert.equal((await instance.getAddressByName("supplier")), supplier)
		assert.isTrue((await instance.isSupplier(supplier)))

		await truffleAssert.reverts(
			instance.addSupplier(deliveryMan3, "supplier", { from: supplier }),
			"Ownable: caller is not the owner"
		)
		await truffleAssert.reverts(
			instance.addDeliveryMan(supplier, "supplier", { from: owner }),
			"Logistic: Account is supplier"
		)
	})

	it("Add delivery men", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.addDeliveryMan(owner, "delivery man", { from: owner }),
			"Logistic: Owner can't be delivery man"
		)

		assert.isFalse((await instance.isDeliveryMan(deliveryMan1)))
		const result = await instance.addDeliveryMan(deliveryMan1, "delivery man", { from: owner })
		assert.equal((await instance.getNameByAddress(deliveryMan1)), "delivery man")
		assert.equal((await instance.getAddressByName("delivery man")), deliveryMan1)
		assert.isTrue((await instance.isDeliveryMan(deliveryMan1)))
		truffleAssert.eventEmitted(result, 'DeliveryManAdded', ev =>
			ev.account === deliveryMan1 &&
			ev.name === "delivery man"
		);
		await truffleAssert.reverts(
			instance.addDeliveryMan(deliveryMan2, "delivery man", { from: owner }),
			"NamedAccount: invalid address"
		)
		await instance.addDeliveryMan(deliveryMan2, "delivery man2", { from: owner })
		await instance.addDeliveryMan(deliveryMan3, "delivery man3", { from: owner })

		await truffleAssert.reverts(
			instance.addSupplier(deliveryMan1, "deliveryMan1", { from: owner }),
			"Logistic: Account is delivery man"
		)

		await truffleAssert.reverts(
			instance.addDeliveryMan(owner, "delivery man", { from: owner }),
			"Logistic: Owner can't be delivery man"
		)

		await truffleAssert.reverts(
			instance.addDeliveryMan(deliveryMan3, "delivery man", { from: deliveryMan1 }),
			"Ownable: caller is not the owner"
		)
	})

	it("Supplier mint", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.createProduct(purchaser1, product1, "product1", { from: deliveryMan1 }),
			"SupplierRole: caller does not have the Supplier role"
		)
		await truffleAssert.reverts(
			instance.createProduct(supplier, product1, "product1", { from: supplier }),
			"Logistic: Can't create for supplier nor owner nor delivery man"
		)
		await truffleAssert.reverts(
			instance.createProduct(owner, product1, "product1", { from: supplier }),
			"Logistic: Can't create for supplier nor owner nor delivery man"
		)
		await truffleAssert.reverts(
			instance.createProduct(deliveryMan1, product1, "product1", { from: supplier }),
			"Logistic: Can't create for supplier nor owner nor delivery man"
		)

		await instance.createProductWithName(purchaser1, product1, "product1",
			"John", { from: supplier })
		assert.equal((await instance.balanceOf(supplier)).toNumber(), 1)
		assert.equal((await instance.ownerOf(0)), supplier)
		assert.equal((await instance.productsOrders(product1)), purchaser1)
		assert.equal((await instance.getProductHash(0)), product1)
		assert.equal((await instance.getProductName(0)), "product1")
		let result = await instance.createProduct(purchaser2, product2,
			"product2", { from: supplier })
		truffleAssert.eventEmitted(result, 'NewProduct', ev =>
			ev.by === supplier &&
			ev.purchaser === purchaser2 &&
			ev.productHash === product2
		);

		await truffleAssert.reverts(
			instance.createProduct(purchaser1, product1, "product1",
			  { from: supplier }),
			"Logistic: This product already exists"
		)
		await truffleAssert.reverts(
			instance.createProductWithName(purchaser1, product3, "product3",
				"Billy", { from: supplier }),
			"NamedAccount: invalid name"
		)
	})

	it("Supplier send product to delivery man 1", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.send(deliveryMan3, product1, { from: owner }),
			"Logistic: caller does not have the Supplier role nor the DeliveryMan role"
		)
		await truffleAssert.reverts(
			instance.send(deliveryMan1, product1, { from: deliveryMan2 }),
			"ERC721: approve caller is not owner nor approved for all"
		)

		let result = await instance.sendWithName("delivery man", product1,
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
		assert.equal(await instance.productsSentFrom(product1, supplier),
			deliveryMan1)
		assert.equal(await instance.getApproved(0), deliveryMan1)
	})

	it("Receive fail with bad msg.sender", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.receive(owner, product1, { from: deliveryMan1 }),
			"Logistic: sender is not delivery man nor supplier"
		)
		await truffleAssert.reverts(
			instance.receive(deliveryMan3, product1, { from: user }),
			"Logistic: This purchaser has not ordered this product"
		)
		await truffleAssert.reverts(
			instance.receive(deliveryMan3, product1, { from: owner }),
			"Ownable: caller is the owner"
		)
		await truffleAssert.reverts(
			instance.receive(deliveryMan3, product1, { from: supplier }),
			"SupplierRole: caller has the Supplier role"
		)
	})

	it("Delivery man 1 receive the product", async () => {
		let instance = await Logistic.deployed()

		let result = await instance.receiveWithName(
		  "supplier", product1, { from: deliveryMan1 })
		truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
			ev.from === supplier &&
			ev.by === deliveryMan1 &&
			ev.productHash === product1
		);
		assert.equal((await instance.ownerOf(0)), deliveryMan1)
		assert.equal((await instance.productsReceivedFrom(product1, supplier)),
			deliveryMan1)
	})

	it("Delivery man 1 can't receive twice", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.receive(supplier, product1, { from: deliveryMan1 }),
			"Logistic: Already received"
		)
	})

	it("User can't send a product not owned", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.send(deliveryMan2, product1, { from: deliveryMan3 }),
			"ERC721: approve caller is not owner nor approved for all"
		)
	})

	it("Delivery man 1 send the product", async () => {
		let instance = await Logistic.deployed()

		let result = await instance.send(deliveryMan2, product1, { from: deliveryMan1 })
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
		assert.equal(await instance.productsSentFrom(product1, deliveryMan1), deliveryMan2)
		assert.equal(await instance.getApproved(0), deliveryMan2)
	})

	it("Delivery man 1 can't send twice", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.send(deliveryMan2, product1, { from: deliveryMan1 }),
			"Logistic: Can't send a product in pending delivery"
		)
	})

	it("Delivery man 2 receive the product", async () => {
		let instance = await Logistic.deployed()

		await instance.receive(deliveryMan1, product1, { from: deliveryMan2 })
		assert.equal((await instance.ownerOf(0)), deliveryMan2)
		assert.equal((await instance.productsReceivedFrom(product1, deliveryMan1)),
			deliveryMan2)
	})

	it("Delivery man 2 can't send to supplier nor owner", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.send(supplier, product1, { from: deliveryMan2 }),
			"Logistic: Can't send to supplier nor owner"
		)

		await truffleAssert.reverts(
			instance.send(owner, product1, { from: deliveryMan2 }),
			"Logistic: Can't send to supplier nor owner"
		)
	})

	it("Final delivery man (2) send to purchaser", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.send(purchaser1, product1, { from: owner }),
			"Logistic: caller does not have the Supplier role nor the DeliveryMan role"
		)

		await truffleAssert.reverts(
			instance.send(purchaser2, product1, { from: deliveryMan2 }),
			"Logistic: This purchaser has not ordered this product"
		)

		let result = await instance.send(purchaser1, product1, { from: deliveryMan2 })
		assert.equal(await instance.productsSentFrom(product1, deliveryMan2), purchaser1)
		assert.equal(await instance.getApproved(0), purchaser1)
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
		let instance = await Logistic.deployed()

		await instance.receive(deliveryMan2, product1, { from: purchaser1 })
		assert.equal((await instance.ownerOf(0)), purchaser1)
		assert.equal((await instance.productsReceivedFrom(product1, deliveryMan2)),
			purchaser1)
	})

	it("User can't approve", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.approve(deliveryMan3, product1, { from: user }),
			"Logistic: restricted mode activated"
		)

		await truffleAssert.reverts(
			instance.setApprovalForAll(deliveryMan3, true, { from: deliveryMan2 }),
			"Logistic: cannot approve for all"
		)
	})

	it("User can't transfert", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.transferFrom(deliveryMan3, user, 1, { from: supplier }),
			"Logistic: restricted mode activated"
		)

		await truffleAssert.reverts(
			instance.safeTransferFrom(deliveryMan3, user, 1, { from: supplier }),
			"Logistic: restricted mode activated"
		)
	})

	it("One purchaser order multiple products", async () => {
		let instance = await Logistic.deployed()

		await instance.createProduct(purchaser1, product3, "product3",
		  { from: supplier })
		await instance.createProduct(purchaser1, product4, "product4",
		  { from: supplier })
		let result = await instance.send(purchaser1, product3, { from: supplier })
		assert.equal((await instance.productsSentFrom(product3, supplier)),
			purchaser1)
		result = await instance.send(purchaser1, product4, { from: supplier })
		assert.equal((await instance.productsSentFrom(product4, supplier)),
			purchaser1)
		await instance.createProduct(purchaser1, product5, "product5",
		  { from: supplier })
	})

	it("deliveryMan1 receive product before sending", async () => {
		let instance = await Logistic.deployed()

		let result = await instance.receive(
		  supplier, product5, { from: deliveryMan1 })
		truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
			ev.from === supplier &&
			ev.by === deliveryMan1 &&
			ev.productHash === product5
		);
		assert.equal((await instance.ownerOf(4)), supplier)
		assert.equal((await instance.productsReceivedFrom(product5, supplier)),
			deliveryMan1)
	})

	it("Supplier send product after receiving", async () => {
		let instance = await Logistic.deployed()

		let result = await instance.send(deliveryMan1, product5,
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
		assert.equal(await instance.productsSentFrom(product5, supplier), deliveryMan1)
		assert.equal(await instance.getApproved(4), 0)
	})

	it("deliveryMan1 send product to deliveryMan2", async () => {
		let instance = await Logistic.deployed()

		let result = await instance.send(deliveryMan2, product5,
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
		assert.equal(await instance.productsSentFrom(product5, deliveryMan1), deliveryMan2)
		assert.equal(await instance.getApproved(4), deliveryMan2)
		assert.equal((await instance.ownerOf(4)), deliveryMan1)
	})

	it("deliveryMan2 received product", async () => {
		let instance = await Logistic.deployed()

		let result = await instance.receive(deliveryMan1, product5,
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
		assert.equal((await instance.productsReceivedFrom(product5, deliveryMan1)),
			deliveryMan2)
		assert.equal(await instance.getApproved(4), 0)
		assert.equal((await instance.ownerOf(4)), deliveryMan2)
	})

	it("Purchaser receive before intermediary received", async () => {
		let instance = await Logistic.deployed()

		await instance.createProduct(purchaser1, product6, "product6",
		  { from: supplier })

		let result1 = await instance.receive(
			deliveryMan1, product6, { from: purchaser1 })

		let result2 = await instance.send(deliveryMan1, product6,
			{ from: supplier })

		let result3 = await instance.receive(
			supplier, product6, { from: deliveryMan1 })
		truffleAssert.eventEmitted(result3, 'Handover', ev =>
			ev.from === supplier &&
			ev.to === deliveryMan1 &&
			ev.productHash === product6
		);

		let result4 = await instance.send(purchaser1, product6,
			{ from: deliveryMan1 })
		truffleAssert.eventEmitted(result4, 'Handover', ev =>
			ev.from === deliveryMan1 &&
			ev.to === purchaser1 &&
			ev.productHash === product6
		);
	})

	it("Manage ownership", async () => {
		let instance = await Logistic.deployed()

		await truffleAssert.reverts(
			instance.transferOwnership(ZERO_ADDRESS, { from: owner }),
			"Ownable: new owner is the zero address"
		)
		await instance.transferOwnership(user, { from: owner })
		await instance.renounceOwnership({ from: user })
		await instance.renounceDeliveryMan({ from: deliveryMan1 })
		await instance.renounceSupplier({ from: supplier })
	})
})
