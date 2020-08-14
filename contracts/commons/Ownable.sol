pragma solidity ^0.5.0;


contract Ownable {
    address public owner;

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
