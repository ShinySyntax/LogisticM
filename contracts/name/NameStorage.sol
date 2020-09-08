pragma solidity ^0.5.0;


/**
 * @title NameStorage
 * @dev Define the storage of the Name logic contract.
 */
contract NameStorage {
    /// User (address) is named (string)
    mapping (address => string) internal names;

    /// name (string) refer to user (address)
    mapping (string => address) internal addresses;
}
