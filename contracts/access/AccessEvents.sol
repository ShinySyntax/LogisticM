pragma solidity ^0.5.0;


contract AccessEvents {
    event SupplierAdded(address indexed account, string name);
    event SupplierRemoved(address indexed account);

    event DeliveryManAdded(address indexed account, string name);
    event DeliveryManRemoved(address indexed account);
}
