pragma solidity ^0.5.0;

import "../ERC721Token/ERC721Base/ERC721BaseImplementation.sol";


contract ERC721Mock is ERC721BaseImplementation {
    constructor() public {
        _name = "MockToken";
        _symbol = "MT";

        _mint(msg.sender, 1);
        _safeMint(msg.sender, 2);
        _safeMint(msg.sender, 20);
        _safeMint(msg.sender, 3); // will be burnt
        _safeMint(msg.sender, 4); // will be burnt
        _burn(4);

        _setTokenURI(1, "FirstToken");
        _setTokenURI(20, "20thToken"); // will be burnt, to check line 389 of ERC721BaseImplementation
        _setBaseURI("BaseMock");
        _tokensOfOwner(msg.sender); // for test coverage
    }

    function mintToken(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function burnToken(uint256 tokenId) public {
        _burn(tokenId);
    }

    function burnTokenOwner(address owner, uint256 tokenId) public {
        _burn(owner, tokenId);
    }
}
