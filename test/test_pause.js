const truffleAssert = require('truffle-assertions')

const version = require('../versions').latest

const OwnedRegistry = artifacts.require('OwnedRegistry')
const LogisticInterface = artifacts.require('LogisticInterface')

contract('Pause', async accounts => {
  const [owner, other] = accounts

  describe('PauseImplementation', async function () {
    before(async function () {
      // Create proxy
      const ownedRegistry = await OwnedRegistry.deployed()
      const { logs } = await ownedRegistry.createProxy(version)
      const { proxy } = logs.find(l => l.event === 'ProxyCreated').args
      this.instance = await LogisticInterface.at(proxy)
    })

    it('Only Owner', async function () {
      await truffleAssert.reverts(
        this.instance.pause({ from: other }),
        'Ownable: caller is not the owner'
      )
      await truffleAssert.reverts(
        this.instance.unpause({ from: other }),
        'Ownable: caller is not the owner'
      )
    })

    it('Pause', async function () {
      await this.instance.pause({ from: owner })
      assert.isTrue((await this.instance.getPaused()))
      await truffleAssert.reverts(
        this.instance.pause({ from: owner }),
        'Pausable: paused'
      )
    })

    it('UnPause', async function () {
      await this.instance.unpause({ from: owner })
      assert.equal((await this.instance.getPaused()), false)
      await truffleAssert.reverts(
        this.instance.unpause({ from: owner }),
        'Pausable: not paused'
      )
    })

    it('when unlock', async function () {
      await this.instance.pause({ from: owner })
      await this.instance.setLock(false, { from: owner })

      await truffleAssert.reverts(
        this.instance.unpause({ from: owner }),
        'Pause: contract is unlock'
      )
    })
  })
})
