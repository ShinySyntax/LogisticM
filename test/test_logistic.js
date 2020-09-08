const truffleAssert = require('truffle-assertions')

const { version } = require('./utils')

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')

contract('Logistic', async accounts => {
  const [owner, other] = accounts
  let instance

  before(async function () {
    // Create proxy
    const ownedRegistry = await OwnedRegistry.deployed()
    const { logs } = await ownedRegistry.createProxy(version)
    const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
    instance = await LogisticInterface.at(proxy)
  })

  it('Set lock', async () => {
    await instance.pause({ from: owner })
    await instance.setLock(false, { from: owner })
    await truffleAssert.reverts(
      instance.setLock(true, { from: other }),
      'Ownable: caller is not the owner'
    )
    await instance.setLock(true, { from: owner })
    await instance.unpause({ from: owner })
  })
})
