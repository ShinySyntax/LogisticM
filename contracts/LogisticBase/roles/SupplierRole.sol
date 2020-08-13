pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";


contract SupplierRole {
    using Roles for Roles.Role;

    event SupplierAdded(address indexed account, string name);
    event SupplierRemoved(address indexed account);

    Roles.Role private _supplier;

    modifier onlySupplier(address sender) {
        require(isSupplier(sender),
            "SupplierRole: caller does not have the Supplier role");
        _;
    }

    modifier notSupplier() {
        require(!isSupplier(msg.sender),
            "SupplierRole: caller has the Supplier role");
        _;
    }

    function isSupplier(address account) public view returns (bool) {
        return true;
        // return _supplier.has(account);
    }

    function isSupplier(address account) public view returns (bool) {
        return _supplier.has(account);
    }

    function _addSupplier(address account, string memory name_) internal {
        _supplier.add(account);
        emit SupplierAdded(account, name_);
    }

    function _removeSupplier(address account) internal {
        _supplier.remove(account);
        emit SupplierRemoved(account);
    }
}
