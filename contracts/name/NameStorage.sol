pragma solidity ^0.5.0;


contract NameStorage {
    // User (address) is named (string)
    mapping (address => string) internal names;

    // name (string) refer to user (address)
    mapping (string => address) internal addresses;
}
