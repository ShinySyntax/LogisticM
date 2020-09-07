pragma solidity ^0.5.0;


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

    function addSupplier(Roles storage self, address account) external {
        require(
            self.roles[account] == RoleNames.Nobody,
            "RolesLibrary: roles already defined"
        );
        self.roles[account] = RoleNames.Supplier;
    }

    function removeSupplier(Roles storage self, address account) external {
        require(
            isSupplier(self, account),
            "RolesLibrary: account is not supplier"
        );
        self.roles[account] = RoleNames.Nobody;
    }

    function addDeliveryMan(Roles storage self, address account) external {
        require(
            self.roles[account] == RoleNames.Nobody,
            "RolesLibrary: roles already defined"
        );
        self.roles[account] = RoleNames.DeliveryMan;
    }

    function removeDeliveryMan(Roles storage self, address account) external {
        require(
            isDeliveryMan(self, account),
            "RolesLibrary: account is not delivery man"
        );
        self.roles[account] = RoleNames.Nobody;
    }

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
}
