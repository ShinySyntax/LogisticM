pragma solidity ^0.5.0;

import "../contracts/commons/BytesLib.sol";


contract TestBytesLib {
    function testConvertBytesToBytes4() public {
        BytesLib.convertBytesToBytes4(new bytes(0));
    }

    function testStringToBytes32() public {
        BytesLib.stringToBytes32(string(""));
    }
}
