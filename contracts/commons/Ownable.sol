pragma solidity ^0.5.0;


contract Ownable {
    modifier onlyOwner(address owner_) {
        require(
            owner_ == msg.sender,
            "Ownable: caller is not the owner"
        );
        _;
    }
}
