pragma solidity ^0.5.0;

import "./Pausable.sol";


contract Logistic is Pausable {
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

    address private _productManager;

    constructor (address productManager) public {
        _productManager = productManager;
    }

    function createProductWithName(
        address purchaser,
        bytes32 productHash,
        string calldata productName,
        string calldata purchaserName
    )
        external
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
        require(owner != purchaser && !_isSupplierOrDeliveryMan(purchaser),
            "Logistic: Can't create for supplier nor owner nor delivery man");
        (bool success, bytes memory result) = _productManager.call(
            abi.encodeWithSignature("productExists(bytes32)", productHash)
        );
        require(
            !abi.decode(result, (bool)),
            "Logistic: This product already exists"
        );

        uint256 tokenId = counter;
        _productManager.call(
            abi.encodeWithSignature(
                "_createProduct(bytes32,uint256,address,string)"
            , productHash, tokenId, purchaser, productName)
        );
        _mint(msg.sender);

        emit NewProduct(msg.sender, purchaser, productHash, productName);
    }

    function sendWithName(string calldata receiverName, bytes32 productHash)
        external
        supplierOrDeliveryMan
    {
        send(addresses[receiverName], productHash);
    }

    function send(address receiver, bytes32 productHash) public
        supplierOrDeliveryMan
    {
        (bool success, bytes memory result) = _productManager.call(
            abi.encodeWithSignature(
                "productsSentFrom(bytes32)",
                productHash, msg.sender)
        );
        require(abi.decode(result, (address)) == address(0),
            "Logistic: Can't send a product in pending delivery");
        require(owner != receiver && !isSupplier(receiver),
            "Logistic: Can't send to supplier nor owner");
        if (!isDeliveryMan(receiver)) {
            // the receiver is a purchaser
            (success, result) = _productManager.call(
                abi.encodeWithSignature("productsOrders(bytes32", productHash)
            );
            require(abi.decode(result, (address)) == receiver,
                "Logistic: This purchaser has not ordered this product");
        }

        (success, result) = _productManager.call(
            abi.encodeWithSignature(
                "productsReceivedFrom(bytes32)",
                productHash, msg.sender
            )
        );

        if (abi.decode(result, (address)) == receiver) {
            _handoverToken(msg.sender, receiver, productHash);
        } else {
            _setRestricted(false);
            (success, result) = _productManager.call(
                abi.encodeWithSignature("getTokenId(butes32)", productHash)
            );
            approve(receiver, abi.decode(result, (uint256)));
            _setRestricted(true);
        }
        _productManager.call(abi.encodeWithSignature(
            "_setProductSent(bytes32,address, address)",
            productHash, msg.sender, receiver
        ));

        (success, result) = _productManager.call(
            abi.encodeWithSignature("getProductName(bytes32)", productHash)
        );
        emit ProductShipped(
            msg.sender,
            receiver,
            productHash,
            abi.decode(result, (string))
        );
    }

    function receiveWithName(string calldata senderName, bytes32 productHash)
        external
        notOwner
    {
        receive(addresses[senderName], productHash);
    }

    function receive(address sender, bytes32 productHash)
        public
        notOwner
        notSupplier
    {
        (bool success, bytes memory result) = _productManager.call(
            abi.encodeWithSignature(
                "productsReceivedFrom(bytes32)", productHash, sender
            )
        );
        require(abi.decode(result, (address)) == address(0),
            "Logistic: Already received");
        require(_isSupplierOrDeliveryMan(sender),
            "Logistic: sender is not delivery man nor supplier");
        if (!isDeliveryMan(msg.sender)) {
            // the caller is a purchaser
            (success, result) = _productManager.call(
                abi.encodeWithSignature("productsOrders(bytes32", productHash)
            );
            require(abi.decode(result, (address)) == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }

        (success, result) = _productManager.call(
            abi.encodeWithSignature(
                "productsSentFrom(bytes32)", productHash, sender
            )
        );
        if (abi.decode(result, (address)) == msg.sender) {
            _handoverToken(sender, msg.sender, productHash);
        }
        _productManager.call(abi.encodeWithSignature("_setProductReceived(bytes32)", productHash, sender, msg.sender));

        (success, result) = _productManager.call(
            abi.encodeWithSignature("getProductName(bytes32)", productHash)
        );
        emit ProductReceived(
            sender,
            msg.sender,
            productHash,
            abi.decode(result, (string))
        );
    }

    function _handoverToken(address from, address to, bytes32 productHash)
        internal
    {
        (bool success, bytes memory result) = _productManager.call(
            abi.encodeWithSignature("getTokenId(bytes32)", productHash)
        );
        _setRestricted(false);
        transferFrom(from, to, abi.decode(result, (uint256)));
        _setRestricted(true);
        (success, result) = _productManager.call(
            abi.encodeWithSignature("getProductName(bytes32)", productHash)
        );
        emit Handover(
            from,
            to,
            productHash,
            abi.decode(result, (string))
        );
    }
}
