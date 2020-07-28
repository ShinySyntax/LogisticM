const truffleAssert = require('truffle-assertions')

const Logistic = artifacts.require("Logistic")

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

    const product1 = 1;
    const product2 = 2;
    const product3 = 3;
    const product4 = 4;
    const product5 = 5;

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
            instance.createProduct(purchaser1, product1, { from: deliveryMan1 }),
            "SupplierRole: caller does not have the Supplier role"
        )

        await instance.createProduct(purchaser1, product1, { from: supplier })
        assert.equal((await instance.balanceOf(supplier)).toNumber(), 1)
        assert.equal((await instance.ownerOf(product1)), supplier)
        assert.equal((await instance.orders(product1)), purchaser1)
        let result = await instance.createProduct(purchaser2, product2,
            { from: supplier })
        truffleAssert.eventEmitted(result, 'NewProduct', ev =>
            ev.by === supplier &&
            ev.purchaser === purchaser2 &&
            ev.tokenId.toNumber() === product2
        );
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

        let result = await instance.send(deliveryMan1, product1,
            { from: supplier })
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
        assert.equal(await instance.tokensSentFrom(product1, supplier),
            deliveryMan1)
        assert.equal(await instance.getApproved(product1), deliveryMan1)
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

        let result = await instance.receive(
          supplier, product1, { from: deliveryMan1 })
        truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
            ev.from === supplier &&
            ev.by === deliveryMan1 &&
            ev.tokenId.toNumber() === product1
        );
        assert.equal((await instance.ownerOf(product1)), deliveryMan1)
        assert.equal((await instance.tokensReceivedFrom(product1, supplier)),
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
            ev.tokenId.toNumber() === product1
        );
        truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
            ev.from === deliveryMan1 &&
            ev.to === deliveryMan2 &&
            ev.tokenId.toNumber() === product1
        );
        assert.equal(await instance.tokensSentFrom(product1, deliveryMan1), deliveryMan2)
        assert.equal(await instance.getApproved(product1), deliveryMan2)
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
        assert.equal((await instance.ownerOf(product1)), deliveryMan2)
        assert.equal((await instance.tokensReceivedFrom(product1, deliveryMan1)),
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
        assert.equal(await instance.tokensSentFrom(product1, deliveryMan2), purchaser1)
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
        assert.equal((await instance.tokensReceivedFrom(product1, deliveryMan2)),
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

        await instance.createProduct(purchaser1, product3, { from: supplier })
        await instance.createProduct(purchaser1, product4, { from: supplier })
        let result = await instance.send(purchaser1, product3, { from: supplier })
        assert.equal((await instance.tokensSentFrom(product3, supplier)),
            purchaser1)
        result = await instance.send(purchaser1, product4, { from: supplier })
        assert.equal((await instance.tokensSentFrom(product4, supplier)),
            purchaser1)
        await instance.createProduct(purchaser1, product5, { from: supplier })
    })

    it("deliveryMan1 receive product before sending", async () => {
        let instance = await Logistic.deployed()

        let result = await instance.receive(
          supplier, product5, { from: deliveryMan1 })
        truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
            ev.from === supplier &&
            ev.by === deliveryMan1 &&
            ev.tokenId.toNumber() === product5
        );
        assert.equal((await instance.ownerOf(product5)), supplier)
        assert.equal((await instance.tokensReceivedFrom(product5, supplier)),
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
            ev.tokenId.toNumber() === product5
        );
        truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
            ev.from === supplier &&
            ev.to === deliveryMan1 &&
            ev.tokenId.toNumber() === product5
        );
        truffleAssert.eventEmitted(result, 'Handover', ev =>
            ev.from === supplier &&
            ev.to === deliveryMan1 &&
            ev.tokenId.toNumber() === product5
        );
        assert.equal(await instance.tokensSentFrom(product5, supplier), deliveryMan1)
        assert.equal(await instance.getApproved(product5), 0)
    })

    it("deliveryMan1 send product to deliveryMan2", async () => {
        let instance = await Logistic.deployed()

        let result = await instance.send(deliveryMan2, product5,
            { from: deliveryMan1 })
        truffleAssert.eventEmitted(result, 'ProductShipped', ev =>
            ev.from === deliveryMan1 &&
            ev.to === deliveryMan2 &&
            ev.tokenId.toNumber() === product5
        );
        truffleAssert.eventEmitted(result, 'Approval', ev =>
            ev.owner === deliveryMan1 &&
            ev.approved === deliveryMan2 &&
            ev.tokenId.toNumber() === product5
        );
        assert.equal(await instance.tokensSentFrom(product5, deliveryMan1), deliveryMan2)
        assert.equal(await instance.getApproved(product5), deliveryMan2)
        assert.equal((await instance.ownerOf(product5)), deliveryMan1)
    })

    it("deliveryMan2 received product", async () => {
        let instance = await Logistic.deployed()

        let result = await instance.receive(deliveryMan1, product5,
            { from: deliveryMan2 })

        truffleAssert.eventEmitted(result, 'Handover', ev =>
            ev.from === deliveryMan1 &&
            ev.to === deliveryMan2 &&
            ev.tokenId.toNumber() === product5
        );
        truffleAssert.eventEmitted(result, 'ProductReceived', ev =>
            ev.from === deliveryMan1 &&
            ev.by === deliveryMan2 &&
            ev.tokenId.toNumber() === product5
        );
        assert.equal((await instance.tokensReceivedFrom(product5, deliveryMan1)),
            deliveryMan2)
        assert.equal(await instance.getApproved(product5), 0)
        assert.equal((await instance.ownerOf(product5)), deliveryMan2)
    })

    it("Purchaser receive before intermediary received", async () => {
        let instance = await Logistic.deployed()

        const product6 = 6
        await instance.createProduct(purchaser1, product6, { from: supplier })

        let result1 = await instance.receive(
            deliveryMan1, product6, { from: purchaser1 })

        let result2 = await instance.send(deliveryMan1, product6,
            { from: supplier })

        let result3 = await instance.receive(
            supplier, product6, { from: deliveryMan1 })
        truffleAssert.eventEmitted(result3, 'Handover', ev =>
            ev.from === supplier &&
            ev.to === deliveryMan1 &&
            ev.tokenId.toNumber() === product6
        );

        let result4 = await instance.send(purchaser1, product6,
            { from: deliveryMan1 })
        truffleAssert.eventEmitted(result4, 'Handover', ev =>
            ev.from === deliveryMan1 &&
            ev.to === purchaser1 &&
            ev.tokenId.toNumber() === product6
        );
    })
})
