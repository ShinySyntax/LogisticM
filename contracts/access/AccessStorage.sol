pragma solidity ^0.5.5;

import "./AccessEvents.sol";
import "./RolesLibrary.sol";
import "../proxy/Upgradeable.sol";


contract AccessStorage is Upgradeable, AccessEvents {
    using RolesLibrary for RolesLibrary.Roles;

    RolesLibrary.Roles internal logisticRoles;
}
