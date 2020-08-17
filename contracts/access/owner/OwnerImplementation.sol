pragma solidity ^0.5.0;

import "../../logistic/LogisticSharedStorage.sol";
import "./OwnerInterface.sol";
import "../../commons/Pausable.sol";
import "../../proxy/Upgradeable.sol";


contract OwnerImplementation is OwnerInterface, LogisticSharedStorage, Upgradeable, Pausable {
    function getOwner() external view returns (address) {
        return owner;
    }

    function initializeOwner(address sender) public {
        super.initialize(msg.sender);
        owner = sender;
    }

    function transferOwnership(address newOwner) public {
        require(owner == msg.sender, "Owner: caller is not the owner");

        // DEBUG --------------------
        if (newOwner == address(0)) {
            paused = true;
        }
        // END DEBUG --------------------
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );

        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
