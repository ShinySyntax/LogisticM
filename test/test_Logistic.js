const truffleAssert = require('truffle-assertions')

const Logistic = artifacts.require("Logistic")

contract("Logistic test", async accounts => {
    const owner = accounts[0]
    const maker = accounts[1]
    const deliveryMan1 = accounts[2]
    const deliveryMan2 = accounts[3]
    const deliveryMan3 = accounts[4]
    const user = accounts[6]

    const item1 = 1;
    const item2 = 2;

    it("Add a maker", async () => {
        let instance = await Logistic.deployed()

        assert.isFalse((await instance.isMaker(maker)))
        await instance.addMaker(maker, { from: owner })
        assert.isTrue((await instance.isMaker(maker)))

        await truffleAssert.reverts(
            instance.addMaker(deliveryMan3, { from: maker }),
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

    it("Maker mint", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.newItem(item1, { from: deliveryMan1 }),
            "MakerRole: caller does not have the Maker role"
        )

        await instance.newItem(item1, { from: maker })
        assert.equal((await instance.balanceOf(maker)).toNumber(), item1)
        assert.equal((await instance.ownerOf(item1)), maker)
        await instance.newItem(item2, { from: maker })
    })

    it("Maker send item to delivery man", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(deliveryMan3, item1, { from: owner }),
            "Logistic: caller does not have the Maker role nor the DeliveryMan role"
        )

        let result = await instance.send(deliveryMan1, item1, { from: maker })
        truffleAssert.eventEmitted(result, 'Approval', ev =>
            ev.owner === maker &&
            ev.approved === deliveryMan1 &&
            ev.tokenId.toNumber() === item1
        );
        assert.equal(await instance.pendingDeliveries(item1), deliveryMan1)
        assert.equal(await instance.getApproved(item1), deliveryMan1)
    })

    it("User can't receive an item not owned by the sender", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(deliveryMan3, item1, { from: deliveryMan1 }),
            "ERC721: transfer of token that is not own"
        )
    })

    it("No delivery man users can't receive", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(deliveryMan3, item1, { from: user }),
            "DeliveryManRole: caller does not have the DeliveryMan role"
        )
    })

    it("Delivery man 1 receive the item", async () => {
        let instance = await Logistic.deployed()

        await instance.receive(maker, item1, { from: deliveryMan1 })
        assert.equal((await instance.ownerOf(item1)), deliveryMan1)
        assert.equal((await instance.pendingDeliveries(item1)), 0)
    })

    it("Delivery man 1 can't receive twice", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(maker, item1, { from: deliveryMan1 }),
            "Logistic: Can't receive an item not delivered"
        )
    })

    it("User can't send an item not owned", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(deliveryMan2, item1, { from: deliveryMan3 }),
            "ERC721: approve caller is not owner nor approved for all"
        )
    })

    it("Delivery man 1 send the item", async () => {
        let instance = await Logistic.deployed()

        let result = await instance.send(deliveryMan2, item1, { from: deliveryMan1 })
        truffleAssert.eventEmitted(result, 'Approval', ev =>
            ev.owner === deliveryMan1 &&
            ev.approved === deliveryMan2 &&
            ev.tokenId.toNumber() === item1
        );
        assert.equal(await instance.pendingDeliveries(item1), deliveryMan2)
        assert.equal(await instance.getApproved(item1), deliveryMan2)
    })

    it("Delivery man 1 can't send twice", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(deliveryMan2, item1, { from: deliveryMan1 }),
            "Logistic: Can't send an item in pending delivery"
        )

        await truffleAssert.reverts(
            instance.sendToPurchaser(item1, { from: deliveryMan1 }),
            "Logistic: Can't send to purchaser an item in pending delivery"
        )
    })

    it("Delivery man 2 receive the item", async () => {
        let instance = await Logistic.deployed()

        await instance.receive(deliveryMan1, item1, { from: deliveryMan2 })
        assert.equal((await instance.ownerOf(item1)), deliveryMan2)
        assert.equal((await instance.pendingDeliveries(item1)), 0)
    })

    it("Delivery man 2 can't send to maker nor owner", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(maker, item1, { from: deliveryMan2 }),
            "Logistic: receiver is not a delivery man"
        )

        await truffleAssert.reverts(
            instance.send(owner, item1, { from: deliveryMan2 }),
            "Logistic: receiver is not a delivery man"
        )
    })

    it("Final delivery man (2) send to purchaser", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.sendToPurchaser(item1, { from: owner }),
            "Logistic: caller does not have the Maker role nor the DeliveryMan role"
        )

        await instance.sendToPurchaser(item1, { from: deliveryMan2 })
        await truffleAssert.reverts(
            instance.ownerOf(item1),
            "ERC721: owner query for nonexistent token"
        )
    })

    it("User can't approve", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.approve(deliveryMan3, item1, { from: user }),
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
            instance.transferFrom(deliveryMan3, user, item2, { from: maker }),
            "Logistic: restricted mode activated"
        )

        await truffleAssert.reverts(
            instance.safeTransferFrom(deliveryMan3, user, item2, { from: maker }),
            "Logistic: restricted mode activated"
        )
    })
})
