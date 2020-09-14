// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/lifecycle/Pausable.sol

import "../logistic/LogisticSharedStorage.sol";
import "./PauseInterface.sol";
import "../commons/Ownable.sol";
import "../commons/Lock.sol";
import "../commons/Pausable.sol";


/**
 * @title PauseImplementation
 * @dev The Pause logic contract. This allows the owner of Logistic to pause the
 * Logistic contract. This means that not handover can happen when the contract
 * is paused.
 */
contract PauseImplementation is PauseInterface, LogisticSharedStorage, Ownable, Lock, Pausable {
    /**
     * @dev Called by the owner to pause, triggers stopped state.
     */
    function pause() public onlyOwner(owner) whenNotPaused(paused) {
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Called by the owner to unpause, returns to normal state.
     */
    function unpause() public onlyOwner(owner) whenPaused(paused) {
        require(lock == true, "Pause: contract is unlock");
        paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function getPaused() public view returns (bool) {
        return paused;
    }
}
