pragma solidity ^0.5.5;

import "./RolesLibrary.sol";


/**
 * @title AccessStorage
 * @dev Defines the storage of the Access logic contract.
 */
contract AccessStorage {
    using RolesLibrary for RolesLibrary.Roles;

    RolesLibrary.Roles internal logisticRoles;
}
