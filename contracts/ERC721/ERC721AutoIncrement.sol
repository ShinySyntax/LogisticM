pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";


contract ERC721AutoIncrement is ERC721Full("LogisticM", "LM") {
    uint256 internal counter = 0;

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
