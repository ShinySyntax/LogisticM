pragma solidity ^0.5.0;


contract Ownable {
    modifier onlyOwner(address owner) {
        require(
            owner == msg.sender,
            "Ownable: caller is not the owner"
        );
        _;
    }

    modifier notOwner(address owner) {
        require(msg.sender != owner);
        _;
    }
}
