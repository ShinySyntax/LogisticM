pragma solidity ^0.5.0;


/**
 * @title BytesLib for Logistic
 * @dev Deinfes internal function for bytes conversion.
 */
library BytesLib {
    /**
     * @dev Truncate the given bytes.
     * See https://ethereum.stackexchange.com/questions/37974/convert-bytes-memory-to-bytes8
     * @param inBytes The bytes array
     * @return A `bytes4`: the first four bytes of `inBytes`
     */
    function convertBytesToBytes4(bytes memory inBytes)
        internal
        pure
        returns (bytes4 outBytes4)
    {
        if (inBytes.length == 0) {
            return 0x0;
        }

        assembly {
            // add 32 to inBytes pointer to skip the length of the bytes array
            outBytes4 := mload(add(inBytes, 32))
        }
        // because outBytes4 is of type bytes4, only the first four bytes are returned
    }

    /**
     * @dev Convert the given bytes to a string.
     * See https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string
     * @param inBytes32 The bytes array
     * @return A `string`
     */
    function bytes32ToString(bytes32 inBytes32)
        internal
        pure
        returns (string memory)
    {
        uint j;
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(inBytes32) * 2 ** (8 * j)));
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
