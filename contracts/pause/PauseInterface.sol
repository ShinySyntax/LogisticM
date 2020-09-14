// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "./PauseEvents.sol";


/**
 * @title PauseInterface
 * @dev Define the interface of the Pause logic contract.
 */
contract PauseInterface is PauseEvents {
    function pause() public;
    function unpause() public;
    function getPaused() public view returns (bool);
}
