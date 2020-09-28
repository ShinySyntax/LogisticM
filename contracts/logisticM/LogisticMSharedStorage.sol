// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "../access/owner/OwnerStorage.sol";
import "../access/AccessStorage.sol";
import "../ERC721Token/ERC721LogisticM/ERC721LogisticMStorage.sol";
import "../name/NameStorage.sol";
import "../pause/PauseStorage.sol";
import "../product/ProductStorage.sol";


/**
 * @title LogisticMSharedStorage
 * @dev This contract defines the storage layout of the proxy contract and all the logic contracts.
 */
contract LogisticMSharedStorage is
    OwnerStorage,
    AccessStorage,
    ERC721LogisticMStorage,
    NameStorage,
    PauseStorage,
    ProductStorage {
    bool internal lock = true;
}
