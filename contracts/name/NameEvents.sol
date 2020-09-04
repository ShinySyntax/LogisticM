pragma solidity ^0.5.0;


/**
 * @title NameEvents
 * @dev Defines the events used in the Name logic contract.
 */
contract NameEvents {
    /**
    * @dev This event will be emitted every time a name is set to an account
    * @param account The address of the account
    * @param name The name of the account
    */
    event NameAdded(address indexed account, string name);
}
