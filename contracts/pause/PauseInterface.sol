pragma solidity ^0.5.0;

import "./PauseEvents.sol";


contract PauseInterface is PauseEvents {
    function getPaused() public view returns (bool);
    function pause() public;
    function unpause() public;
}
