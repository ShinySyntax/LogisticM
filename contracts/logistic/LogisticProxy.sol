pragma solidity ^0.5.0;

import "./LogisticSharedStorage.sol";
import "../proxy/OwnedUpgradeabilityProxy.sol";
import "../commons/Ownable.sol";
import "../proxy/ImplementationBase.sol";


contract LogisticProxy is
    LogisticSharedStorage,
    OwnedUpgradeabilityProxy,
    ImplementationBase,
    Ownable {

    constructor(string memory _version, address sender)
        public
        OwnedUpgradeabilityProxy(_version, sender)
        ImplementationBase(address(0), _version)
    {
        require(msg.sender == address(registry), "LogisticProxy: bad sender");
        setRegistry(address(registry));

        // We need to initialize these implementations.
        // It will send variables like owner, _symbol...
        dCall(abi.encodeWithSignature("initializeOwner(address)", sender));
        dCall(abi.encodeWithSignature("initializeERC721()"));
    }

    // Used mainly in the tests, but can be usefull for the owner to bypass
    // some check.
    // WARNING: always set lock to true after doing operations
    function setLock(bool lock_) external onlyOwner(owner) {
        lock = lock_;
    }
}
