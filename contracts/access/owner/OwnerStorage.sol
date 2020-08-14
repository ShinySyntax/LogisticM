pragma solidity ^0.5.0;

import "./OwnerEvents.sol";
import "../../proxy/Upgradeable.sol";


contract OwnerStorage is Upgradeable, OwnerEvents {
    address internal owner;
}
