pragma solidity ^0.5.0;

import "../ERC721Base/ERC721BaseInterface.sol";
import "../ERC721Base/ERC721BaseEvents.sol";


contract ERC721LogisticInterface is ERC721BaseInterface {
    function mint(address to) public;
    function getCounter() public returns (uint256);
}
