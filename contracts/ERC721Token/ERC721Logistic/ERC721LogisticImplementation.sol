pragma solidity ^0.5.0;

import "../ERC721Base/ERC721BaseImplementation.sol";
import "./ERC721LogisticInterface.sol";
import "../../commons/Lock.sol";
import "../../upgradeability/Upgradeable.sol";


/**
 * @title ERC721LogisticImplementation
 * @dev The ERC721Logistic logic contract. It changes the behaviour of the ERC721
 * Token defined in ERC721BaseImplementation: some functions are locked because
 * users need to go through the handover process defined in the Handover logic
 * contract.
 * ERC721 tokens are minted incrementally.
 */
contract ERC721LogisticImplementation is ERC721BaseImplementation, ERC721LogisticInterface, Upgradeable, Lock {
    /**
     * @dev Initialize the logic contract.
     */
    function initializeERC721() public {
        super.initialize(msg.sender);
        _name = "LogisticM";
        _symbol = "LM";

        // register the supported interfaces to conform to ERC721 via ERC165
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/introspection/ERC165.sol
        bytes4 interfaceId = _INTERFACE_ID_ERC721_METADATA;
        require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceId] = true;
    }

    /**
     * @dev Mint a token.
     * The value of the token if the current value of the counter.
     * Then, the counter is incremented.
     * This function is locked.
     * @param to The address that receive the minted token
     */
    function mint(address to) public locked(lock) {
        _mint(to, counter);
        counter = counter.add(1);
    }

    /**
     * @dev The `approve` function of ERC721.
     * This function is locked.
     * @param to address to be approved for the given token ID
     * @param tokenId uint256 ID of the token to be approved
     */
    function approve(address to, uint256 tokenId) public locked(lock) {
        super.approve(to, tokenId);
    }

    /**
     * @dev The `setApprovalForAll` function of ERC721.
     * This function always reverts.
     */
    function setApprovalForAll(address, bool) public {
        revert("ERC721Logistic: can not approve for all");
    }

    /**
     * @dev The `transferFrom` function of ERC721.
     * This function is locked.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(address from, address to, uint256 tokenId)
        public
        locked(lock)
    {
        super.transferFrom(from, to, tokenId);
    }

    /**
     * @dev The `safeTransferFrom` function of ERC721.
     * This function always reverts.
     */
    function safeTransferFrom(address, address, uint256) public {
        revert("ERC721Logistic: can not transfer");
    }

    /**
     * @dev The `safeTransferFrom` function of ERC721 with data.
     * This function always reverts.
     */
    function safeTransferFrom(address, address, uint256, bytes memory) public {
        revert("ERC721Logistic: can not transfer");
    }

    /**
     * @dev Return the counter
     * @return The current value of counter
     */
    function getCounter() public view returns (uint256) {
        return counter;
    }
}
