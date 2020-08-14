pragma solidity ^0.5.0;

import "../proxy/Upgradeable.sol";
import "./PauseEvents.sol";


contract PauseStorage is Upgradeable, PauseEvents {
    bool internal paused = false;
}
