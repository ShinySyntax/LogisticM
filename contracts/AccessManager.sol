pragma solidity ^0.5.0;

import "./roles/SupplierRole.sol";
import "./roles/DeliveryManRole.sol";
import "./roles/OwnerRole.sol";
import "./NamedAccount.sol";


contract AccessManager is NamedAccount, OwnerRole, DeliveryManRole, SupplierRole {
    modifier supplierOrDeliveryMan() {
        require(_isSupplierOrDeliveryMan(msg.sender),
            "Logistic: caller does not have the Supplier role nor the DeliveryMan role");
        _;
    }

    function addSupplier(address account, string memory name_)
        public
        onlyOwner
    {
        require(!isDeliveryMan(account), "Logistic: Account is delivery man");
        require(owner() != account, "Logistic: Owner can't be supplier");

        _setName(account, name_);
        _addSupplier(account, name_);
    }

    function removeSupplier(address account) public onlyOwner {
        _removeSupplier(account);
    }

    function addDeliveryMan(address account, string memory name_)
        public
        onlyOwner
    {
        require(!isSupplier(account), "Logistic: Account is supplier");
        require(owner() != account, "Logistic: Owner can't be delivery man");

        _setName(account, name_);
        _addDeliveryMan(account, name_);
    }

    function removeDeliveryMan(address account) public onlyOwner {
        _removeDeliveryMan(account);
    }

    function _isSupplierOrDeliveryMan(address account)
        internal
        view
        returns (bool)
    {
        return isSupplier(account) || isDeliveryMan(account);
    }
}
