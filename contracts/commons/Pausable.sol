pragma solidity ^0.5.0;


contract Pausable {
    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused(bool paused) {
        require(!paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused(bool paused) {
        require(paused, "Pausable: not paused");
        _;
    }
}
