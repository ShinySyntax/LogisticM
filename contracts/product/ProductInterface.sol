// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "./ProductEvents.sol";


/**
 * @title ProductInterface
 * @dev Define the interface of the Product logic contract.
 */
contract ProductInterface is ProductEvents {
    function newProduct(
        bytes32 productHash,
        address purchaser,
        bytes32 productNameBytes32
    )
        public;

    function setProductSent(
        bytes32 productHash,
        address from,
        address to
    )
        public;

    function setProductReceived(
        bytes32 productHash,
        address from,
        address by
    )
        public;

    function getProductInfo(bytes32 productHash)
        public
        view
        returns (
            address purchaser,
            uint256 tokenId,
            string memory productName
        );

    function productSentFrom(bytes32 productHash, address from)
        public
        view
        returns (address);

    function productReceivedFrom(bytes32 productHash, address from)
        public
        view
        returns (address);

    function getHashFromTokenId(uint256 tokenId) public view returns (bytes32);
    function productExists(bytes32 productHash) public view returns (bool);
}
