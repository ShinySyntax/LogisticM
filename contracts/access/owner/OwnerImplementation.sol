pragma solidity ^0.5.0;

import "../../logistic/LogisticSharedStorage.sol";
import "./OwnerInterface.sol";
import "../../upgradeability/Upgradeable.sol";


/**
 * @title OwnerImplementation
 * @dev The Owner logic contract. The owner of the Logistic contract is the superuser.
 * Only the superuser can perform the user role management.
 */
contract OwnerImplementation is OwnerInterface, LogisticSharedStorage, Upgradeable {
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
    * @dev This function is called by the proxy at its creation.
    * This initialize the owner.
    * @param sender representing the address of the sender
    */
    function initializeOwner(address sender) public {
        super.initialize(msg.sender);
        owner = sender;
    }

    /**
    * @dev This function allows to transfer the ownership of the Logistic Contract
    * @param newOwner representing the address of the new owner
    */
    function transferOwnership(address newOwner) public {
        require(owner == msg.sender, "Owner: caller is not the owner");

        // DEBUG --------------------
        // if (newOwner == address(0)) {
        //     paused = true;
        // }
        // Comment the following require statement
        // END DEBUG --------------------
        require(newOwner != address(0), "Owner: new owner is the zero address");

        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
