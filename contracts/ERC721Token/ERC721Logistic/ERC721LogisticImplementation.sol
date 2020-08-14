pragma solidity ^0.5.0;

import "../ERC721Base/ERC721BaseImplementation.sol";
import "./ERC721LogisticStorage.sol";
import "../../commons/Restricted.sol";
import "../../commons/Ownable.sol";


contract ERC721LogisticImplementation is ERC721BaseImplementation,
    ERC721LogisticStorage,
    Restricted,
    Ownable {

    function getCounter() public view returns (uint256) {
        return counter;
    }

    function initializeERC721() public onlyOwner {
        _name = "LogisticM";
        _symbol = "LM";

        // register the supported interfaces to conform to ERC721 via ERC165
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/introspection/ERC165.sol
        bytes4 interfaceId = _INTERFACE_ID_ERC721_METADATA;
        require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceId] = true;
    }

    function mint(address to) public restricted {
        _mint(to, counter);
        counter += 1;
    }

    function approve(address to, uint256 tokenId) public restricted {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address, bool) public {
        revert("LogisticBase: can not approve for all");
    }

    function transferFrom(address from, address to, uint256 tokenId)
        public
        restricted
    {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address, address, uint256) public {
        revert("LogisticBase: can not transfer");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public {
        revert("LogisticBase: can not transfer");
    }
}
