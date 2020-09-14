// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;


/**
 * @title ProductEvents
 * @dev Define the events used in the Product logic contract.
 */
contract ProductEvents {
    /**
    * @dev This event will be emitted every time a product is created by a supplier.
    * @param by representing the address of the supplier
    * @param purchaser representing the address of the purchaser of the created product
    * @param productHash The product hash
    * @param productName The product name
    */
    event NewProduct(
        address indexed by,
        address indexed purchaser,
        bytes32 indexed productHash,
        string productName
    );

    /**
    * @dev This event will be emitted every time a product is shipped.
    * @param from representing the address of the sender
    * @param to representing the address of the receiver
    * @param productHash The product hash
    * @param productName The product name
    */
    event ProductShipped(
        address indexed from,
        address indexed to,
        bytes32 indexed productHash,
        string productName
    );

    /**
    * @dev This event will be emitted every time a product is received.
    * @param from representing the address of the sender
    * @param by representing the address of the receiver
    * @param productHash The product hash
    * @param productName The product name
    */
    event ProductReceived(
        address indexed from,
        address indexed by,
        bytes32 indexed productHash,
        string productName
    );
}
