// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;


/**
 * @title ERC721Mock
 * @dev This contract is used for the tests.
 */
contract MockImplementationV0 {
    constructor() public {
        myMethod();
    }

    // solhint-disable-next-line no-empty-blocks
    function myMethod() public pure {}
}
