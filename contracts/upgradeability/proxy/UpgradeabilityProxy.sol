pragma solidity 0.5.5;

import "./Proxy.sol";
import "../registry/IRegistry.sol";
import "../UpgradeabilityStorage.sol";
import "../../commons/BytesLib.sol";


/**
 * @title UpgradeabilityProxy
 * @dev This contract represents a proxy where the implementation address to which it will delegate can be upgraded
 */
contract UpgradeabilityProxy is Proxy, UpgradeabilityStorage {

    /**
     * @dev Constructor function
     */
    constructor(string memory _version) internal {
        registry = IRegistry(msg.sender);
        version_ = _version;
        loadVersion();
    }

    /**
     * @dev Upgrades the implementation of a given function to the requested version
     * @param targetVersion representing the version name of the new implementation to be set
     */
    function _upgradeTo(string memory targetVersion) internal {
        clearVersion();
        version_ = targetVersion;
        loadVersion();
    }

    /**
     * @dev Clears from the implementation cache all functions from the current version
     */
    function clearVersion() internal {
        bytes4 func;
        address impl;
        uint256 i;

        for (i = 0; i < registry.getFunctionCount(version_); i++) {
            (func, impl) = registry.getFunctionByIndex(version_, i);
            implementations_[func] = address(0);
        }

        fallback_ = address(0);
    }

    /**
     * @dev Adds to the implementation cache all functions from the current version
     */
    function loadVersion() internal {
        bytes4 func;
        address impl;
        uint256 i;

        for (i = 0; i < registry.getFunctionCount(version_); i++) {
            (func, impl) = registry.getFunctionByIndex(version_, i);
            implementations_[func] = impl;
        }

        fallback_ = registry.getFallback(version_);
    }
}
