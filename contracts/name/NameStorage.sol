pragma solidity ^0.5.0;

import "./NameEvents.sol";
import "../proxy/Upgradeable.sol";


contract NameStorage is Upgradeable, NameEvents {
    // User (address) is named (string)
    mapping (address => string) internal names;

    // name (string) refer to user (address)
    mapping (string => address) internal addresses;
}
