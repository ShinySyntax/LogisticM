pragma solidity ^0.5.0;


contract ProductManager {
    struct Product {
        address purchaser;
        uint256 tokenId;
        string productName;
        mapping (address => address) sent; // from -> to
        mapping (address => address) received; // from -> by
    }

    // Mapping from productHash to Product
    mapping (bytes32 => Product) public _products;

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

    function productsSentFrom(bytes32 productHash, address from)
        public
        view
        returns (address)
    {
        return _getProduct(productHash).sent[from];
    }

    function productsReceivedFrom(bytes32 productHash, address from)
        public
        view
        returns (address)
    {
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

    function productExists(bytes32 productHash) public view returns (bool) {
        return _getProduct(productHash).purchaser != address(0);
    }

    function getTokenId(bytes32 productHash) public view returns (uint256) {
        return _products[productHash].tokenId;
    }

    function _getProduct(bytes32 productHash) internal view
    returns (Product storage) {
        return _products[productHash];
    }
}
