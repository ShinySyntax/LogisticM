pragma solidity 0.5.5;


/**
 * @title Pausable
 * @dev Deinfes modifiers whenNotPaused and whenPaused.
 */
contract Pausable {
    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     * @param paused The paused variable of the proxy storage
     */
    modifier whenNotPaused(bool paused) {
        require(!paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     * @param paused The paused variable of the proxy storage
     */
    modifier whenPaused(bool paused) {
        require(paused, "Pausable: not paused");
        _;
    }
}
