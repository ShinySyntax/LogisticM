pragma solidity ^0.5.0;

import "../LogisticBase.sol";
import "../ILogisticBase.sol";


contract ERC721Restricted is ILogisticBase, LogisticBase {
    function approve(address to, uint256 tokenId) public onlyLogistic {
        address owner = ownerOf(tokenId);
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address, bool) public {
        revert("LogisticBase: can not approve for all");
    }

    function transferFrom(address from, address to, uint256 tokenId) public onlyLogistic {
        _transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address, address, uint256) public {
        revert("LogisticBase: can not transfer");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public {
        revert("LogisticBase: can not transfer");
    }
}
