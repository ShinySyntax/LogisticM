pragma solidity ^0.5.0;


contract Delegater {
    event RevertLog(string reason);

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

    function delegateCallProxy(address _impl) internal {
        // revert("proxy closed");
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}
