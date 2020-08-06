pragma solidity ^0.5.0;

import "./ERC721/ERC721Restricted.sol";


contract NamedAccount is ERC721Restricted {
    // User (address) is named (string)
    mapping (address => string) internal _names;

    // name (string) refer to user (address)
    mapping (string => address) internal _addresses;

    function getNameByAddress(address account) public view returns (string memory) {
        return _names[account];
    }

    function getAddressByName(string memory name_) public view returns (address) {
        return _addresses[name_];
    }

    function _setName(address account, string memory name_) internal {
        string memory empty = "";
        require(keccak256(bytes(_names[account])) == keccak256(bytes(empty)),
            "NamedAccount: invalid name"); // TODO: pause the contract
        require(_addresses[name_] == address(0),
            "NamedAccount: invalid address");
        _names[account] = name_;
        _addresses[name_] = account;
    }
}
