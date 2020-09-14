// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;


/**
 * @title RolesLibrary
 * @dev The library that manage the roles.
 * This library is linked with AccessImplementation.
 */
library RolesLibrary {
    enum RoleNames {
        Nobody,
        Supplier,
        DeliveryMan,
        Owner
    }

    struct Roles {
        mapping (address => RoleNames) roles;
    }

    /**
    * @dev This function grant supplier role to account.
    * @param account representing the address of the new supplier
    */
    function addSupplier(Roles storage self, address account) external {
        require(
            self.roles[account] == RoleNames.Nobody,
            "RolesLibrary: roles already defined"
        );
        self.roles[account] = RoleNames.Supplier;
    }

    /**
    * @dev This function revoke supplier role.
    * @param account representing the address of the supplier
    */
    function removeSupplier(Roles storage self, address account) external {
        require(
            isSupplier(self, account),
            "RolesLibrary: account is not supplier"
        );
        self.roles[account] = RoleNames.Nobody;
    }

    /**
    * @dev This function grant delivery man role to account.
    * @param account representing the address of the new delivery man
    */
    function addDeliveryMan(Roles storage self, address account) external {
        require(
            self.roles[account] == RoleNames.Nobody,
            "RolesLibrary: roles already defined"
        );
        self.roles[account] = RoleNames.DeliveryMan;
    }

    /**
    * @dev This function revoke delivery man role.
    * @param account representing the address of the delivery man
    */
    function removeDeliveryMan(Roles storage self, address account) external {
        require(
            isDeliveryMan(self, account),
            "RolesLibrary: account is not delivery man"
        );
        self.roles[account] = RoleNames.Nobody;
    }

    /**
    * @dev This function returns true if the given account is a supplier.
    * @return bool Whether or not account has the supplier role.
    */
    function isSupplier(Roles storage self, address account)
        public
        view
        returns (bool)
    {
        require(
            account != address(0),
            "RolesLibrary: account is the zero address"
        );
        return self.roles[account] == RoleNames.Supplier;
    }

    /**
    * @dev This function returns true if the given account is a delivery man.
    * @return bool Whether or not account has the delivery man role.
    */
    function isDeliveryMan(Roles storage self, address account)
        public
        view
        returns (bool)
    {
        require(
            account != address(0),
            "RolesLibrary: account is the zero address"
        );
        return self.roles[account] == RoleNames.DeliveryMan;
    }
}
