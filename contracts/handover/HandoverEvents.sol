pragma solidity ^0.5.0;


/**
 * @title HandoverEvents
 * @dev Defines the events used in the Handover logic contract.
 */
contract HandoverEvents {
    /**
    * @dev This event will be emitted every time a product handover happens
    * @param from representing the address of the previous owner of the product
    * @param to representing the address of the new owner of the product
    * @param productHash The product hash
    * @param productName The product name
    */
    event Handover(
        address indexed from,
        address indexed to,
        bytes32 indexed productHash,
        string productName
    );
}
