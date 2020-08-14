pragma solidity ^0.5.0;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/lifecycle/Pausable.sol

import "./PauseStorage.sol";
import "../commons/Ownable.sol";
import "../commons/Restricted.sol";


contract PauseImplementation is PauseStorage, Ownable, Restricted {
    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function getPaused() public view returns (bool) {
        return paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(paused, "Pausable: not paused");
        _;
    }

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function internalPause() public restricted whenNotPaused {
        _pause();
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function internalUnpause() public restricted whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // Internal methods:
    function _pause() internal whenNotPaused {
        paused = true;
        emit Paused(msg.sender);
    }

    function _unpause() internal whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
