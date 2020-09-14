pragma solidity 0.5.5;

import "./UpgradeabilityStorage.sol";


/**
 * @title OwnedUpgradeabilityStorage
 * @dev This contract keeps track of the upgradeability owner (proxy owner)
 */
contract OwnedUpgradeabilityStorage is UpgradeabilityStorage {
    // Owner of the proxy contract
    address private _upgradeabilityOwner;

    /**
     * @dev Tells the address of the proxy owner
     * @return the address of the proxy owner
     */
    function upgradeabilityOwner() public view returns (address) {
        return _upgradeabilityOwner;
    }

    /**
     * @dev Sets the address of the proxy owner
     */
    function setUpgradeabilityOwner(address newUpgradeabilityOwner) internal {
        _upgradeabilityOwner = newUpgradeabilityOwner;
    }
}
