pragma solidity ^0.5.0;


contract AccessEvents {
    event SupplierAdded(address indexed account);
    event SupplierRemoved(address indexed account);

    event DeliveryManAdded(address indexed account);
    event DeliveryManRemoved(address indexed account);
}
