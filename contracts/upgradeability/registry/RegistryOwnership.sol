pragma solidity ^0.5.0;


/**
 * @title Ownable
 * @dev This contract has the owner address providing basic authorization control
 */
contract RegistryOwnership {

    /// Owner of the registry contract
    address private _registryOwner;

    /**
    * @dev Event to show ownership has been transferred
    * @param previousOwner representing the address of the previous registry owner
    * @param newRegistryOwner representing the address of the new registry owner
    */
    event RegistryOwnershipTransferred(address previousOwner, address newRegistryOwner);

    /**
    * @dev The constructor sets the original owner of the contract to the sender account.
    */
    constructor() public {
        setRegistryOwner(msg.sender);
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyRegistryOwner() {
        require(
            msg.sender == registryOwner(),
            "RegistryOwnership: Caller is not the registry owner"
        );
        _;
    }

    /**
    * @dev Tells the address of the registry owner
    * @return the address of the registry owner
    */
    function registryOwner() public view returns (address) {
        return _registryOwner;
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newRegistryOwner.
    * @param newRegistryOwner The address to transfer ownership to.
    */
    function transferRegistryOwnership(address newRegistryOwner) public onlyRegistryOwner {
        require(
            newRegistryOwner != address(0),
            "RegistryOwnership: Can't transfer ownership to the zero address"
        );
        emit RegistryOwnershipTransferred(registryOwner(), newRegistryOwner);
        setRegistryOwner(newRegistryOwner);
    }

    /**
    * @dev Sets a new registry owner address
    */
    function setRegistryOwner(address newRegistryOwner) internal {
        _registryOwner = newRegistryOwner;
    }
}
