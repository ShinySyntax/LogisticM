// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;


/**
 * @title Ownable
 * @dev Deinfes onlyOwner modifier.
 */
contract Ownable {
    /**
     * @dev This modifier restricts access only to the owner of Logistic.
     * @param owner_ The owner variable of the proxy storage
     */
    modifier onlyOwner(address owner_) {
        require(
            owner_ == msg.sender,
            "Ownable: caller is not the owner"
        );
        _;
    }
}
