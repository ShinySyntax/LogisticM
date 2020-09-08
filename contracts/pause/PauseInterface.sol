pragma solidity ^0.5.0;

import "./PauseEvents.sol";


/**
 * @title PauseInterface
 * @dev Define the interface of the Pause logic contract.
 */
contract PauseInterface is PauseEvents {
    function getPaused() public view returns (bool);
    function pause() public;
    function unpause() public;
}
