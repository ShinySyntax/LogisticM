const truffleAssert = require('truffle-assertions')

const Logistic = artifacts.require("Logistic")

contract("Logistic test", async accounts => {
    const owner = accounts[0]
    const maker = accounts[1]
    const merchant1 = accounts[2]
    const merchant2 = accounts[3]
    const merchant3 = accounts[4]
    const user = accounts[6]

    const item1 = 1;
    const item2 = 2;

    it("Add a maker", async () => {
        let instance = await Logistic.deployed()

        assert.isFalse((await instance.isMaker(maker)))
        await instance.addMaker(maker, { from: owner })
        assert.isTrue((await instance.isMaker(maker)))

        await truffleAssert.reverts(
            instance.addMaker(merchant3, { from: maker }),
            "Ownable: caller is not the owner"
        )
    })

    it("Add merchants", async () => {
        let instance = await Logistic.deployed()

        assert.isFalse((await instance.isMerchant(merchant1)))
        await instance.addMerchant(merchant1, { from: owner })
        assert.isTrue((await instance.isMerchant(merchant1)))
        await instance.addMerchant(merchant2, { from: owner })
        await instance.addMerchant(merchant3, { from: owner })

        await truffleAssert.reverts(
            instance.addMerchant(merchant3, { from: merchant1 }),
            "Ownable: caller is not the owner"
        )
    })

    it("Maker mint", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.newItem(item1, { from: merchant1 }),
            "MakerRole: caller does not have the Maker role"
        )

        await instance.newItem(item1, { from: maker })
        assert.equal((await instance.balanceOf(maker)).toNumber(), item1)
        assert.equal((await instance.ownerOf(item1)), maker)
        await instance.newItem(item2, { from: maker })
    })

    it("Maker send item to merchant", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(merchant3, item1, { from: owner }),
            "Logistic: caller does not have the Maker role nor the Merchant role"
        )

        let result = await instance.send(merchant1, item1, { from: maker })
        truffleAssert.eventEmitted(result, 'Approval', ev =>
            ev.owner === maker &&
            ev.approved === merchant1 &&
            ev.tokenId.toNumber() === item1
        );
        assert.equal(await instance.pendingDeliveries(item1), merchant1)
        assert.equal(await instance.getApproved(item1), merchant1)
    })

    it("User can't receive an item not owned by the sender", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(merchant3, item1, { from: merchant1 }),
            "ERC721: transfer of token that is not own"
        )
    })

    it("No merchant users can't receive", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(merchant3, item1, { from: user }),
            "MerchantRole: caller does not have the Merchant role"
        )
    })

    it("Merchant1 receive the item", async () => {
        let instance = await Logistic.deployed()

        await instance.receive(maker, item1, { from: merchant1 })
        assert.equal((await instance.ownerOf(item1)), merchant1)
        assert.equal((await instance.pendingDeliveries(item1)), 0)
    })

    it("Merchant1 can't receive twice", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.receive(maker, item1, { from: merchant1 }),
            "Logistic: Can't receive an item not delivered"
        )
    })

    it("User can't send an item not owned", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(merchant2, item1, { from: merchant3 }),
            "ERC721: approve caller is not owner nor approved for all"
        )
    })

    it("Merchant1 send the item", async () => {
        let instance = await Logistic.deployed()

        let result = await instance.send(merchant2, item1, { from: merchant1 })
        truffleAssert.eventEmitted(result, 'Approval', ev =>
            ev.owner === merchant1 &&
            ev.approved === merchant2 &&
            ev.tokenId.toNumber() === item1
        );
        assert.equal(await instance.pendingDeliveries(item1), merchant2)
        assert.equal(await instance.getApproved(item1), merchant2)
    })

    it("Merchant1 can't send twice", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(merchant2, item1, { from: merchant1 }),
            "Logistic: Can't send an item in pending delivery"
        )

        await truffleAssert.reverts(
            instance.sendToBuyer(item1, { from: merchant1 }),
            "Logistic: Can't send to buyer an item in pending delivery"
        )
    })

    it("Merchant2 receive the item", async () => {
        let instance = await Logistic.deployed()

        await instance.receive(merchant1, item1, { from: merchant2 })
        assert.equal((await instance.ownerOf(item1)), merchant2)
        assert.equal((await instance.pendingDeliveries(item1)), 0)
    })

    it("Merchant2 can't send to maker nor owner", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.send(maker, item1, { from: merchant2 }),
            "Logistic: receiver is not a merchant"
        )

        await truffleAssert.reverts(
            instance.send(owner, item1, { from: merchant2 }),
            "Logistic: receiver is not a merchant"
        )
    })

    it("Final merchant (2) send to buyer", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.sendToBuyer(item1, { from: owner }),
            "Logistic: caller does not have the Maker role nor the Merchant role"
        )

        await instance.sendToBuyer(item1, { from: merchant2 })
        await truffleAssert.reverts(
            instance.ownerOf(item1),
            "ERC721: owner query for nonexistent token"
        )
    })

    it("User can't approve", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.approve(merchant3, item1, { from: user }),
            "Logistic: restricted mode activated"
        )

        await truffleAssert.reverts(
            instance.setApprovalForAll(merchant3, true, { from: merchant2 }),
            "Logistic: cannot approve for all"
        )
    })

    it("User can't transfert", async () => {
        let instance = await Logistic.deployed()

        await truffleAssert.reverts(
            instance.transferFrom(merchant3, user, item2, { from: maker }),
            "Logistic: restricted mode activated"
        )

        await truffleAssert.reverts(
            instance.safeTransferFrom(merchant3, user, item2, { from: maker }),
            "Logistic: restricted mode activated"
        )
    })
})
