# Logistic

This repository contains a smart contract and a web application in ReactJS.

## Smart contract

The smart contract runs on the Ethereum blockchain.

### Upgradeability

The smart contract is split into multiple contracts deployed on the Ethereum blockchain to
implement an upgradeability pattern.

The implemented pattern is inspired by <https://github.com/OpenZeppelin/openzeppelin-labs/tree/master/upgradeability_with_vtable> and <https://github.com/OpenZeppelin/openzeppelin-labs/tree/master/upgradeability_ownership>.

There or three main contracts:
 - **OwnedRegistry**: this is where you register your function and create the proxy
 - **LogisticProxy**: this is the proxy. The web3 contract calls are sent to this contract
 - **LogisticInterface**: this defines the ABI used to interact with the whole contract through web3

And other important contracts:
 - **several logic contracts**: for example `HandoverImplementation`, `ProductImplementation`, `NameImplementation`, `PauseImplementation`...
 - **LogisticSharedStorage**: gather all the storage of the LogisticProxy contract

#### The registry: OwnedRegistry

With this contract, the owner can register functions implemented in logic contracts.

To register a function, call `OwnedRegistry.addVersionFromName(string memory version, string memory func, address implementation)`.

Like this: `OwnedRegistry.addVersionFromName('V1', 'createProduct', 0x...)`

The creator of the `OwnedRegistry` contract is the owner and can transfer the ownership.

#### The proxy: LogisticProxy

The proxy contract defines a fallback function that performs a delegate call to the logic contract.
For this, it first needs to know the address of the logic contract. When loading a version, is call  `OwnedRegistry` to get these addresses.

The creator of the contract is a `OwnedRegistry` instance, and the owner is the creator of this `OwnedRegistry` instance.
The owner of the proxy can `upgradeTo` a new version and transfer the ownership.

#### The interface: LogisticInterface

This contract gathers all the logic contract interfaces. It does not implement any function.

### How to use the smart contract?

To use the smart contract, you need to create a web3 Contract with the ABI of `LogisticInterface`
and the address of `LogisticProxy`.

The address of the proxy is accessible in the log event `ProxyCreated` of the registry that created the proxy.

### Deployment

You can look at the migration file `./migrations/2_deploy_logistic_V0.js`.
You will see that we deploy the registry and all the logic contracts.
Then, we register all the functions implemented in the logic contracts.
Finally, we create the proxy.


### How to use lock and pause?
The contract is lock by default. This means some operation can only by done
in a certain context: transfer a token is only doable trough `send` and `receive`
methods (`HandoverImplementation`).

To unlock the contract:
 - call pause()
 - call setLock(false)
 - make operations
 - call setLock(true)
 - call unpause()
