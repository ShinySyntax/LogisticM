pragma solidity 0.5.5;


/**
 * @title OwnerEvents
 * @dev Defines the events used in the owner logic contract.
 */
contract OwnerEvents {
    /**
    * @dev This event will be emitted every time the ownership is transfered
    * @param previousOwner representing the address of the previous owner
    * @param newOwner representing the address of the new owner
    */
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
}
