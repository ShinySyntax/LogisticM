pragma solidity ^0.5.0;

import "./LogisticEvents.sol";
import "../proxy/UpgradeabilityProxy.sol";
import "../commons/Restricted.sol";
import "../commons/Pausable.sol";
import "../commons/Ownable.sol";
import "../commons/Bytes4Lib.sol";


contract LogisticProxy is UpgradeabilityProxy,
    LogisticEvents,
    Restricted,
    Pausable,
    Ownable {
    modifier restrictedMode() {
        lock = false;
        _;
        lock = true;
    }

    constructor(string memory _version) public UpgradeabilityProxy(_version) {}

    function initialize(address sender) public {
        require(msg.sender == address(registry));
        owner = msg.sender;
        dCall(abi.encodeWithSignature("initializeERC721()"));
    }

    function createProduct(
        address purchaser,
        bytes32 productHash,
        string calldata productName,
        string calldata purchaserName
    )
        external
        restrictedMode
        whenNotPaused
    {
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "isSupplier(address)", msg.sender)), (bool)),
            "Logistic: Invalid purchaser"
        );
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "getRole(address)", purchaser)), (uint)) == 0,
            "Logistic: Invalid purchaser"
        );
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "productExists(bytes32)", productHash)), (bool)),
            "Logistic: This product already exists"
        );

        uint256 tokenId = abi.decode(dCall(
            abi.encodeWithSignature("getCounter()")), (uint256));
        dCall(
            abi.encodeWithSignature(
                "newProduct(bytes32,address,uint256,string)",
                productHash, purchaser, tokenId, productName
            )
        );
        dCall(abi.encodeWithSignature("mint(address)", msg.sender));
        dCall(
            abi.encodeWithSignature(
                "setName(address, string)",
                msg.sender,
                purchaserName
            )
        );
    }

    function send(address to, bytes32 productHash)
        external
        whenNotPaused
        restrictedMode
    {
        uint256 senderRole = abi.decode(dCall(abi.encodeWithSignature(
            "getRole(address)", msg.sender)), (uint));
        require(
            senderRole == 1 || senderRole == 2,
            "Logistic: Caller can't send product"
        );
        uint256 receiverRole = abi.decode(dCall(abi.encodeWithSignature(
            "getRole(address)", to)), (uint));
        require(
            receiverRole != 1 && receiverRole != 3,
            "Logistic: Can't send to supplier nor owner"
        );
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "productsSentFrom(bytes32, address)", productHash, msg.sender)
            ), (address)) == address(0),
            "Logistic: Can't send a product in pending delivery"
        );

        (address purchaser, uint256 tokenId, string memory productName) =
            abi.decode(
                dCall(abi.encodeWithSignature(
                    "getProductInfo(bytes32)", productHash)),
                (address, uint256, string)
        );

        if (receiverRole == 0) {
            // the receiver is a purchaser (RolesLibrary.RoleNames.Nobody)
            require(purchaser == to,
                "Logistic: This purchaser has not ordered this product");
        }

        address sender = abi.decode(dCall(abi.encodeWithSignature(
            "productsReceivedFrom(bytes32, address)", productHash, msg.sender)
        ), (address));

        if (sender == to) {
            _handoverToken(tokenId, msg.sender, to, productHash, productName);
        } else {
            dCall(abi.encodeWithSignature(
                "approve(address,uint256)",
                to, tokenId
            ));
            dCall(abi.encodeWithSignature(
                "approve(address,uint256)",
                to, tokenId
            ));
        }

        dCall(abi.encodeWithSignature(
            "setProductSent(bytes32,address,address,string)",
            productHash, msg.sender, to, productName
        ));
    }

    function receive(address from, bytes32 productHash)
        external
        whenNotPaused
        restrictedMode
    {
        uint256 msgSenderRole = abi.decode(dCall(abi.encodeWithSignature(
            "getRole(address)", msg.sender)), (uint));
        require(
            msgSenderRole != 1 && msgSenderRole != 3,
            "Logistic: Caller can't receive product"
        );
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "productsReceivedFrom(bytes32, address)", productHash, from)
            ), (address)) == address(0),
            "Logistic: Already received"
        );
        uint256 senderRole = abi.decode(dCall(abi.encodeWithSignature(
            "getRole(address)", from)), (uint));
        require(
            senderRole == 1 || senderRole == 2,
            "Logistic: Sender is not delivery man nor supplier"
        );

        (address purchaser, uint256 tokenId, string memory productName) =
            abi.decode(
                dCall(abi.encodeWithSignature(
                    "getProductInfo(bytes32)", productHash)),
                (address, uint256, string)
        );

        if (msgSenderRole == 0) {
            // the caller is a purchaser
            require(purchaser == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }

        address receiver = abi.decode(dCall(abi.encodeWithSignature(
            "productsSentFrom(bytes32, address)", productHash, from)
        ), (address));
        if (receiver == msg.sender) {
            _handoverToken(tokenId, from, msg.sender, productHash, productName);
        }

        dCall(abi.encodeWithSignature(
            "setProductReceived(bytes32,address,address,string)",
            productHash, from, msg.sender, productName
        ));
    }

    function _handoverToken(
        uint256 tokenId,
        address from,
        address to,
        bytes32 productHash,
        string memory productName
    )
        internal
    {
        dCall(abi.encodeWithSignature(
            "transferFrom(address,address,uint256)",
            from, to, tokenId
        ));
        emit Handover(from, to, productHash, productName);
    }

    function dCall(bytes memory encoded) internal returns (bytes memory) {
        // Delegate call to the contract implementation of the given encoded
        // signature
        bytes4 func = Bytes4Lib.convertBytesToBytes4(encoded);
        address imp = registry.getFunction(version_, func);
        (bool success, bytes memory result) = imp.delegatecall(encoded);
        require(success, "LogisticProxy: delegate call failed");
        return result;
    }
}
