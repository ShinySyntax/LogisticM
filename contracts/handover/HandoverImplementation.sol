pragma solidity ^0.5.0;

import "./HandoverInterface.sol";
import "../logistic/LogisticSharedStorage.sol";
import "../upgradeability/ImplementationBase.sol";
import "../commons/Pausable.sol";


/**
 * @title HandoverImplementation
 * @dev The Handover logic contract. This manages the way tokens that represent
 * products are handing over to other users.
 */
contract HandoverImplementation is
    HandoverInterface,
    LogisticSharedStorage,
    Pausable,
    ImplementationBase {

    /**
     * @dev Create a product. Mint a token corresponding to this product.
     * @param purchaser The address of the person who purchased to product.
     * @param productHash The product hash: sha3 of the product ID.
     * @param productNameBytes32 The name of the product in bytes, sent to `ProductImplementation`.
     * @param purchaserNameBytes32 The name of the purchaser, sent to `NameImplementation`.
     */
    function createProduct(
        address purchaser,
        bytes32 productHash,
        bytes32 productNameBytes32,
        bytes32 purchaserNameBytes32
    )
        external
        whenNotPaused(paused)
    {
        lock = false;
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "isSupplier(address)", msg.sender)), (bool)),
            "Logistic: Caller is not Supplier"
        );
        require(
            abi.decode(dCall(abi.encodeWithSignature(
                "getRole(address)", purchaser)), (uint)) == 0,
            "Logistic: Invalid purchaser"
        );

        dCall(
            abi.encodeWithSignature(
                "newProduct(bytes32,address,bytes32)",
                productHash, purchaser, productNameBytes32
            )
        );
        dCall(
            abi.encodeWithSignature(
                "setName(address,bytes32)",
                purchaser,
                purchaserNameBytes32
            )
        );
        lock = true;
    }

    /**
     * @dev Send a product. The user say: "I am shipping the product `productHash`
     * to the address `to`."
     * @param to The person that will receive the product.
     * @param productHash The product hash: sha3 of the product ID.
     */
    function send(address to, bytes32 productHash)
        external
        whenNotPaused(paused)
    {
        lock = false;
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
                "productSentFrom(bytes32,address)", productHash, msg.sender)
            ), (address)) == address(0),
            "Logistic: Can't send a product in pending delivery"
        );

        (address purchaser, uint256 tokenId, string memory productName) =
            abi.decode(
                dCall(
                    abi.encodeWithSignature(
                        "getProductInfo(bytes32)",
                        productHash
                    )
                ),
            (address, uint256, string)
        );

        if (receiverRole == 0) {
            // the receiver is a purchaser (RolesLibrary.RoleNames.Nobody)
            require(purchaser == to,
                "Logistic: This purchaser has not ordered this product");
        }

        address sender = abi.decode(
            dCall(
                abi.encodeWithSignature(
                    "productReceivedFrom(bytes32,address)",
                    productHash,
                    msg.sender
                )
            ),
            (address)
        );

        if (sender == to) {
            _handoverToken(tokenId, msg.sender, to, productHash, productName);
        } else {
            dCall(abi.encodeWithSignature(
                "approve(address,uint256)",
                to, tokenId
            ));
        }

        dCall(abi.encodeWithSignature(
            "setProductSent(bytes32,address,address)",
            productHash, msg.sender, to
        ));
        lock = true;
    }

    /**
     * @dev Receive a product. The user say: "The address `from` sent me the product
     `productHash` and I have received it."
     * @param from The person who has sent the product.
     * @param productHash The product hash: sha3 of the product ID.
     */
    function receive(address from, bytes32 productHash)
        external
        whenNotPaused(paused)
    {
        lock = false;
        // only DeliveryMan or Purchaser can receive a product
        uint256 msgSenderRole = abi.decode(dCall(abi.encodeWithSignature(
            "getRole(address)", msg.sender)), (uint));
        require(
            msgSenderRole != 1 && msgSenderRole != 3,
            "Logistic: Caller can't receive product"
        );
        require(
            abi.decode(
                dCall(abi.encodeWithSignature(
                    "productReceivedFrom(bytes32,address)",
                    productHash,
                    from)),
                (address)
            ) == address(0),
            "Logistic: Already received"
        );
        // Comment these lines because if a supplier or a delivery man has his
        // role revoked, nobody would be able to receive product that he sent.
        // uint256 senderRole = abi.decode(dCall(abi.encodeWithSignature(
        //     "getRole(address)", from)), (uint));
        // require(
        //     senderRole == 1 || senderRole == 2,
        //     "Logistic: Sender is not delivery man nor supplier"
        // );

        (address purchaser, uint256 tokenId, string memory productName) =
            abi.decode(
                dCall(abi.encodeWithSignature(
                    "getProductInfo(bytes32)",
                    productHash)),
                (address, uint256, string)
        );

        if (msgSenderRole == 0) {
            // the caller is a purchaser
            require(purchaser == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }

        address receiver = abi.decode(dCall(abi.encodeWithSignature(
            "productSentFrom(bytes32,address)", productHash, from)
        ), (address));
        if (receiver == msg.sender) {
            _handoverToken(tokenId, from, msg.sender, productHash, productName);
        }

        dCall(abi.encodeWithSignature(
            "setProductReceived(bytes32,address,address)",
            productHash,
            from,
            msg.sender
        ));
        lock = true;
    }

    /**
     * @dev Handover a product: call transferFrom ERC721 function.
     * This function is called only when all the conditions are met to perform
     * a handover.
     * @param tokenId The person who has sent the product.
     * @param from The person who has sent the product.
     * @param to The person who has received the product.
     * @param productHash The product hash: sha3 of the product ID.
     * @param productName The name of the product.
     */
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
}
