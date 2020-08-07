pragma solidity ^0.5.0;

import "./ProductLibrary.sol";
import "./ERC721/ERC721Pausable.sol";


contract Logistic is ERC721Pausable {
    using ProductLibrary for ProductLibrary.Data;
    // Naming convention:
    //    uint256 tokenId (ERC721)
    //    bytes32 productHash
    //    string productName

    event NewProduct(
        address indexed by,
        address indexed purchaser,
        bytes32 indexed productHash,
        string productName
    );

    event ProductShipped(
        address indexed from,
        address indexed to,
        bytes32 indexed productHash,
        string productName
    );

    event ProductReceived(
        address indexed from,
        address indexed by,
        bytes32 indexed productHash,
        string productName
    );

    event Handover(
        address indexed from,
        address indexed to, bytes32
        indexed productHash,
        string productName
    );

    ProductLibrary.Data private data;

    function createProductWithName(
        address purchaser,
        bytes32 productHash,
        string memory productName,
        string memory purchaserName
    )
        public
        onlySupplier
    {
        _setName(purchaser, purchaserName);
        createProduct(purchaser, productHash, productName);
    }

    function createProduct(
        address purchaser,
        bytes32 productHash,
        string memory productName
    )
        public
        onlySupplier
    {
        require(owner() != purchaser && !_isSupplierOrDeliveryMan(purchaser),
            "Logistic: Can't create for supplier nor owner nor delivery man");
        require(
            !data._productExists(productHash),
            "Logistic: This product already exists"
        );

        uint256 tokenId = counter;
        data._tokenToProductHash[tokenId] = productHash;
        data._products[productHash] = ProductLibrary.Product(purchaser, tokenId, productName);
        _mint(msg.sender);

        emit NewProduct(msg.sender, purchaser, productHash, productName);
        // assert(_productExists(productHash, productName));
    }

    function sendWithName(string memory receiverName, bytes32 productHash)
        public
        supplierOrDeliveryMan
    {
        send(addresses[receiverName], productHash);
    }

    function send(address receiver, bytes32 productHash) public
        supplierOrDeliveryMan
    {
        require(data.productsSentFrom(productHash, msg.sender) == address(0),
            "Logistic: Can't send a product in pending delivery");
        require(owner() != receiver && !isSupplier(receiver),
            "Logistic: Can't send to supplier nor owner");
        if (!isDeliveryMan(receiver)) {
            // the receiver is a purchaser
            require(data.productsOrders(productHash) == receiver,
                "Logistic: This purchaser has not ordered this product");
        }

        if (data.productsReceivedFrom(productHash, msg.sender) == receiver) {
            _handoverToken(msg.sender, receiver, productHash);
        } else {
            _setRestricted(false);
            approve(receiver, data._getTokenId(productHash));
            _setRestricted(true);
        }
        data._setProductSent(productHash, msg.sender, receiver);

        emit ProductShipped(msg.sender, receiver, productHash,
            data._getProductName(productHash));
    }

    function receiveWithName(string memory senderName, bytes32 productHash)
        public
        notOwner
    {
        receive(addresses[senderName], productHash);
    }

    function receive(address sender, bytes32 productHash)
        public
        notOwner
        notSupplier
    {
        require(data.productsReceivedFrom(productHash, sender) == address(0),
            "Logistic: Already received");
        require(_isSupplierOrDeliveryMan(sender),
            "Logistic: sender is not delivery man nor supplier");
        if (!isDeliveryMan(msg.sender)) {
            // the caller is a purchaser
            require(data.productsOrders(productHash) == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }

        if (data.productsSentFrom(productHash, sender) == msg.sender) {
            _handoverToken(sender, msg.sender, productHash);
        }
        data._setProductReceived(productHash, sender, msg.sender);

        emit ProductReceived(sender, msg.sender, productHash,
            data._getProductName(productHash));
    }

    function _handoverToken(address from, address to, bytes32 productHash)
        internal
    {
        _setRestricted(false);
        transferFrom(from, to, data._getTokenId(productHash));
        _setRestricted(true);
        emit Handover(from, to, productHash, data._getProductName(productHash));
    }
}
