pragma solidity ^0.5.0;


/**
 * @title BytesLib for Logistic
 * @dev Deinfes internal function for bytes conversion.
 */
library BytesLib {
    // https://ethereum.stackexchange.com/questions/37974/convert-bytes-memory-to-bytes8
    function convertBytesToBytes4(bytes memory inBytes) internal pure returns (bytes4 outBytes4) {
        if (inBytes.length == 0) {
            return 0x0;
        }

        assembly {
            outBytes4 := mload(add(inBytes, 32))
        }
    }

    // https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string
    function bytes32ToString(bytes32 x) internal pure returns (string memory) {
        uint j;
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
}
