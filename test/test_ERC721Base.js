const truffleAssert = require('truffle-assertions')

const { ZERO_ADDRESS } = require('./utils')

const ERC721Mock = artifacts.require("ERC721Mock")

contract("ERC721BaseImplementation", async (accounts) => {
	const [owner, other] = accounts

	before(async function () {
		instance = await ERC721Mock.new()
	});

	it("totalSupply", async () => {
		assert.equal(await instance.totalSupply(), 4)
	})

	it("tokenByIndex", async () => {
		assert.equal(await instance.tokenByIndex(0), 1)
		await truffleAssert.reverts(
			instance.tokenByIndex(5),
			"ERC721Enumerable: global index out of bounds"
		);
	})

	it("tokenOfOwnerByIndex", async () => {
		assert.equal(await instance.tokenOfOwnerByIndex(owner, 0), 1)
		await truffleAssert.reverts(
			instance.tokenOfOwnerByIndex(owner, 5),
			"ERC721Enumerable: owner index out of bounds"
		);
	})

	it("balanceOf", async () => {
		assert.equal(await instance.balanceOf(owner), 4)
		await truffleAssert.reverts(
			instance.balanceOf(ZERO_ADDRESS),
			"ERC721: balance query for the zero address"
		);
	})

	it("ownerOf", async () => {
		assert.equal(await instance.ownerOf(1), owner)
		await truffleAssert.reverts(
			instance.ownerOf(5),
			"ERC721: owner query for nonexistent token"
		);
	})

	it("Name", async () => {
		assert.equal(await instance.name(), "MockToken")
	})

	it("Symbol", async () => {
		assert.equal(await instance.symbol(), "MT")
	})

	it("baseURI", async () => {
		assert.equal(await instance.baseURI(), "BaseMock")
	})

	it("tokenURI", async () => {
		assert.equal(await instance.tokenURI(1), "BaseMockFirstToken")
		assert.equal(await instance.tokenURI(2), "")
		await truffleAssert.reverts(
			instance.tokenURI(5),
			"ERC721Metadata: URI query for nonexistent token"
		);
	})

	it("Mint", async () => {
		await instance.mintToken(owner, 8);
		await truffleAssert.reverts(
			instance.mintToken(owner, 8),
			"ERC721: token already minted"
		);
		await truffleAssert.reverts(
			instance.mintToken(ZERO_ADDRESS, 8),
			"ERC721: mint to the zero address"
		);
	})

	it("Burn", async () => {
		await instance.burnToken(3);
		await truffleAssert.reverts(
			instance.burnTokenOwner(other, 8),
			"ERC721: burn of token that is not own"
		);
		await instance.burnToken(20);
	})

	it("Approve", async () => {
		await truffleAssert.reverts(
			instance.approve(owner, 1),
			"ERC721: approval to current owner"
		);

		await truffleAssert.reverts(
			instance.approve(other, 1, { from: other }),
			"ERC721: approve caller is not owner nor approved for all"
		);

		await instance.approve(other, 1);
		assert.equal(await instance.getApproved(1), other);
	})

	it("getApproved", async () => {
		await truffleAssert.reverts(
			instance.getApproved(5),
			"ERC721: approved query for nonexistent token"
		);
	})

	it("Transfer", async () => {
		await truffleAssert.reverts(
			instance.transferFrom(other, other, 2, { from: owner }),
			"ERC721: transfer of token that is not own"
		);

		await truffleAssert.reverts(
			instance.transferFrom(owner, other, 30, { from: other }),
			"ERC721: operator query for nonexistent token"
		);

		await truffleAssert.reverts(
			instance.transferFrom(owner, ZERO_ADDRESS, 2, { from: owner }),
			"ERC721: transfer to the zero address"
		);

		await truffleAssert.reverts(
			instance.transferFrom(owner, other, 2, { from: other }),
			"ERC721: transfer caller is not owner nor approved"
		);
		await truffleAssert.reverts(
			instance.safeTransferFrom(owner, other, 2, { from: other }),
			"ERC721: transfer caller is not owner nor approved"
		);

		await instance.transferFrom(owner, other, 2);
		await instance.safeTransferFrom(owner, other, 1); // previously approved
	})

	it("setApprovalForAll", async () => {
		await truffleAssert.reverts(
			instance.setApprovalForAll(owner, true, { from: owner }),
			"ERC721: approve to caller"
		);

		await instance.setApprovalForAll(owner, true, { from: other })
		assert.isTrue(await instance.isApprovedForAll(other, owner))
	})
})
