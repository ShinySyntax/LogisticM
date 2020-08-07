pragma solidity ^0.5.0;


library ProductLibrary {
    /*
    Usage: `using ProductLibrary for ProductLibrary.Data;`
    `ProductLibrary.Data private data;`
    */

    struct Product {
        address purchaser;
        uint256 tokenId;
        string productName;
        mapping (address => address) sent; // from -> to
        mapping (address => address) received; // from -> by
    }

    struct Data {
        // Mapping from productHash to Product
        mapping (bytes32 => Product) _products;

        // Mapping from tokenId to productHash
        mapping (uint256 => bytes32) _tokenToProductHash;
    }

    function productsOrders(Data storage self, bytes32 productHash) public view returns (address) {
        return _getProduct(self, productHash).purchaser;
    }

    function productsSentFrom(
        Data storage self,
        bytes32 productHash,
        address from
    )
        public
        view
        returns (address)
    {
        return _getProduct(self, productHash).sent[from];
    }

    function productsReceivedFrom(
        Data storage self,
        bytes32 productHash,
        address from
    )
        public
        view
        returns (address)
    {
        return _getProduct(self, productHash).received[from];
    }

    function getProductHash(Data storage self, uint256 tokenId)
        public
        view
        returns (bytes32)
    {
        return self._tokenToProductHash[tokenId];
    }

    function getProductName(Data storage self, uint256 tokenId)
        public
        view
        returns (string memory)
    {
        return _getProduct(self, self._tokenToProductHash[tokenId]).productName;
    }

    function _setProductSent(
        Data storage self,
        bytes32 productHash,
        address from,
        address to
    )
        internal
    {
        _getProduct(self, productHash).sent[from] = to;
    }

    function _setProductReceived(
        Data storage self,
        bytes32 productHash,
        address from,
        address by
    )
        internal
    {
        _getProduct(self, productHash).received[from] = by;
    }

    function _productExists(Data storage self, bytes32 productHash)
        internal
        view
        returns (bool)
    {
        return _getProduct(self, productHash).purchaser != address(0);
    }

    function _getProduct(Data storage self, bytes32 productHash)
        internal
        view
        returns (Product storage)
    {
        return self._products[productHash];
    }

    function _getTokenId(Data storage self, bytes32 productHash)
        internal
        view
        returns (uint256)
    {
        return _getProduct(self, productHash).tokenId;
    }

    function _getProductName(Data storage self, bytes32 productHash)
        internal
        view
        returns (string memory)
    {
        return _getProduct(self, productHash).productName;
    }
}
