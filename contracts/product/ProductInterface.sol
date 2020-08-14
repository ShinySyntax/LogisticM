pragma solidity ^0.5.0;

import "./ProductEvents.sol";


contract ProductInterface is ProductEvents {
    function newProduct(
        bytes32 productHash,
        address purchaser,
        uint256 tokenId,
        string memory productName
    )
        public;

    function setProductSent(
        bytes32 productHash,
        address from,
        address to,
        string memory productName
    )
        public;

    function setProductReceived(
        bytes32 productHash,
        address from,
        address by,
        string memory productName
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

    function productsSentFrom(bytes32 productHash, address from)
        public
        view
        returns (address);

    function productsReceivedFrom(bytes32 productHash, address from)
        public
        view
        returns (address);

    function productExists(bytes32 productHash) public view returns (bool);
}
