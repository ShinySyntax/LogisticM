pragma solidity ^0.5.0;


/**
 * @title ERC721BaseEvents
 * @dev Defines the events used in the ERC721Base logic contract.
 */
contract ERC721BaseEvents {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );
}
