pragma solidity 0.5.5;

import "./UpgradeabilityStorage.sol";
import "../commons/BytesLib.sol";


/**
 * @title ImplementationBase
 * @dev This contract allows to perform delegate calls between logic contracts.
 */
contract ImplementationBase is UpgradeabilityStorage {
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
        address impl = registry.getFunction(version_, func);
        bytes memory result = degelateCallWithRevert(impl, encoded);
        return result;
    }

    /**
     * @dev Perform a delegate call to a logic contract.
     * Revert with the revert reason given by the logic contract if the call reverts.
     * @param impl The address of the implementation of the logic contract
     * @param signature The data signature for the delegate call
     * @return The result of the delegate call
     */
    function degelateCallWithRevert(address impl, bytes memory signature)
        internal
        returns (bytes memory)
    {
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory result) = address(impl).delegatecall(signature);
        if (success == false) {
            // solhint-disable-next-line no-inline-assembly
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
