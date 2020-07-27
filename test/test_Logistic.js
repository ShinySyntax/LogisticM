const truffleAssert = require('truffle-assertions')

const Logistic = artifacts.require("Logistic")

contract("Logistic test", async accounts => {
    const owner = accounts[0]
    const supplier = accounts[1]
    const deliveryMan1 = accounts[2]
    const deliveryMan2 = accounts[3]
    const deliveryMan3 = accounts[4]
    const purchaser1 = accounts[5]
    const purchaser2 = accounts[6]
    const user = accounts[7]

    const product1 = 1;
    const product2 = 2;
    const product3 = 3;
    const product4 = 4;

    it("Add a supplier", async () => {
        let instance = await Logistic.deployed()

        assert.isFalse((await instance.isSupplier(supplier)))
        await instance.addSupplier(supplier, { from: owner })
        assert.isTrue((await instance.isSupplier(supplier)))

        await truffleAssert.reverts(
            instance.addSupplier(deliveryMan3, { from: supplier }),
            "Ownable: caller is not the owner"
        )
    })

    it("Add delivery mans", async () => {
        let instance = await Logistic.deployed()

        assert.isFalse((await instance.isDeliveryMan(deliveryMan1)))
        await instance.addDeliveryMan(deliveryMan1, { from: owner })
        assert.isTrue((await instance.isDeliveryMan(deliveryMan1)))
        await instance.addDeliveryMan(deliveryMan2, { from: owner })
        await instance.addDeliveryMan(deliveryMan3, { from: owner })

        await truffleAssert.reverts(
            instance.addDeliveryMan(deliveryMan3, { from: deliveryMan1 }),
            "Ownable: caller is not the owner"
        )
    })

    it("Supplier mint", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.newProduct(purchaser1, product1, { from: deliveryMan1 }),
            "SupplierRole: caller does not have the Supplier role"
        )

        await instance.newProduct(purchaser1, product1, { from: supplier })
        assert.equal((await instance.balanceOf(supplier)).toNumber(), 1)
        assert.equal((await instance.ownerOf(product1)), supplier)
        let result = await instance.newProduct(purchaser2, product2, { from: supplier })
        truffleAssert.eventEmitted(result, 'NewProduct', ev =>
            ev.by === supplier &&
            ev.purchaser === purchaser2 &&
            ev.tokenId.toNumber() === product2
        );
    })

    it("Supplier send product to delivery man", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(deliveryMan3, product1, { from: owner }),
            "Logistic: caller does not have the Supplier role nor the DeliveryMan role"
        )

        let result = await instance.send(deliveryMan1, product1, { from: supplier })
        truffleAssert.eventEmitted(result, 'Approval', ev =>
            ev.owner === supplier &&
            ev.approved === deliveryMan1 &&
            ev.tokenId.toNumber() === product1
        );
        truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
            ev.from === supplier &&
            ev.to === deliveryMan1 &&
            ev.tokenId.toNumber() === product1
        );
        assert.equal(await instance.pendingDeliveries(product1), deliveryMan1)
        assert.equal(await instance.getApproved(product1), deliveryMan1)
    })

    it("User can't receive an product not owned by the sender", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(deliveryMan3, product1, { from: deliveryMan1 }),
            "ERC721: transfer of token that is not own"
        )
    })

    it("No delivery or purchaser man users can't receive", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(deliveryMan3, product1, { from: user }),
            "Logistic: Can't receive an product not delivered"
        )
        await truffleAssert.reverts(
            instance.receive(deliveryMan3, product1, { from: owner }),
            "Logistic: Can't receive an product not delivered"
        )
        await truffleAssert.reverts(
            instance.receive(deliveryMan3, product1, { from: supplier }),
            "Logistic: Can't receive an product not delivered"
        )
    })

    it("Delivery man 1 receive the product", async () => {
        let instance = await Logistic.deployed()

        let result = await instance.receive(
          supplier, product1, { from: deliveryMan1 })
        truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
            ev.from === supplier &&
            ev.by === deliveryMan1 &&
            ev.tokenId.toNumber() === product1
        );
        assert.equal((await instance.ownerOf(product1)), deliveryMan1)
        assert.equal((await instance.pendingDeliveries(product1)), 0)
    })

    it("Delivery man 1 can't receive twice", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(supplier, product1, { from: deliveryMan1 }),
            "Logistic: Can't receive an product not delivered"
        )
    })

    it("User can't send an product not owned", async () => {
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
            ev.tokenId.toNumber() === product1
        );
        truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
            ev.from === deliveryMan1 &&
            ev.to === deliveryMan2 &&
            ev.tokenId.toNumber() === product1
        );
        assert.equal(await instance.pendingDeliveries(product1), deliveryMan2)
        assert.equal(await instance.getApproved(product1), deliveryMan2)
    })

    it("Delivery man 1 can't send twice", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(deliveryMan2, product1, { from: deliveryMan1 }),
            "Logistic: Can't send an product in pending delivery"
        )
    })

    it("Delivery man 2 receive the product", async () => {
        let instance = await Logistic.deployed()

        await instance.receive(deliveryMan1, product1, { from: deliveryMan2 })
        assert.equal((await instance.ownerOf(product1)), deliveryMan2)
        assert.equal((await instance.pendingDeliveries(product1)), 0)
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
        assert.equal(await instance.pendingDeliveries(product1), purchaser1)
        assert.equal(await instance.getApproved(product1), purchaser1)
        truffleAssert.eventEmitted(result, 'Approval', ev =>
            ev.owner === deliveryMan2 &&
            ev.approved === purchaser1 &&
            ev.tokenId.toNumber() === product1
        );
        truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
            ev.from === deliveryMan2 &&
            ev.to === purchaser1 &&
            ev.tokenId.toNumber() === product1
        );
    })

    it("Purchaser1 receive the product1", async () => {
        let instance = await Logistic.deployed()

        await instance.receive(deliveryMan2, product1, { from: purchaser1 })
        assert.equal((await instance.ownerOf(product1)), purchaser1)
        assert.equal((await instance.pendingDeliveries(product1)), 0)
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
            instance.transferFrom(deliveryMan3, user, product2, { from: supplier }),
            "Logistic: restricted mode activated"
        )

        await truffleAssert.reverts(
            instance.safeTransferFrom(deliveryMan3, user, product2, { from: supplier }),
            "Logistic: restricted mode activated"
        )
    })

    it("One purchaser order multiple products", async () => {
        let instance = await Logistic.deployed()

        await instance.newProduct(purchaser1, product3, { from: supplier })
        await instance.newProduct(purchaser1, product4, { from: supplier })
        let result = await instance.send(purchaser1, product3, { from: supplier })
        result = await instance.send(purchaser1, product4, { from: supplier })
    })
})
