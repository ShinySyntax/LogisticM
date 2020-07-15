pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";


contract MerchantRole {
    using Roles for Roles.Role;

    event MerchantAdded(address indexed account);
    event MerchantRemoved(address indexed account);

    Roles.Role private _merchant;

    constructor () internal {
        _addMerchant(msg.sender);
    }

    modifier onlyMerchant() {
        require(isMerchant(msg.sender),
            "MerchantRole: caller does not have the Merchant role");
        _;
    }

    function isMerchant(address account) public view returns (bool) {
        return _merchant.has(account);
    }

    function renounceMerchant() public {
        _removeMerchant(msg.sender);
    }

    function _addMerchant(address account) internal {
        _merchant.add(account);
        emit MerchantAdded(account);
    }

    function _removeMerchant(address account) internal {
        _merchant.remove(account);
        emit MerchantRemoved(account);
    }
}
