pragma solidity 0.5.5;

import "./OwnerEvents.sol";


/**
 * @title OwnerInterface
 * @dev Define the interface of the Product logic Owner.
 */
contract OwnerInterface is OwnerEvents {
    function transferOwnership(address newOwner) external;
    function getOwner() external view returns (address);
    function initializeOwner(address sender) public;
}
