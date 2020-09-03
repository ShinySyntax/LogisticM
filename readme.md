# Logistic


# Development

Available Accounts
	==================
	(0) 0xCFd6f5C0320EBceB5fE9672276741EFF510D7c1B (100 ETH)
	(1) 0xB091Eb5ce0933CB9162041855147cDc03e0abEBA (100 ETH)
	(2) 0xC75E3c4911069e2087d6EC13444d9f21A32C3380 (100 ETH)
	(3) 0x0DE313f465FE16F5b71bF1098107523CB8C0CfBC (100 ETH)
	(4) 0xf77b6691f452cF74A8AFaBc95366Cc7e9F712539 (100 ETH)
	(5) 0x6eb75A88b59BB30AC72f89e3538DD5Eb15F8C445 (100 ETH)
	(6) 0xcEb4021027A60A0C3a03c2B00949BEe27aB577DB (100 ETH)
	(7) 0x9021d7DeE92CbddB3c155a64506EBE2f41fDE720 (100 ETH)
	(8) 0x83b780c803540AEC28EeC888A7479723Ef340994 (100 ETH)
	(9) 0xF2ACFe82a55418fFf2F4D7C335Ba78A53f9b7c06 (100 ETH)


# Usage

## How to use lock and pause?

The contract is lock by default. This means some operation can only by done
in a certain context: transfer a token is only doable trough send and receive
methods (HandoverImplementation).

To unlock the contract:
 - call pause()
 - call setLock(false)
 - make operations
 - call setLock(true)
 - call unpause()

## Upgradeability

Implementation is inspired by <https://github.com/OpenZeppelin/openzeppelin-labs/tree/master/upgradeability_with_vtable>.

