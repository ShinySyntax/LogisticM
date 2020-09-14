// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "./registry/IRegistry.sol";


/**
 * @title UpgradeabilityStorage
 * @dev This contract holds all the necessary state variables to support the upgrade functionality
 */
contract UpgradeabilityStorage {
    /// Registry of versions
    IRegistry internal registry;

    /// Current version
    string internal version_;

    /// Optional fallback function
    address internal fallback_;

    /// Cache of functions to current implementations
    mapping (bytes4 => address) internal implementations_;

    /**
    * @dev Returns the address of the current implementation for a given function signature
    * @param func representing the signature of the function to query the implementation of
    * @return address of the current implementation of the given function
    */
    function implementation(bytes4 func) public view returns (address) {
        address impl = implementations_[func];
        return impl == address(0) ? fallback_ : impl;
    }
}
