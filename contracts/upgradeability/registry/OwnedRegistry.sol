// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "./Registry.sol";
import "./RegistryOwnership.sol";


/**
 * @title Registry
 * @dev This contract works as a registry of versions, it holds the implementations for the registered versions.
 * @dev Methods that change state are access-restricted: only the creator of the registry can call them.
 */
contract OwnedRegistry is Registry, RegistryOwnership {
    function addFallback(string memory version, address implementation)
        public
        onlyRegistryOwner
    {
        _addFallback(version, implementation);
    }

    /**
    * @dev Registers a new version of a function with its implementation address
    * @param version representing the version name of the new function implementation to be registered
    * @param func representing the name of the function to be registered
    * @param implementation representing the address of the new function implementation to be registered
    */
    function addVersionFromName(
        string memory version,
        string memory func,
        address implementation
    )
        public
        onlyRegistryOwner
    {
        _addVersionFromName(version, func, implementation);
    }

    /**
    * @dev Registers a new version of a function with its implementation address
    * @param version representing the version name of the new function implementation to be registered
    * @param func representing the signature of the function to be registered
    * @param implementation representing the address of the new function implementation to be registered
    */
    function addVersion(
        string memory version,
        bytes4 func,
        address implementation
    )
        public
        onlyRegistryOwner
    {
        _addVersion(version, func, implementation);
    }

    /**
     * @dev For each function, set the version to the given `targetVersion`
     * @param targetVersion representing the version name of the new implementations to be set
     */
    function upgradeFunctions(
        string memory currentVersion,
        string memory targetVersion
    )
        public
        onlyRegistryOwner
    {
        _upgradeFunctions(currentVersion, targetVersion);
    }

    /**
    * @dev Creates an upgradeable proxy
    * @return address of the new proxy created
    */
    function createProxy(string memory version)
        public
        onlyRegistryOwner
        returns (LogisticMProxy)
    {
        return _createProxy(version);
    }
}
