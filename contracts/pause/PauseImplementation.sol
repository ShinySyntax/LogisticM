pragma solidity ^0.5.0;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/lifecycle/Pausable.sol

import "../logistic/LogisticSharedStorage.sol";
import "./PauseInterface.sol";
import "../commons/Ownable.sol";
import "../commons/Lock.sol";
import "../commons/Pausable.sol";


contract PauseImplementation is PauseInterface, LogisticSharedStorage, Ownable, Lock, Pausable {
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
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public onlyOwner(owner) whenPaused(paused) {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
