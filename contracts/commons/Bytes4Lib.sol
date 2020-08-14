pragma solidity ^0.5.0;

// https://ethereum.stackexchange.com/questions/37974/convert-bytes-memory-to-bytes8

library Bytes4Lib {
    function convertBytesToBytes4(bytes calldata inBytes) external pure returns (bytes4 outBytes4) {
        if (inBytes.length == 0) {
            return 0x0;
        }

        bytes memory inBytesMemory = inBytes;

        assembly {
            outBytes4 := mload(add(inBytesMemory, 32))
        }
    }
}
