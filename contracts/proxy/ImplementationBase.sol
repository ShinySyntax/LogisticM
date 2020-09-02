pragma solidity ^0.5.0;

import "./IRegistry.sol";
import "../commons/BytesLib.sol";


contract ImplementationBase {
    IRegistry private _registry;
    string private _version;

    constructor(address registryAddress, string memory version) internal {
        setRegistry(registryAddress);
        _version = version;
    }

    function setRegistry(address registryAddress) internal {
        _registry = IRegistry(registryAddress);
    }

    function dCall(bytes memory encoded) internal returns (bytes memory) {
        // Delegate call to the contract implementation of the given encoded
        // signature
        bytes4 func = BytesLib.convertBytesToBytes4(encoded);
        address _impl = _registry.getFunction(_version, func);
        bytes memory result = degelateCallWithRevert(_impl, encoded);
        return result;
    }

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
