pragma solidity ^0.5.0;

import "../logistic/LogisticSharedStorage.sol";
import "./NameInterface.sol";
import "../commons/BytesLib.sol";


contract NameImplementation is NameInterface, LogisticSharedStorage {
    string internal constant EMPTY = "";

    function setName(address account, bytes32 nameBytes32) external {
        string memory name = BytesLib.bytes32ToString(nameBytes32);

        if (keccak256(bytes(names[account])) == keccak256(bytes(name))) {
            return;
        }

        // Can't rename
        require(keccak256(bytes(names[account])) == keccak256(bytes(EMPTY)),
            "Name: invalid name");
        require(addresses[name] == address(0),
            "Name: invalid address");

        names[account] = name;
        addresses[name] = account;
    }

    function getName(address account) external view returns (string memory) {
        return names[account];
    }

    function getAddress(bytes32 nameBytes32) external view returns (address) {
        string memory name = BytesLib.bytes32ToString(nameBytes32);
        return addresses[name];
    }
}
