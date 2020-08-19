const truffleAssert = require('truffle-assertions')
var Web3 = require('web3')

const { registerV0 } = require("../registerer/registerV0");

const uri = "http://localhost:8545"
var web3 = new Web3(uri)

const Registry = artifacts.require("Registry")
const LogisticProxy = artifacts.require("LogisticProxy")
const LogisticInterface = artifacts.require("LogisticInterface")

const accessTestSuite = async (instance, accounts) => {
	const [owner, supplier, deliveryMan, other] = accounts

	describe("AccessImplementation & OwnerImplementation", async () => {
		it("Owner", async () => {
			let actualOwner = await instance.getOwner()
			console.log("actualOwner ", actualOwner);
			assert.equal(actualOwner, owner)
		})

		it("transferOwnership", async () => {
			await instance.transferOwnership(other, { from: owner })
			assert.equal((await instance.getOwner()), other)
			await instance.transferOwnership(owner, { from: other })
		})

		it("Add a supplier", async () => {
			await truffleAssert.reverts(
				instance.addSupplier(owner, { from: owner }),
				"Access: Owner can't be supplier"
			)

			assert.isFalse((await instance.isSupplier(supplier)))
			const result = await instance.addSupplier(supplier, { from: owner })
			truffleAssert.eventEmitted(result, 'SupplierAdded', ev =>
				ev.account === supplier
			);
			assert.isTrue((await instance.isSupplier(supplier)))

			await truffleAssert.reverts(
				instance.addSupplier(deliveryMan, { from: supplier }),
				"Ownable: caller is not the owner"
			)
		})

		describe('When other is supplier', function () {
			beforeEach(async function () {
				await instance.addSupplier(other, { from: owner })
			});
			it("Remove supplier", async () => {
				await instance.removeSupplier(other, { from: owner })
				assert.isFalse((await instance.isSupplier(other)))
			})

			it("Renounce supplier", async () => {
				await instance.renounceSupplier({ from: other })
				assert.isFalse((await instance.isSupplier(other)))
			})

			it("Other can't be delivery man", async () => {
				await truffleAssert.reverts(
					instance.addDeliveryMan(other, { from: owner }),
					"RolesLibrary: roles already defined"
				)
			})

			after(async function () {
				await instance.renounceSupplier({ from: other })
			})
		})

		it("Add delivery men", async () => {
			await truffleAssert.reverts(
				instance.addDeliveryMan(owner, { from: owner }),
				"Access: Owner can't be delivery man"
			)

			assert.isFalse((await instance.isDeliveryMan(deliveryMan)))
			const result = await instance.addDeliveryMan(deliveryMan, { from: owner })
			assert.isTrue((await instance.isDeliveryMan(deliveryMan)))
			truffleAssert.eventEmitted(result, 'DeliveryManAdded', ev =>
				ev.account === deliveryMan
			);

			await truffleAssert.reverts(
				instance.addDeliveryMan(deliveryMan, { from: other }),
				"Ownable: caller is not the owner"
			)
		})

		describe('When other is delivery man', function () {
			beforeEach(async function () {
				await instance.addDeliveryMan(other, { from: owner })
			});
			it("Remove delivery man", async () => {
				await instance.removeDeliveryMan(other, { from: owner })
				assert.isFalse((await instance.isDeliveryMan(other)))
			})

			it("Renounce delivery man", async () => {
				await instance.renounceDeliveryMan({ from: other })
				assert.isFalse((await instance.isDeliveryMan(other)))
			})

			it("Other can't be supplier", async () => {
				await truffleAssert.reverts(
					instance.addSupplier(other, { from: owner }),
					"RolesLibrary: roles already defined"
				)
			})
		})
	})
}

module.exports.accessTestSuite = accessTestSuite
