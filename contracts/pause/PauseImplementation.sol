pragma solidity ^0.5.0;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/lifecycle/Pausable.sol

import "../logistic/LogisticSharedStorage.sol";
import "./PauseInterface.sol";
import "../commons/Ownable.sol";
import "../commons/Restricted.sol";
import "../commons/Pausable.sol";


contract PauseImplementation is PauseInterface, LogisticSharedStorage, Ownable, Restricted, Pausable {
    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function getPaused() public view returns (bool) {
        return paused;
    }

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function pause() public onlyOwner(owner) whenNotPaused(paused) {
        _pause();
    }

    function internalPause() public restricted whenNotPaused(paused) {
        _pause();
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public onlyOwner(owner) whenPaused(paused) {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function internalUnpause() public restricted whenPaused(paused) {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // Internal methods:
    function _pause() internal whenNotPaused(paused) {
        paused = true;
        emit Paused(msg.sender);
    }

    function _unpause() internal whenPaused(paused) {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
