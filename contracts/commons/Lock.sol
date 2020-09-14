// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;


/**
 * @title Lock
 * @dev Deinfes a modifier that lock a function.
 */
contract Lock {
    /**
     * @dev This modifier restricts access to the function.
     * @param lock The lock variable of the proxy storage
     */
    modifier locked(bool lock) {
        require(lock == false, "Lock: locked");
        _;
    }
}
