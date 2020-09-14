const truffleAssert = require('truffle-assertions')

const { ZERO_ADDRESS } = require('./utils')

const ERC721Mock = artifacts.require('ERC721Mock')

contract('ERC721BaseImplementation', async (accounts) => {
  const [owner, other] = accounts

  before(async function () {
    this.instance = await ERC721Mock.new()
  })

  it('totalSupply', async function () {
    assert.equal(await this.instance.totalSupply(), 4)
  })

  it('tokenByIndex', async function () {
    assert.equal(await this.instance.tokenByIndex(0), 1)
    await truffleAssert.reverts(
      this.instance.tokenByIndex(5),
      'ERC721Enumerable: global index out of bounds'
    )
  })

  it('tokenOfOwnerByIndex', async function () {
    assert.equal(await this.instance.tokenOfOwnerByIndex(owner, 0), 1)
    await truffleAssert.reverts(
      this.instance.tokenOfOwnerByIndex(owner, 5),
      'ERC721Enumerable: owner index out of bounds'
    )
  })

  it('balanceOf', async function () {
    assert.equal(await this.instance.balanceOf(owner), 4)
    await truffleAssert.reverts(
      this.instance.balanceOf(ZERO_ADDRESS),
      'ERC721: balance query for the zero address'
    )
  })

  it('ownerOf', async function () {
    assert.equal(await this.instance.ownerOf(1), owner)
    await truffleAssert.reverts(
      this.instance.ownerOf(5),
      'ERC721: owner query for nonexistent token'
    )
  })

  it('Name', async function () {
    assert.equal(await this.instance.name(), 'MockToken')
  })

  it('Symbol', async function () {
    assert.equal(await this.instance.symbol(), 'MT')
  })

  it('baseURI', async function () {
    assert.equal(await this.instance.baseURI(), 'BaseMock')
  })

  it('tokenURI', async function () {
    assert.equal(await this.instance.tokenURI(1), 'BaseMockFirstToken')
    assert.equal(await this.instance.tokenURI(2), '')
    await truffleAssert.reverts(
      this.instance.tokenURI(5),
      'ERC721Metadata: URI query for nonexistent token'
    )
  })

  it('Mint', async function () {
    await this.instance.mintToken(owner, 8)
    await truffleAssert.reverts(
      this.instance.mintToken(owner, 8),
      'ERC721: token already minted'
    )
    await truffleAssert.reverts(
      this.instance.mintToken(ZERO_ADDRESS, 8),
      'ERC721: mint to the zero address'
    )
  })

  it('Burn', async function () {
    await this.instance.burnToken(3)
    await truffleAssert.reverts(
      this.instance.burnTokenOwner(other, 8),
      'ERC721: burn of token that is not own'
    )
    await this.instance.burnToken(20)
  })

  it('Approve', async function () {
    await truffleAssert.reverts(
      this.instance.approve(owner, 1),
      'ERC721: approval to current owner'
    )

    await truffleAssert.reverts(
      this.instance.approve(other, 1, { from: other }),
      'ERC721: approve caller is not owner nor approved for all'
    )

    await this.instance.approve(other, 1)
    assert.equal(await this.instance.getApproved(1), other)
  })

  it('getApproved', async function () {
    await truffleAssert.reverts(
      this.instance.getApproved(5),
      'ERC721: approved query for nonexistent token'
    )
  })

  it('Transfer', async function () {
    await truffleAssert.reverts(
      this.instance.transferFrom(other, other, 2, { from: owner }),
      'ERC721: transfer of token that is not own'
    )

    await truffleAssert.reverts(
      this.instance.transferFrom(owner, other, 30, { from: other }),
      'ERC721: operator query for nonexistent token'
    )

    await truffleAssert.reverts(
      this.instance.transferFrom(owner, ZERO_ADDRESS, 2, { from: owner }),
      'ERC721: transfer to the zero address'
    )

    await truffleAssert.reverts(
      this.instance.transferFrom(owner, other, 2, { from: other }),
      'ERC721: transfer caller is not owner nor approved'
    )
    await truffleAssert.reverts(
      this.instance.safeTransferFrom(owner, other, 2, { from: other }),
      'ERC721: transfer caller is not owner nor approved'
    )

    await this.instance.transferFrom(owner, other, 2)
    await this.instance.safeTransferFrom(owner, other, 1) // previously approved
  })

  it('setApprovalForAll', async function () {
    await truffleAssert.reverts(
      this.instance.setApprovalForAll(owner, true, { from: owner }),
      'ERC721: approve to caller'
    )

    await this.instance.setApprovalForAll(owner, true, { from: other })
    assert.isTrue(await this.instance.isApprovedForAll(other, owner))
  })
})
