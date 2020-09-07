pragma solidity ^0.5.0;

import "./registry/IRegistry.sol";
import "../commons/BytesLib.sol";


/**
 * @title ImplementationBase
 * @dev This contract allows to perform delegate calls between logic contracts.
 */
contract ImplementationBase {
    /// The registry, used to retreive implementation addresses
    IRegistry private _registry;

    /// The current version of Logistic
    string private _version;

    constructor(address registryAddress, string memory version) internal {
        setRegistry(registryAddress);
        _version = version;
    }

    /**
     * @dev The the address of the registry.
     * @param registryAddress The new registry address
     */
    function setRegistry(address registryAddress) internal {
        _registry = IRegistry(registryAddress);
    }

    /**
     * @dev Retreive the implementation address of the logic contract and
     * perform a delegate call to the logic contract.
     * @param encoded The data signature for the delegate call
     * @return The result of the delegate call
     */
    function dCall(bytes memory encoded) internal returns (bytes memory) {
        // Delegate call to the contract implementation of the given encoded
        // signature
        bytes4 func = BytesLib.convertBytesToBytes4(encoded);
        address _impl = _registry.getFunction(_version, func);
        bytes memory result = degelateCallWithRevert(_impl, encoded);
        return result;
    }

    /**
     * @dev Perform a delegate call to a logic contract.
     * Revert with the revert reason given by the logic contract if the call reverts.
     * @param _impl The address of the implementation of the logic contract
     * @param signature The data signature for the delegate call
     * @return The result of the delegate call
     */
    function degelateCallWithRevert(address _impl, bytes memory signature)
        internal
        returns (bytes memory)
    {
        (bool success, bytes memory result) = address(_impl).delegatecall(signature);
        if (success == false) {
            assembly {
                let ptr := mload(0x40)
                let size := returndatasize
                returndatacopy(ptr, 0, size)
                revert(ptr, size)
            }
        }
        return result;
    }
}
