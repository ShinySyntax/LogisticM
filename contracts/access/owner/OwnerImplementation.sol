// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "../../logisticM/LogisticMSharedStorage.sol";
import "./OwnerInterface.sol";
import "../../upgradeability/Upgradeable.sol";
import "../../upgradeability/ImplementationBase.sol";


/**
 * @title OwnerImplementation
 * @dev The Owner logic contract. The owner of the LogisticM contract is the superuser.
 * Only the superuser can perform the user role management.
 */
contract OwnerImplementation is
    OwnerInterface,
    LogisticMSharedStorage,
    ImplementationBase,
    Upgradeable {

    /**
    * @dev Returns the address of the owner.
    * @return address owner of LogisticM
    */
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
    * @dev This function allows to transfer the ownership of the LogisticM Contract
    * @param newOwner representing the address of the new owner
    */
    function transferOwnership(address newOwner) public {
        require(owner == msg.sender, "Owner: caller is not the owner");
        require(newOwner != address(0), "Owner: new owner is the zero address");
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "getRole(address)", newOwner)), (uint)) == 0,
            "Owner: new ower is not RoleNames.Nobody"
        );

        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
