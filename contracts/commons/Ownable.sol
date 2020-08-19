pragma solidity ^0.5.0;


contract Ownable {
    modifier onlyOwner(address owner_) {
        require(
            owner_ == msg.sender,
            "Ownable: caller is not the owner"
        );
        _;
    }

    modifier notOwner(address owner_) {
        require(msg.sender != owner_, "Ownable: caller is owner");
        _;
    }
}
