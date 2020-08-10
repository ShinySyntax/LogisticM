pragma solidity ^0.5.0;

import "./ERC721/ERC721AutoIncrement.sol";


contract NamedAccount is ERC721AutoIncrement {
    // User (address) is named (string)
    mapping (address => string) public names;

    // name (string) refer to user (address)
    mapping (string => address) public addresses;

    function _setName(address account, string memory name_) internal {
        string memory empty = "";
        require(keccak256(bytes(names[account])) == keccak256(bytes(empty)),
            "NamedAccount: invalid name"); // TODO: pause the contract
        require(addresses[name_] == address(0),
            "NamedAccount: invalid address");
        names[account] = name_;
        addresses[name_] = account;
    }
}
