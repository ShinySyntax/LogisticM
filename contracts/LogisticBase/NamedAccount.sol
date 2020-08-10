pragma solidity ^0.5.0;


library NamedAccount {
    struct AddressesAndNames {
        // User (address) is named (string)
        mapping (address => string) names;

        // name (string) refer to user (address)
        mapping (string => address) addresses;
    }

    function _setName(
        AddressesAndNames storage self,
        address account,
        string memory name_)
        internal
    {
        string memory empty = "";
        require(keccak256(bytes(self.names[account])) == keccak256(bytes(empty)),
            "NamedAccount: invalid name"); // TODO: pause the contract
        require(self.addresses[name_] == address(0),
            "NamedAccount: invalid address");

        self.names[account] = name_;
        self.addresses[name_] = account;
    }
}
