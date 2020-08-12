pragma solidity ^0.5.0;

import "./ERC721/ERC721Pausable.sol";


contract ProductManager is ERC721Pausable {
    struct Product {
        address purchaser;
        uint256 tokenId;
        string productName;
        mapping (address => address) sent; // from -> to
        mapping (address => address) received; // from -> by
    }

    // Mapping from productHash to Product
    mapping (bytes32 => Product) internal _products;

    // Mapping from tokenId to productHash
    mapping (uint256 => bytes32) public tokenToProductHash;

    function getProductInfo(bytes32 productHash)
        public
        view
        returns (
            address purchaser,
            uint256 tokenId,
            string memory productName
        )
    {
        return (
            _getProduct(productHash).purchaser,
            _getProduct(productHash).tokenId,
            _getProduct(productHash).productName
        );
    }

    function productsSentFrom(bytes32 productHash, address from) public view
    returns (address) {
        return _getProduct(productHash).sent[from];
    }

    function productsReceivedFrom(bytes32 productHash, address from) public
    view returns (address) {
        return _getProduct(productHash).received[from];
    }

    function _newProduct(
        address supplier,
        bytes32 productHash,
        address purchaser,
        uint256 tokenId,
        string memory productName
    )
        internal
        onlySupplier(supplier)
    {
        tokenToProductHash[tokenId] = productHash;
        _products[productHash] = Product(purchaser, tokenId, productName);
        _mint(supplier);
    }

    function _setProductSent(bytes32 productHash, address from, address to)
    internal {
        _getProduct(productHash).sent[from] = to;
    }

    function _setProductReceived(bytes32 productHash, address from,
    address by) internal {
        _getProduct(productHash).received[from] = by;
    }

    function _getProduct(bytes32 productHash) internal view
    returns (Product storage) {
        return _products[productHash];
    }
}
