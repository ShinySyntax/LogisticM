pragma solidity ^0.5.0;


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
