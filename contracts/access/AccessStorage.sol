pragma solidity ^0.5.5;

import "./RolesLibrary.sol";


contract AccessStorage {
    using RolesLibrary for RolesLibrary.Roles;

    RolesLibrary.Roles internal logisticRoles;
}
