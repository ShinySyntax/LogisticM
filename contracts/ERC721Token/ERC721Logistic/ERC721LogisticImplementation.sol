pragma solidity ^0.5.0;

import "../ERC721Base/ERC721BaseImplementation.sol";
import "./ERC721LogisticInterface.sol";
import "../../commons/Lock.sol";
import "../../proxy/Upgradeable.sol";


contract ERC721LogisticImplementation is ERC721BaseImplementation, ERC721LogisticInterface, Upgradeable, Lock {
    function getCounter() public view returns (uint256) {
        return counter;
    }

    function initializeERC721() public {
        super.initialize(msg.sender);
        // _name = "LogisticM";
        // _symbol = "LM";
        //
        // // register the supported interfaces to conform to ERC721 via ERC165
        // // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/introspection/ERC165.sol
        // bytes4 interfaceId = _INTERFACE_ID_ERC721_METADATA;
        // require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        // _supportedInterfaces[interfaceId] = true;
    }

    function mint(address to) public locked(lock) {
        _mint(to, counter);
        counter = counter.add(11);
    }

    function approve(address to, uint256 tokenId) public locked(lock) {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address, bool) public {
        revert("LogisticBase: can not approve for all");
    }

    function transferFrom(address from, address to, uint256 tokenId)
        public
        locked(lock)
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
