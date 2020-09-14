pragma solidity 0.5.5;


/**
 * @title PauseEvents
 * @dev Define the events used in the Pause logic contract.
 */
contract PauseEvents {
    /**
     * @dev Emitted when the pause is triggered by (`account`).
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by (`account`).
     */
    event Unpaused(address account);
}
