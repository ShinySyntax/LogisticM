// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;


/**
 * @title AccessEvents
 * @dev Defines the events used in the Access logic contract.
 */
contract AccessEvents {
    /**
    * @dev This event will be emitted every time a supplier role is granted
    * @param account representing the address of the new supplier
    */
    event SupplierAdded(address indexed account);

    /**
    * @dev This event will be emitted every time a supplier role is revoked
    * @param account representing the address of the previously supplier
    */
    event SupplierRemoved(address indexed account);

    /**
    * @dev This event will be emitted every time a delivery man role is granted
    * @param account representing the address of the new delivery man
    */
    event DeliveryManAdded(address indexed account);

    /**
    * @dev This event will be emitted every time a delivery man role is revoked
    * @param account representing the address of the previously delivery man
    */
    event DeliveryManRemoved(address indexed account);
}
