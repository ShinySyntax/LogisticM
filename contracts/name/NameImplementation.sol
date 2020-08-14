pragma solidity ^0.5.0;

import "./NameStorage.sol";
import "../commons/Restricted.sol";


contract NameImplementation is NameStorage, Restricted {
    function setName(address account, string calldata name)
        external
        restricted
    {
        string memory empty = "";

        // Can't rename
        require(keccak256(bytes(names[account])) == keccak256(bytes(empty)),
            "NamedAccount: invalid name");
        require(addresses[name] == address(0),
            "NamedAccount: invalid address");

        names[account] = name;
        addresses[name] = account;
    }

    function getName(address account) external view returns (string memory) {
        return names[account];
    }

    function getAddress(string calldata name) external view returns (address) {
        return addresses[name];
    }
}
