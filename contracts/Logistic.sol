pragma solidity ^0.5.0;

import "./LogisticBase/ILogisticBase.sol";
import "./ERC721/ILogisticToken.sol";


contract Logistic {
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
    ILogisticBase private logisticBase;
    ILogisticToken private logisticToken;

    constructor(
        address productManager,
        address logisticBaseAddress,
        address logisticTokenAddress
    ) public {
        _productManager = productManager;
        logisticBase = ILogisticBase(logisticBaseAddress);
        logisticToken = ILogisticToken(logisticTokenAddress);
    }

    modifier onlySupplier {
        require(
            logisticBase.isSupplier(msg.sender),
            "Logistic: caller is not supplier");
        _;
    }

    modifier notSupplier {
        require(
            !logisticBase.isSupplier(msg.sender),
            "Logistic: caller is owner");
        _;
    }

    modifier supplierOrDeliveryMan {
        require(
            logisticBase._isSupplierOrDeliveryMan(msg.sender),
            "Logistic: caller is not supplier nor delivery man");
        _;
    }

    modifier notOwner {
        require(
            logisticBase.owner() != msg.sender,
            "Logistic: caller is owner");
        _;
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
        logisticBase._setName(purchaser, purchaserName);
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
        require(
            logisticBase.owner() != purchaser
                && !logisticBase._isSupplierOrDeliveryMan(purchaser),
            "Logistic: Can't create for supplier nor owner nor delivery man");
        (bool success, bytes memory result) = _productManager.call(
            abi.encodeWithSignature("productExists(bytes32)", productHash)
        );
        require(
            !abi.decode(result, (bool)),
            "Logistic: This product already exists"
        );

        uint256 tokenId = logisticToken.getCounter();
        _productManager.call(
            abi.encodeWithSignature(
                "_createProduct(bytes32,uint256,address,string)"
            , productHash, tokenId, purchaser, productName)
        );
        logisticToken.mint(msg.sender);

        emit NewProduct(msg.sender, purchaser, productHash, productName);
    }

    function sendWithName(string calldata receiverName, bytes32 productHash)
        external
        supplierOrDeliveryMan
    {
        send(logisticBase.getAddress(receiverName), productHash);
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
        require(
            logisticBase.owner() != receiver
                && !logisticBase.isSupplier(receiver),
            "Logistic: Can't send to supplier nor owner");
        if (!logisticBase.isDeliveryMan(receiver)) {
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
            logisticToken._setRestricted(false);
            (success, result) = _productManager.call(
                abi.encodeWithSignature("getTokenId(butes32)", productHash)
            );
            logisticToken.approve(receiver, abi.decode(result, (uint256)));
            logisticToken._setRestricted(true);
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
        receive(logisticBase.getAddress(senderName), productHash);
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
        require(logisticBase._isSupplierOrDeliveryMan(sender),
            "Logistic: sender is not delivery man nor supplier");
        if (!logisticBase.isDeliveryMan(msg.sender)) {
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
        logisticToken._setRestricted(false);
        logisticToken.transferFrom(from, to, abi.decode(result, (uint256)));
        logisticToken._setRestricted(true);
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
