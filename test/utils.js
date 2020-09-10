const ethersUtils = require('ethers').utils
var Web3 = require('web3')

const getHash = (value) => {
  return Web3.utils.keccak256(value)
}

const products = [
  {
    hash: getHash('car-1'),
    tokenId: 0,
    name: 'Car',
    nameBytes32: ethersUtils.formatBytes32String('Car'),
    purchaserNameBytes32: ethersUtils.formatBytes32String('Jack')
  },
  {
    hash: getHash('Hoodie-8456'),
    tokenId: 1,
    name: 'Hoodie',
    nameBytes32: ethersUtils.formatBytes32String('Hoodie'),
    purchaserNameBytes32: ethersUtils.formatBytes32String('John')
  },
  {
    hash: getHash('not exist product'),
    tokenId: 2,
    name: '',
    nameBytes32: ethersUtils.formatBytes32String(''),
    purchaserNameBytes32: ethersUtils.formatBytes32String('')
  }
]

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

module.exports.products = products
module.exports.getHash = getHash
module.exports.ZERO_ADDRESS = ZERO_ADDRESS
