pragma solidity ^0.5.0;

import "../access/owner/OwnerStorage.sol";


contract Ownable is OwnerStorage {
    modifier onlyOwner() {
        require(
            owner == msg.sender,
            "Ownable: caller is not the owner"
        );
        _;
    }

    modifier notOwner() {
        require(msg.sender != owner);
        _;
    }
}
