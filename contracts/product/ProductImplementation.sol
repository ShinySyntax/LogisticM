pragma solidity 0.5.5;

import "../logistic/LogisticSharedStorage.sol";
import "./ProductInterface.sol";
import "../commons/Lock.sol";
import "../commons/BytesLib.sol";
import "../upgradeability/ImplementationBase.sol";


/**
 * @title ProductImplementation
 * @dev The Product logic contract. It is mainly used by the Handover logic
 * contract because it defines some lower level methods to handle product state.
 */
contract ProductImplementation is
    ProductInterface,
    LogisticSharedStorage,
    Lock,
    ImplementationBase {

    /**
     * @dev Create a product.
     * This function is locked.
     * @param productHash The product hash: sha3 of the product ID.
     * @param purchaser The address of the person who purchased to product.
     * @param productNameBytes32 The name of the product in bytes32, converted to string and stored.
     */
    function newProduct(
        bytes32 productHash,
        address purchaser,
        bytes32 productNameBytes32
    )
        public
        locked(lock)
    {
        require(
            productExists(productHash) == false,
            "Logistic: This product already exists"
        );

        uint256 tokenId = abi.decode(dCall(
            abi.encodeWithSignature("getCounter()")), (uint256));
        string memory productName = BytesLib.bytes32ToString(
            productNameBytes32
        );
        tokenToProductHash[tokenId] = productHash;
        _products[productHash] = Product(purchaser, tokenId, productName);
        dCall(abi.encodeWithSignature("mint(address)", msg.sender));

        emit NewProduct(msg.sender, purchaser, productHash, productName);
    }

    /**
     * @dev Tell that `from` sent the product `productHash` to `to`.
     * This function is locked.
     * @param productHash The product hash: sha3 of the product ID.
     * @param from The address of the sender.
     * @param to The address of the receiver.
     */
    function setProductSent(
        bytes32 productHash,
        address from,
        address to
    )
        public
        locked(lock)
    {
        require(from != address(0), "Product: from is the zero address");
        require(to != address(0), "Product: to is the zero address");
        require(
            productExists(productHash),
            "Product: this product does not exist"
        );

        _getProduct(productHash).sent[from] = to;
        string memory productName = _getProduct(productHash).productName;
        emit ProductShipped(from, to, productHash, productName);
    }

    /**
     * @dev Tell that `by` received the product `productHash` from `from`.
     * This function is locked.
     * @param productHash The product hash: sha3 of the product ID.
     * @param from The address of the sender.
     * @param by The address of the receiver.
     */
    function setProductReceived(
        bytes32 productHash,
        address from,
        address by
    )
        public
        locked(lock)
    {
        require(from != address(0), "Product: from is the zero address");
        require(by != address(0), "Product: by is the zero address");
        require(
            productExists(productHash),
            "Product: this product does not exist"
        );

        _getProduct(productHash).received[from] = by;
        string memory productName = _getProduct(productHash).productName;
        emit ProductReceived(from, by, productHash, productName);
    }

    /**
     * @dev Get informations abut the product `productHash`.
     * @param productHash The product hash: sha3 of the product ID.
     * @return address The address of thepurchaser
     * @return uint256 The token ID
     * @return string The product name
     */
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

    /**
     * @dev Return the address that `from` sent the product `productHash`.
     * @param productHash The product hash: sha3 of the product ID.
     * @param from The address of the sender.
     * @return address The address to whom the product was sent.
     */
    function productSentFrom(bytes32 productHash, address from)
        public
        view
        returns (address sentTo)
    {
        return _getProduct(productHash).sent[from];
    }

    /**
     * @dev Return address of the account that received the product `productHash` from `from`.
     * @param productHash The product hash: sha3 of the product ID.
     * @param from The address of the sender.
     * @return address The address of the receiver.
     */
    function productReceivedFrom(bytes32 productHash, address from)
        public
        view
        returns (address)
    {
        return _getProduct(productHash).received[from];
    }

    /**
     * @dev Return the product hash of the product corresponding to the given `tokenId`.
     * @param tokenId The ERC721 token ID corresponding to the product.
     * @return bytes32 The product hash.
     */
    function getHashFromTokenId(uint256 tokenId) public view returns (bytes32) {
        return tokenToProductHash[tokenId];
    }

    /**
     * @dev Return true if the product exists.
     * @param productHash The product hash.
     * @return bool true or false.
     */
    function productExists(bytes32 productHash) public view returns (bool) {
        return _getProduct(productHash).purchaser != address(0);
    }

    /**
     * @dev Return the `Product` struct instance of the given `productHash`.
     * @param productHash The product hash: sha3 of the product ID.
     * @return Product The `Product` struct instance.
     */
    function _getProduct(bytes32 productHash)
        internal
        view
        returns (Product storage)
    {
        return _products[productHash];
    }
}
