pragma solidity ^0.5.0;

import "./roles/SupplierRole.sol";
import "./roles/DeliveryManRole.sol";
import "./roles/OwnerRole.sol";
import "./NamedAccount.sol";


contract AccessManager is
    OwnerRole,
    DeliveryManRole,
    SupplierRole {

    using NamedAccount for NamedAccount.AddressesAndNames;

    NamedAccount.AddressesAndNames private addressesAndNames;

    function addSupplier(address account, string calldata name_)
        external
        onlyOwner
    {
        require(!isDeliveryMan(account), "Logistic: Account is delivery man");
        require(owner != account, "Logistic: Owner can't be supplier");

        addressesAndNames._setName(account, name_);
        _addSupplier(account, name_);
    }

    function removeSupplier(address account) external onlyOwner {
        _removeSupplier(account);
    }

    function addDeliveryMan(address account, string calldata name_)
        external
        onlyOwner
    {
        require(!isSupplier(account), "Logistic: Account is supplier");
        require(owner != account, "Logistic: Owner can't be delivery man");

        addressesAndNames._setName(account, name_);
        _addDeliveryMan(account, name_);
    }

    function removeDeliveryMan(address account) external onlyOwner {
        _removeDeliveryMan(account);
    }

    function getName(address account) external view returns (string memory) {
        return addressesAndNames.names[account];
    }

    function getAddress(string calldata name) external view returns (address) {
        return addressesAndNames.addresses[name];
    }

    function _isSupplierOrDeliveryMan(address account)
        external
        view
        returns (bool)
    {
        return isSupplier(account) || isDeliveryMan(account);
    }
}
