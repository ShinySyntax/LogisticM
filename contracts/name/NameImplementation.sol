pragma solidity 0.5.5;

import "../logistic/LogisticSharedStorage.sol";
import "./NameInterface.sol";
import "../commons/BytesLib.sol";


/**
 * @title NameImplementation
 * @dev The Name logic contract. This allow to set a name to an account to be
 * more user-friendly than using address when interacting with the contract.
 * All names are unique.
 */
contract NameImplementation is NameInterface, LogisticSharedStorage {
    string internal constant EMPTY = "";

    /**
     * @dev Set the name of the given account.
     * @param account The address of the account
     * @param nameBytes32 The name, in bytes32
     */
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

    /**
     * @dev Return the name of the given account.
     * @param account The address of the account
     * @return The name of the account
     */
    function getName(address account) external view returns (string memory) {
        return names[account];
    }

    /**
     * @dev Return the address of the given name.
     * @param nameBytes32 The name of the account
     * @return The address of the account
     */
    function getAddress(bytes32 nameBytes32) external view returns (address) {
        string memory name = BytesLib.bytes32ToString(nameBytes32);
        return addresses[name];
    }
}
